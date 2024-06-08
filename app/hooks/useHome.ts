import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const useHome = () => {
    const [noteText, setNoteText] = useState();

    const handleSaveNote = async (title: string, value: string) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(title, jsonValue);
        } catch(e){
            console.log(e);
        }
    }

    const handleReadNote = async (title: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(title);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e){
            console.log(e)
        }
    }

    

    return {
        handleSaveNote,
        handleReadNote,
        noteText,
        setNoteText
    }
}

export default useHome;