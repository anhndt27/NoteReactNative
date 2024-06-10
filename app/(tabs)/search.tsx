import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Pressable, Image,  SectionList  } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OptionItem from '../custom_component/optionItem';

const SearchScreen = ()  => {
  const [sectionLocal, setSectionLocal] = useState({title: 'Local', data: [{ id: 1, title: 'kdfsd' },
    { id: 2, title: 'sdfsdf' },
    { id: 3, title: 'sdfsfd' }]});
  const [sectionPrivate, setSectionPrivate] = useState({title: 'Private', data: [{ id: 1, title: 'kdfsd' },
    { id: 2, title: 'sdfsdf' },
    { id: 3, title: 'sdfsfd' }]});
  const [sectionGroup, setSectionGroup] = useState({title: 'Group', data: [{ id: 1, title: 'kdfsd' },
    { id: 2, title: 'sdfsdf' },
    { id: 4, title: 'sdfsdf' },
    { id: 5, title: 'sdfsdf' },
    { id: 5, title: 'sdfsdf' },
    { id: 5, title: 'sdfsdf' },
    { id: 3, title: 'sdfsfd' }]});
  const [searchText, setSearchText] = useState('');
  const [dataOption, setDataOption] = useState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback((dataSelect: any) => {
    setDataOption(dataSelect);
    bottomSheetModalRef.current?.present();
  }, []);

  return (
   <>
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View style={styles.containerSearch}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <SectionList 
            style={styles.index}
            sections={[
              sectionLocal,
              sectionPrivate,
              sectionGroup
            ]}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Pressable
                  style={styles.item}
                  onPress={() =>
                    console.log(8888, item)
                  }
                >
                  <TabBarIcon name="document-text-outline" color={'#696969'}/>
                  <Text style={styles.textItem}>{item.title}</Text>
                </Pressable>
                <Pressable
                  style={styles.option}
                  onPress={handlePresentModalPress}
                >
                  <TabBarIcon name="options-outline" color={'#696969'}/>
                </Pressable>
              </View>
            )}
            renderSectionHeader={({section}) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
          />
        </View>
        <OptionItem
          bottomSheetModalRef={bottomSheetModalRef}
          dataOption={dataOption}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
   </>
)};

export default SearchScreen;

const styles = StyleSheet.create({
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
      marginHorizontal: 20,
     
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    marginBottom: 20
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
    justifyContent: 'center',
    alignItems: 'center'
  },
});