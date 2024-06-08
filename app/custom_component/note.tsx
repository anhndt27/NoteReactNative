import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Keyboard } from 'react-native';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Note = () => {
  const [noteText, setNoteText] = useState("");
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: noteText,
  });

  const dismiss = () => {
    editor.blur();
    Keyboard.dismiss();
  };


  return (
    <View style={styles.container}>
       <View style={styles.btnContainer}>
          <Button title="Close Keyboard" onPress={dismiss} />
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <RichText editor={editor} />
          <Toolbar editor={editor} />
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Note;
