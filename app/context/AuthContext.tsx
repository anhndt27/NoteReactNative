import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import baseUrl from "../api/api";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | false;
    userId: string | null;
    groupId: number | null;
    groupName: string | null;
  };
  onRegister?: (
    userName: string,
    email: string,
    password: string
  ) => Promise<any>;
  onLogin?: (userName: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  updateGroupId?: (groupId: number | null) => Promise<any>;
}

const TOKEN_KEY = "my_secure_token";
const USER_ID = "my_userId";
const GROUP_ID = "my_groupId";
const GROUP_NAME = "my_groupName";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | false;
    userId: string | null;
    groupId: number | null;
    groupName: string | null;
  }>({
    token: null,
    authenticated: false,
    userId: null,
    groupId: null,
    groupName: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userId = await SecureStore.getItemAsync(USER_ID);
      const groupId = await SecureStore.getItemAsync(GROUP_ID);
      const groupName = await SecureStore.getItemAsync(GROUP_NAME);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
          userId: userId,
          groupId: Number(groupId),
          groupName: groupName,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      return await axios.post(`${baseUrl}/Account/register`, {
        username,
        email,
        password,
      });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${baseUrl}/Account/login`, {
        username,
        password,
      });

      setAuthState({
        token: result.data.token,
        authenticated: true,
        userId: result.data.userId,
        groupId: result.data.groupId,
        groupName: result.data.groupName,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      await SecureStore.setItemAsync(USER_ID, result.data.userId);
      if(result.data.groupId){
        await SecureStore.setItemAsync(GROUP_NAME, result.data.groupName);
        await SecureStore.setItemAsync(GROUP_ID, result.data.groupId.toString());
      }

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_ID);
      await SecureStore.deleteItemAsync(GROUP_ID);
      await SecureStore.deleteItemAsync(GROUP_NAME);

      axios.defaults.headers.common["Authorization"] = "";

      setAuthState({
        token: null,
        authenticated: false,
        userId: null,
        groupId: null,
        groupName: null,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateGroupId = async (newGroupId: number | null) => {
    try {
      if(newGroupId){
        await SecureStore.setItemAsync(GROUP_ID, newGroupId.toString());
      }
      else {
        await SecureStore.deleteItemAsync(GROUP_ID);
      }

      setAuthState((prevState) => ({
        ...prevState,
        groupId: newGroupId,
      }));
    } catch (error) {
      console.error("Error updating groupId:", error);
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    updateGroupId
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
