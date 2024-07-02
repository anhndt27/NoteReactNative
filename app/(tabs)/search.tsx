import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Pressable, Image,  SectionList, ActivityIndicator  } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OptionItem from '../custom_component/optionItem';
import { INoteList, searchNoteList } from '../api/home.api';
import { useAuth } from '../context/AuthContext';
const SearchScreen = () => {
  const [sectionLocal, setSectionLocal] = useState({
    category: "",
    data: [],
  });
  const [sectionPrivate, setSectionPrivate] = useState<INoteList>({
    category: "",
    data: [],
  });
  const [sectionGroup, setSectionGroup] = useState<INoteList>({
    category: "",
    data: [],
  });
  const [searchText, setSearchText] = useState("");
  const [dataOption, setDataOption] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const handlePresentModalPress = useCallback((dataSelect: any) => {
    setDataOption(dataSelect);
    bottomSheetModalRef.current?.present();
  }, []);
  const [orderby, setOrderby] = useState<string>("asc");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDataPrivate = async () => {
      const data = await searchNoteList(
        authState?.token || "",
        authState?.userId || "",
        null, 
        searchText,
        orderby
      );
      if (data) {
        const processedData = {
          ...data,
          data: data.data.map(item => ({
            ...item,
            dateTime: new Date(item.dateTime)
          }))
        };
        setLoading(false);
        setSectionPrivate(processedData);
      }
    };

    const fetchDataGroup = async () => {
      const data = await searchNoteList(
        authState?.token || "",
        authState?.userId || "",
        authState?.groupId, 
        searchText,
        orderby
      );
      if (data) {
        const processedData = {
          ...data,
          data: data.data.map(item => ({
            ...item,
            dateTime: new Date(item.dateTime)
          }))
        };
        setLoading(false);
        setSectionGroup(processedData);
      }
    };
    fetchDataPrivate(); fetchDataGroup(); 
  }, [authState, searchText, orderby, reload])

  const toggleOrderby = () => {
    setOrderby(prevOrderby => (prevOrderby === "asc" ? "desc" : "asc"));
  };

  const handleReloadChange = () => {
    setReload(!reload); 
  };

  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {loading && (
            <ActivityIndicator style={styles.conponentLoading} size="large" color="#000000" />
          )}
          <View style={styles.container}>
            <View style={styles.containerSearch}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <Pressable style={styles.sortButton} onPress={toggleOrderby}>
                <View style={styles.rowIcon}>
                  <TabBarIcon name={orderby==="asc" ? "chevron-down-outline" : "chevron-up-outline"} color={"#696969"} />
                </View>
              </Pressable>
            </View>
            <SectionList
              style={styles.index}
              sections={[sectionLocal, sectionPrivate, sectionGroup]}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item, section }) => (
                <View
                  style={styles.itemContainer}
                  key={`${section.category}-${item.id}`}
                >
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
                    <TabBarIcon name="options-outline" color={"#696969"} />
                  </Pressable>
                </View>
              )}
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader} key={section.category}>
                  {section.category}
                </Text>
              )}
            />
          </View>
          <OptionItem
            bottomSheetModalRef={bottomSheetModalRef}
            dataOption={dataOption}
            handleReloadChange={handleReloadChange}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  dateTimeItem: {
    color: '#696969',
    marginStart: 5
  },
  boxItem: {
    flexDirection: 'column'
  },
  conponentLoading: { 
    position: 'absolute', 
    top: 50, 
    right: '45%',
    zIndex: 999, 
  },
  rowIcon: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  sortButton: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    marginStart: 10,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#363636",
  },
  textItem: {
    fontSize: 14,
    textTransform: "capitalize",
    paddingLeft: 10,
  },
  containerSearch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10 
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    width: '75%'
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 4,
    padding: 4,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  index: {
    backgroundColor: 'white',
    height: '100%',
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingTop: 20,
    marginHorizontal: 20,
    marginBottom: 20
  },
  container: {
    flex: 1,
    paddingTop: 50,
    height: '100%',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 10,
    borderColor: 'black',
  },
  item: {
    padding: 10,
    fontSize: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '88%',
  },
});