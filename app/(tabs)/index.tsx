import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  Button,
  useWindowDimensions,
  Pressable,
  TouchableOpacity 
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useHome from "../hooks/useHome";
import { useRef, useState } from "react";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter  } from "expo-router";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function HomeScreen() {
  const { handleReadNote, handleSaveNote, noteText, setNoteText } = useHome();
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [expandedPrivate, setExpandedPrivate] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleExpandedPrivate = () => {
    setExpandedPrivate(!expandedPrivate);
  };

  const toggleExpandedGroup = () => {
    setExpandedGroup(!expandedGroup);
  };


  const data1 = [
    {
      id: 1,
      title: "note2"
    },
    {
      id: 2,
      title: "note3"
    }
  ];

  return (
    <View style={styles.index}>
      <Text style={styles.tilte}>Home Page</Text>
      <View style={styles.noteContainer}>
        <Pressable
          style={styles.btnContainer}
          onPress={() => router.push({ pathname: "../custom_component/note", params: {} })}
        >
          <TabBarIcon name={'create-outline'} color={'#000000'} />
        </Pressable>
      </View>
      <View>
        <TouchableOpacity
          style={[expanded ? styles.collapseBtn : styles.expandBtn, styles.collapse]}
          onPress={toggleExpanded}>
          <Text style={styles.buttonText}>{expanded ? "Local Collapse" : "Local Expand"}</Text>
          <TabBarIcon name={'chevron-down-outline'} color={'#000000'} />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.content}>
            {data1.map(item => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() => router.push({ pathname: "../custom_component/note", params: {} })}>
              <Text>{item.title}</Text>
            </Pressable>
          ))}
          </View>
        )}
      </View>
      <View>
        <TouchableOpacity
          style={[expandedPrivate ? styles.collapseBtn : styles.expandBtn, styles.collapse]}
          onPress={toggleExpandedPrivate}>
          <Text style={styles.buttonText}>{expanded ? "Private Collapse" : "Private Expand"}</Text>
          <TabBarIcon name={'chevron-down-outline'} color={'#000000'} />
        </TouchableOpacity>
        {expandedPrivate && (
          <View style={styles.content}>
            {data1.map(item => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() => router.push({ pathname: "../custom_component/note", params: {} })}>
              <Text>{item.title}</Text>
            </Pressable>
          ))}
          </View>
        )}
      </View>
      <View>
        <TouchableOpacity
          style={[expandedGroup ? styles.collapseBtn : styles.expandBtn, styles.collapse]}
          onPress={toggleExpandedGroup}>
          <Text style={styles.buttonText}>{expanded ? "Group Collapse" : "Group Expand"}</Text>
          <TabBarIcon name={'chevron-down-outline'} color={'#000000'} />
        </TouchableOpacity>
        {expandedGroup && (
          <View style={styles.content}>
            {data1.map(item => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() => router.push({ pathname: "../custom_component/note", params: {} })}>
              <Text>{item.title}</Text>
            </Pressable>
          ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  collapse: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  expandBtn: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderBottomColor: 'black'
  },
  content: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  collapseBtn: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderBottomColor: 'black'
  },
  tilte: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  noteContainer:  {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "flex-end",
    paddingEnd: 20,
  },
  container: {
    flex: 1,
    padding: 36,
  },
  index: {
    height: "100%",
    backgroundColor: "#ffffff",
    paddingTop: 50,
  },
  toolbar: {
    height: 40,
  },
  richText: {
    height: 400,
  },
  fullScreen: {
    flex: 1,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});
