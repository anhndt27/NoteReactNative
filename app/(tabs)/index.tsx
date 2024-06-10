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
  ActivityIndicator,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useAuth } from "../context/AuthContext";
import {
  INodeListWithGroup,
  getNodeListWithoutGroup,
  getNoteListWithGroup
} from "../api/home.api";

export default function HomeScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [expandedPrivate, setExpandedPrivate] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(false);
  const [dataOption, setDataOption] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { authState } = useAuth();
  const toggleExpanded = () => setExpanded(!expanded);
  const toggleExpandedPrivate = () => setExpandedPrivate(!expandedPrivate);
  const toggleExpandedGroup = () => setExpandedGroup(!expandedGroup);
  const [nodeListPrivate, setNodeListPrivate] = useState<
    INodeListWithGroup[]
  >([]);
  const [nodeListGroup, setNodeListGroup] = useState<
    INodeListWithGroup[]
  >([]);
  const handlePresentModalPress = useCallback((dataSelect: any) => {
    setDataOption(dataSelect);
    bottomSheetModalRef.current?.present();
  }, []);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const data1 = [
    {
      id: 1,
      title: "note2",
      category: "Local",
      dateTime: Date.now,
    },
    {
      id: 2,
      title: "note3",
      category: "Local",
      dateTime: Date.now,
    },
    {
      id: 3,
      title: "note3",
      category: "Local",
      dateTime: Date.now,
    },
    {
      id: 4,
      title: "note3",
      category: "Local",
      dateTime: Date.now,
    },
    {
      id: 5,
      title: "note3",
      category: "Local",
      dateTime: Date.now,
    },
  ];


  const data = [
    {
      id: "1",
      title: "Item 1222222222",
      category: "Local",
      dateTime: Date.now,
    },
    { id: "2", title: "Item 2", category: "Private", dateTime: Date.now },
    { id: "3", title: "Item 3", category: "Group", dateTime: Date.now },
    { id: "4", title: "Item 4", category: "Private", dateTime: Date.now },
    { id: "5", title: "Item 5", category: "Group", dateTime: Date.now },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getNodeListWithoutGroup(
        authState?.token || "",
        authState?.userId || ""
      );
      if(data) setLoading(false);
      setNodeListPrivate(data);
    };

    fetchData();
  }, [authState, reload]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getNoteListWithGroup(
        authState?.token || "",
        authState?.userId || "",
        authState?.groupId || 0
      );
      if(data) setLoading(false);
      setNodeListGroup(data);
    };

    fetchData();
  }, [authState, reload]);

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "../custom_component/note",
          params: { id: item.id, title: item.title },
        })
      }
      style={styles.itemRecent}
    >
      <TabBarIcon
        name={
          item.category === "Local"
            ? "cloud-offline-outline"
            : item.category === "Private"
            ? "cloud-done-outline"
            : "briefcase-outline"
        }
        color={"#696969"}
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
          {loading && (
            <ActivityIndicator style={styles.conponentLoading} size="large" color="#000000" />
          )}
          <View style={styles.componentAdd}>
            <Pressable  style={styles.btnAdd}
                onPress={() =>
                  router.push({
                    pathname: "../custom_component/note",
                    params: { id: 0, title: 'New note' },
                  })
                }>
              <TabBarIcon name={'create-outline'} color={'#696969'}></TabBarIcon>
            </Pressable>
          </View>
          <View style={styles.conponentReload}>
            <Pressable onPress={() => setReload(!reload)}>
              <TabBarIcon name={'reload-outline'} color={'#696969'}></TabBarIcon>
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.index}>
              <View style={styles.recentComponent}>
                <Text style={styles.recentTitle}>Recent</Text>
                <View style={styles.recentBox}>
                  <FlatList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
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
                    <Text style={styles.buttonText}>Local Storage</Text>
                    <TabBarIcon
                      name={
                        expanded ? "chevron-up-outline" : "chevron-down-outline"
                      }
                      color={"#696969"}
                      style={styles.chevronIcon}
                    />
                  </View>
                  <TabBarIcon name="cloud-offline-outline" color={"#696969"} />
                </TouchableOpacity>
                {expanded && (
                  <View style={styles.content}>
                    {data1.map((item) => (
                      <View style={styles.rowItem} > 
                        <Pressable
                          style={styles.item}
                          onPress={() =>
                            router.push({
                              pathname: "../custom_component/note",
                              params: { id: item.id, title: item.title },
                            })
                          }
                        >
                          <TabBarIcon
                            name="document-text-outline"
                            color={"#696969"}
                          />
                          <Text style={styles.textItem}>{item.title}</Text>
                        </Pressable>
                        <Pressable
                          style={styles.option}
                          onPress={() => handlePresentModalPress(item)}
                        >
                          <TabBarIcon
                            name="options-outline"
                            color={"#696969"}
                          />
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
                    <Text style={styles.buttonText}>Private Sync</Text>
                    <TabBarIcon
                      name={
                        expandedPrivate
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      color={"#696969"}
                      style={styles.chevronIcon}
                    />
                  </View>
                  <TabBarIcon name="cloud-done-outline" color={"#696969"} />
                </TouchableOpacity>
                {authState?.authenticated ? (
                  <>
                    {expandedPrivate && (
                      <View style={styles.content}>
                        {nodeListPrivate?.map((item) => (
                          <View style={styles.rowItem}>
                            <Pressable
                              style={styles.item}
                              onPress={() =>
                                router.push({
                                  pathname: "../custom_component/note",
                                  params: { id: item.id, title: item.title },
                                })
                              }
                            >
                              <TabBarIcon
                                name="document-text-outline"
                                color={"#696969"}
                              />
                              <Text style={styles.textItem}>{item.title}</Text>
                            </Pressable>
                            <Pressable
                              style={styles.option}
                              onPress={() => handlePresentModalPress(item)}
                            >
                              <TabBarIcon
                                name="options-outline"
                                color={"#696969"}
                              />
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
                      <Text style={styles.buttonText}>Group spaces</Text>
                      <TabBarIcon
                        name={
                          expandedGroup
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        color={"#696969"}
                        style={styles.chevronIcon}
                      />
                    </View>
                    <TabBarIcon name="briefcase-outline" color={"#696969"} />
                  </TouchableOpacity>
                  {authState?.groupId ? (
                    <>
                      {expandedGroup && (
                        <View style={styles.content}>
                          {nodeListGroup.map((item) => (
                            <View style={styles.rowItem}>
                              <Pressable
                                style={styles.item}
                                onPress={() =>
                                  router.push({
                                    pathname: "../custom_component/note",
                                    params: { id: item.id, title: item.title },
                                  })
                                }
                              >
                                <TabBarIcon
                                  name="document-text-outline"
                                  color={"#696969"}
                                />
                                <Text style={styles.textItem}>
                                  {item.title}
                                </Text>
                              </Pressable>
                              <Pressable
                                style={styles.option}
                                onPress={() => handlePresentModalPress(item)}
                              >
                                <TabBarIcon
                                  name="options-outline"
                                  color={"#696969"}
                                />
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
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
           
          </ScrollView>
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
  btnAdd: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%'
  },
  componentAdd: {
    position: 'absolute', 
    bottom: 10, 
    left: 20,
    zIndex: 999, 
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  conponentLoading: { 
    position: 'absolute', 
    top: 50, 
    right: '45%',
    zIndex: 999, 
  },
  conponentReload: { 
    position: 'absolute', 
    top: 50, 
    right: 20,
    zIndex: 999, 
  },
  iconCategory: {
    width: "91%",
    flexDirection: "row",
    alignItems: "center",
  },
  textItemRecent: {
    fontSize: 14,
    fontWeight: 800,
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
    // borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
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
    color: "#363636",
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
    color: "#363636",
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
    padding: 8,
    paddingTop: 44,
  },
  btnContainer: {
    marginTop: 12,
  },
  chevronIcon: {
    fontSize: 20,
    paddingHorizontal: 2,
  },
});
