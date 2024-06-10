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
  TouchableOpacity,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useMemo, useRef, useState } from "react";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import OptionItem from "../custom_component/optionItem";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [expandedPrivate, setExpandedPrivate] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(false);
  const [dataOption, setDataOption] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { authState, onLogout } = useAuth();
  const toggleExpanded = () => setExpanded(!expanded);
  const toggleExpandedPrivate = () => setExpandedPrivate(!expandedPrivate);
  const toggleExpandedGroup = () => setExpandedGroup(!expandedGroup);

  const handlePresentModalPress = useCallback((dataSelect: any) => {
    setDataOption(dataSelect);
    bottomSheetModalRef.current?.present();
  }, []);

  const data1 = [
    {
      id: 1,
      title: "note2",
      category: "local",
      dateTime: Date.now,
    },
    {
      id: 2,
      title: "note3",
      category: "local",
      dateTime: Date.now,
    },
  ];

  const data = [
    {
      id: "1",
      title: "Item 1222222222",
      category: "local",
      dateTime: Date.now,
    },
    { id: "2", title: "Item 2", category: "private", dateTime: Date.now },
    { id: "3", title: "Item 3", category: "group", dateTime: Date.now },
    { id: "4", title: "Item 4", category: "category", dateTime: Date.now },
    { id: "5", title: "Item 5", category: "group", dateTime: Date.now },
  ];

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "../custom_component/note",
          params: { id: item.id },
        })
      }
      style={styles.itemRecent}
    >
      <TabBarIcon
        name={
          item.category === "local"
            ? "cloud-offline-outline"
            : item.category === "private"
            ? "cloud-done-outline"
            : "briefcase-outline"
        }
      />
      <Text
        style={styles.textItemRecent}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
    </Pressable>
  );

  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View style={styles.index}>
            <Text style={styles.title}>Home Page</Text>
            <View style={styles.recentComponent}>
              <Text style={styles.recentTitle}>Recent</Text>
              <View style={styles.recentBox}>
                <FlatList
                  data={data}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                />
              </View>
            </View>
            <View style={styles.collapseBox}>
              <TouchableOpacity
                style={[styles.collapseButton]}
                onPress={toggleExpanded}
              >
                <View style={styles.iconCategory}>
                  <TabBarIcon
                    name={
                      expanded ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    color={"#000000"}
                  />
                  <Text style={styles.buttonText}>Local Storage</Text>
                </View>
                <TabBarIcon name="cloud-offline-outline" />
              </TouchableOpacity>
              {expanded && (
                <View style={styles.content}>
                  {data1.map((item) => (
                    <View style={styles.rowItem}>
                      <Pressable
                        key={item.id}
                        style={styles.item}
                        onPress={() =>
                          router.push({
                            pathname: "../custom_component/note",
                            params: { id: item.id },
                          })
                        }
                      >
                        <TabBarIcon name="document-text-outline" />
                        <Text style={styles.textItem}>{item.title}</Text>
                      </Pressable>
                      <Pressable
                        style={styles.option}
                        onPress={(item) => handlePresentModalPress(item)}
                      >
                        <TabBarIcon name="options-outline" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.collapseBox}>
              <TouchableOpacity
                style={[styles.collapseButton]}
                onPress={toggleExpandedPrivate}
              >
                <View style={styles.iconCategory}>
                  <TabBarIcon
                    name={
                      expandedPrivate
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    color={"#000000"}
                  />
                  <Text style={styles.buttonText}>Private Sync</Text>
                </View>
                <TabBarIcon name="cloud-done-outline" />
              </TouchableOpacity>
              {authState?.authenticated ? (
                <>
                  {expandedPrivate && (
                    <View style={styles.content}>
                      {data1.map((item) => (
                        <View style={styles.rowItem}>
                          <Pressable
                            key={item.id}
                            style={styles.item}
                            onPress={() =>
                              router.push({
                                pathname: "../custom_component/note",
                                params: { id: item.id },
                              })
                            }
                          >
                            <TabBarIcon name="document-text-outline" />
                            <Text style={styles.textItem}>{item.title}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.option}
                            onPress={handlePresentModalPress}
                          >
                            <TabBarIcon name="options-outline" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View>
                    <Text>Login For Use</Text>
                  </View>
                </>
              )}
            </View>
            {authState?.authenticated ? (
              <View style={styles.collapseBox}>
                <TouchableOpacity
                  style={[styles.collapseButton]}
                  onPress={toggleExpandedGroup}
                >
                  <View style={styles.iconCategory}>
                    <TabBarIcon
                      name={
                        expandedGroup
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      color={"#000000"}
                    />
                    <Text style={styles.buttonText}>Group spaces</Text>
                  </View>
                  <TabBarIcon name="briefcase-outline" />
                </TouchableOpacity>
                {expandedGroup && authState?.groupId ? (
                  <View style={styles.content}>
                    {data1.map((item) => (
                      <View style={styles.rowItem}>
                        <Pressable
                          key={item.id}
                          style={styles.item}
                          onPress={() =>
                            router.push({
                              pathname: "../custom_component/note",
                              params: { id: item.id },
                            })
                          }
                        >
                          <TabBarIcon name="document-text-outline" />
                          <Text style={styles.textItem}>{item.title}</Text>
                        </Pressable>
                        <Pressable
                          style={styles.option}
                          onPress={handlePresentModalPress}
                        >
                          <TabBarIcon name="options-outline" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : (
                  <>
                    <View>
                      <Text>Join Group</Text>
                    </View>
                  </>
                )}
              </View>
            ) : null}
          </View>
          <OptionItem
            bottomSheetModalRef={bottomSheetModalRef}
            dataOption={dataOption}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  iconCategory: {
    width: "91%",
    flexDirection: "row",
    alignItems: "center",
  },
  textItemRecent: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  itemRecent: {
    padding: 4,
    width: 100,
    margin: 10,
    height: 100,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textItem: {
    fontSize: 14,
    textTransform: "capitalize",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  option: {
    marginStart: 5,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    minHeight: 35,
  },
  collapseBox: {
    borderBottomColor: "#CFCFCF",
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    minHeight: 40,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  recentComponent: {
    minHeight: 180,
    justifyContent: "flex-start",
    paddingEnd: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
    borderStyle: "solid",
  },
  recentBox: {},
  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  index: {
    flex: 1,
    paddingTop: 50,
  },
  btnContainer: {
    marginTop: 12,
  },
});
