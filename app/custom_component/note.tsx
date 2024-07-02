import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import OptionNote from "./optionNote";
import { createNote, getNote, INodeListWithGroup, updateNote } from "../api/home.api";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateRandom } from "expo-auth-session/build/PKCE";

const Note = ({}) => {
  const { id, title } = useGlobalSearchParams();
  const { authState } = useAuth();
  const navigation = useNavigation();

  const [noteText, setNoteText] = useState<string>();
  const [dataOption, setDataOption] = useState({
    title: title,
    category: 0,
    status: 0,
  });
  const [loading, setLoading] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null); 

  const handlePresentModalPress = useCallback(() => {
    dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (authState && dataOption.category != 1) {
      const data = {
        title: dataOption.title,
        noteString: await editor.getHTML(),
        userId: authState?.userId,
        groupId: dataOption.category == 2 ? authState?.groupId : null,
        statusAccess: dataOption.status,
      };
      setNoteText(data.noteString);
      if(id != '0'){
        const res = await updateNote(authState?.token || "", Number(id), data)
      }
      else{
        const res = await createNote(authState?.token || "", data);
      }      
    }
    else {
      const data = {
        id: generateRandom(1, 9999),
        title: dataOption.title,
        noteString: await editor.getHTML(),
        statusAccess: dataOption.status,
        dateTime: new Date,
      }
      await saveToAsyncStorage(data);
    }
    setLoading(false);
  };

  const generateRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const saveToAsyncStorage = async (noteData: any) => {
    try {
      const existingNotes = await AsyncStorage.getItem('123');
      let notes = existingNotes ? JSON.parse(existingNotes) : [];
  
      notes.push(noteData);
  
      await AsyncStorage.setItem('123', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving note to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const getNoteContent = async () => {
      if (id) {
        try {
          const note = await getNote(authState?.token || "", Number(id));
          if (note) setNoteText(note.noteString);
        } catch (error) {
          console.error("Error fetching note content:", error);
        }
      }
    };

    getNoteContent();
  }, [id, authState?.token]);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: noteText,
  });

  useEffect(() => {
    if (noteText !== undefined) {
      editor.setContent(noteText);
    }
  }, [noteText, editor]);

  const dismiss = () => {
    editor.blur();
    Keyboard.dismiss();
    bottomSheetModalRef.current?.dismiss();
  };

  useEffect(() => {
    navigation.setOptions({
      title: dataOption.title,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={handlePresentModalPress} style={{ marginEnd: 8 }}>
            <TabBarIcon
              name={"ellipsis-horizontal-circle-outline"}
              color={"#000"}
            />
          </Pressable>
          <Pressable onPress={handleSubmit} style={{ marginEnd: 8 }}>
            <TabBarIcon name={"cloud-upload-outline"} color={"#000"} />
          </Pressable>
          <Pressable onPress={dismiss}>
            <TabBarIcon name={"chevron-down-circle-outline"} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, dataOption]);

  const handleUpdate = (data: any) => {
    setDataOption({
      title: data.title,
      category: data.category,
      status: data.status,
    });
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          {loading && (
            <ActivityIndicator
              style={{
                position: "absolute",
                top: 50,
                right: "45%",
                zIndex: 999,
              }}
              size="large"
              color="#000000"
            />
          )}
          <RichText editor={editor} />
          <KeyboardAvoidingView
            behavior={"padding"}
            style={{
              position: "absolute",
              width: "100%",
              bottom: 301,
            }}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </View>
        <OptionNote
          bottomSheetModalRef={bottomSheetModalRef}
          onUpdate={handleUpdate}
          optionNote={dataOption}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Note;
