import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import baseUrl from "../api/api";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | false; userId: string | null; groupId: number | null; groupName: string | null};
    onRegister?: (userName: string, email: string, password: string) => Promise<any>;
    onLogin?: (userName: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my_secure_token';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | false;
        userId: string | null;
        groupId: number | null;
        groupName: string | null
    }>({
        token: null,
        authenticated: false,
        userId: null, 
        groupId: null,
        groupName: null,
    })

    useEffect(()=> {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("Stored:", token)

            if(token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setAuthState({
                    token: token,
                    authenticated: true,
                    userId: null,
                    groupId: null,
                    groupName: null
                });
            }
        }

        loadToken();
    }, [])

    const register = async (email: string, username: string, password: string) => {
        try {
            return await axios.post(`${baseUrl}/api/Account/register`, {username, email, password})
        } catch (e) {
            return {error: true, msg: (e as any).response.data.msg };
        }
    }

    const login = async (username: string, password: string) => {
        try {
            const result =  await axios.post(`${baseUrl}/Account/login`, {username, password});

            setAuthState({
                token: result.data.token,
                authenticated: true,
                userId: result.data.userId,
                groupId: result.data.groupId,
                groupName: result.data.groupName
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return {error: true, msg: (e as any).response.data.msg };
        }
    }

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        
            axios.defaults.headers.common['Authorization'] = '';
        
            setAuthState({
              token: null,
              authenticated: false,
              userId: null,
              groupId: null,
              groupName: null
            });
          } catch (error) {
            console.error("Error during logout:", error);
          }
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
