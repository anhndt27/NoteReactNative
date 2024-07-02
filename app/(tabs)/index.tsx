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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [nodeListPrivate, setNodeListPrivate] = useState<INodeListWithGroup[]>(
    []
  );
  const [nodeListGroup, setNodeListGroup] = useState<INodeListWithGroup[]>([]);
  const [nodeListLocal, setNodeListLocal] = useState<INodeListWithGroup[]>([]);
  const [flastList, setFlastList] = useState<INodeListWithGroup[]>([]);
  const handlePresentModalPress = useCallback((dataSelect: any) => {
    setDataOption(dataSelect);
    bottomSheetModalRef.current?.present();
  }, []);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotesFromAsyncStorage = async () => {
      try {
        const dataString = await AsyncStorage.getItem('123');
        if (dataString) {
          const parsedData: INodeListWithGroup[] = JSON.parse(dataString).map((item: any) => ({
            ...item,
            dateTime: new Date(item.dateTime)
          }));
          setNodeListLocal(parsedData);
        } else {
          setNodeListLocal([]);
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
  
    loadNotesFromAsyncStorage();
  
  }, [reload]);

  // async function deleteNoteByTitle(title: string) {
  //   try {
  //     const dataString = await AsyncStorage.getItem('notes');
  //     const notes = dataString ? JSON.parse(dataString) : [];
  
  //     const updatedNotes = notes.filter(note => note.title !== title);
  
  //     const updatedDataString = JSON.stringify(updatedNotes);
  //     await AsyncStorage.setItem('notes', updatedDataString);
  //   } catch (error) {
  //     console.error('Error deleting note from AsyncStorage:', error);
  //   }
  // }

  useEffect(() => {
    const combinedList = [...nodeListPrivate, ...nodeListGroup, ...nodeListLocal].sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    setFlastList(combinedList.slice(0, 5));
  }, [nodeListGroup, nodeListPrivate, nodeListLocal])

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getNodeListWithoutGroup(
        authState?.token || "",
        authState?.userId || ""
      );
      if (data) {
        const processedData = data.map(item => ({
          ...item,
          dateTime: new Date(item.dateTime)
        }));
  
        setLoading(false);
        setNodeListPrivate(processedData);
      }
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
      if (data) {
        const processedData = data.map(item => ({
          ...item,
          dateTime: new Date(item.dateTime) 
        }));
  
        setLoading(false);
        setNodeListGroup(processedData);
      }
    };

    fetchData();
  }, [authState, reload]);

  const handleReloadChange = () => {
    setReload(!reload); 
  };

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
            <ActivityIndicator
              style={styles.conponentLoading}
              size="large"
              color="#000000"
            />
          )}
          <View style={styles.componentAdd}>
            <Pressable
              style={styles.btnAdd}
              onPress={() =>
                router.push({
                  pathname: "../custom_component/note",
                  params: { id: 0, title: "New note" },
                })
              }
            >
              <TabBarIcon
                name={"create-outline"}
                color={"#696969"}
              ></TabBarIcon>
            </Pressable>
          </View>
          <View style={styles.conponentReload}>
            <Pressable
              onPress={() => setReload(!reload)}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 6,
                padding: 4,
              }}
            >
              <TabBarIcon
                name={"reload-outline"}
                color={"#696969"}
              ></TabBarIcon>
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.index}>
              <View style={styles.recentComponent}>
                <Text style={styles.recentTitle}>Recent</Text>
                <View style={styles.recentBox}>
                  <FlatList
                    data={flastList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
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
                    {nodeListLocal.map((item) => (
                      <View style={styles.rowItem} key={item.id}>
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
                          <View style={styles.boxItem}>
                            <Text style={styles.textItem}>{item.title}</Text>
                            <Text style={styles.dateTimeItem}> {item.dateTime.toLocaleDateString()}</Text>
                          </View>
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
                          <View style={styles.rowItem} key={item.id}>
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
                              <View style={styles.boxItem}>
                                <Text style={styles.textItem}>
                                  {item.title}
                                </Text>
                                <Text style={styles.dateTimeItem}>
                                  {" "}
                                  {item.dateTime.toLocaleDateString()}
                                </Text>
                              </View>
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
                ) : null}
              </View>
              {authState?.authenticated ? (
                <View style={[styles.collapseBox, { marginBottom: 60 }]}>
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
                            <View style={styles.rowItem} key={item.id}>
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
                                <View style={styles.boxItem}>
                                  <Text style={styles.textItem}>
                                    {item.title}
                                  </Text>
                                  <Text style={styles.dateTimeItem}>
                                    {" "}
                                    {item.dateTime.toLocaleDateString()}
                                  </Text>
                                </View>
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
                  ) : null}
                </View>
              ) : null}
            </View>
          </ScrollView>
          <OptionItem
            bottomSheetModalRef={bottomSheetModalRef}
            dataOption={dataOption}
            handleReloadChange={handleReloadChange}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  dateTimeItem: {
    color: '#696969',
    marginStart: 6
  },
  boxItem: {
    flexDirection: 'column'
  },
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
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
    justifyContent: "center",
    paddingEnd: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
    borderStyle: "solid",
  },
  recentBox: {
    width: 398
  },
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
