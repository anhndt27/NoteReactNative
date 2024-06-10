import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import OptionNote from "./optionNote";

const Note = ({}) => {
  const [noteText, setNoteText] = useState("");
  const navigation = useNavigation();
  const { id, title } = useGlobalSearchParams();
  const [dataOption, setDataOption] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    dismiss()
    bottomSheetModalRef.current?.present();
  }, []);

  console.log(999, id, title);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: noteText,
  });

  const dismiss = () => {
    editor.blur();
    Keyboard.dismiss();
    bottomSheetModalRef.current?.dismiss();
  };

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={handlePresentModalPress} style={{ marginEnd: 8 }}>
            <TabBarIcon
              name={"ellipsis-horizontal-circle-outline"}
              color={"#000"}
            />
          </Pressable>
          <Pressable style={{ marginEnd: 8 }}>
            <TabBarIcon name={"cloud-upload-outline"} color={"#000"} />
          </Pressable>
          <Pressable onPress={dismiss}>
            <TabBarIcon name={"chevron-down-circle-outline"} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const handleUpdate = (data: any) => {
    console.log('Updated data:', data);
};

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
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
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Note;
