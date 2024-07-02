import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Modal, Pressable, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { deleteNote, updateCategory } from "../api/home.api";
import { useAuth } from "../context/AuthContext";

interface OptionItemProps {
    dataOption: any;
    bottomSheetModalRef: any;
    handleReloadChange: () => void;
}



const OptionItem = ({ dataOption, bottomSheetModalRef, handleReloadChange }: OptionItemProps) => {
    const initialSnapPoints = useMemo(() => ['40%'], []);
    const { authState } = useAuth();
    const [loading, setLoading] = useState(false);
    const [moveTo, setMoveto] = useState(false);
    const [category, setCategory] = useState(dataOption?.category);
    const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

    const handleDelete = async (id: number) => {
        setLoading(true)
        const result = await deleteNote(authState?.token || '', id)
        if(result){
            setLoading(false);
            bottomSheetModalRef.current?.dismiss();
            handleReloadChange();
        }     
    } 

    useEffect(() => {
        const handleUpdate = async () => {
            setLoading(true);
            const data = {
                category: category,
                groupId: authState?.groupId,
            };
            const result = await updateCategory(authState?.token || "", dataOption?.id, data);
            if(result){
                setLoading(false);
                bottomSheetModalRef.current?.dismiss();
                handleReloadChange();
            }     
            bottomSheetModalRef.current?.dismiss();
        };
        handleUpdate();
    }, [category]);

    useEffect(() => {
        const handleInputFocus = () => {
            setSnapPoints(['41%']); 
        };
    
        const handleDisable = () => {
            setSnapPoints(['35%']); 
        };

        if(moveTo){
           handleInputFocus();
        }
        else {
            handleDisable();
        }

    }, [moveTo])

    useEffect(() => {
        setCategory(dataOption?.category);
        handleReloadChange();
    }, [dataOption]);

    return (
      <View>
        <BottomSheetModal
          style={styles.botoomSheet}
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          {loading && (
            <ActivityIndicator
              style={styles.conponentLoading}
              size="large"
              color="#000000"
            />
          )}
          <View>
            <View style={styles.container}>
              <View style={styles.boxItem}>
                <Text style={styles.textItem}>{dataOption?.title}</Text>
                <Text style={styles.dateTimeItem}>
                  {" "}
                  {dataOption?.dateTime?.toLocaleDateString()}
                </Text>
              </View>
              <TabBarIcon
                name={
                  dataOption?.category === "Private"
                    ? "cloud-done-outline"
                    : dataOption?.category === "Group"
                    ? "briefcase-outline"
                    : "cloud-offline-outline"
                }
              />
            </View>
            <View style={styles.option}>
              {/* <Pressable style={styles.OptionItem}>
                        <View style={styles.row}>
                            <TabBarIcon style={{marginRight: 10}} name="link-outline"/>
                            <Text>Copy</Text>
                        </View>
                    </Pressable>
                    <View style={styles.border} /> */}
              <Pressable
                style={styles.OptionItem}
                onPress={() => setMoveto(!moveTo)}
              >
                <View style={styles.row}>
                  <TabBarIcon
                    style={{ marginRight: 10 }}
                    name="return-up-forward-outline"
                    color={moveTo ? "#0000ff" : "#000"}
                  />
                  <Text style={moveTo && styles.radioButtonSelected}>Move to</Text>
                </View>
              </Pressable>
              <View style={styles.border} />
              <Pressable
                style={styles.OptionItem}
                onPress={() => handleDelete(dataOption?.id)}
              >
                <View style={styles.row}>
                  <TabBarIcon
                    style={{ marginRight: 10 }}
                    name="trash-outline"
                    color={"#ff0000"}
                  />
                  <Text style={{ color: "#ff0000" }}>Delete</Text>
                </View>
              </Pressable>
            </View>
          </View>
          {moveTo && (
            <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === "Private" && styles.radioButtonSelected,
              ]}
              onPress={() => setCategory("Private")}
            >
              <Text>Private</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === "Location" && styles.radioButtonSelected,
              ]}
              onPress={() => setCategory("Location")}
            >
              <Text>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === "Group" && styles.radioButtonSelected,
              ]}
              onPress={() => setCategory("Group")}
            >
              <Text>Group</Text>
            </TouchableOpacity>
          </View>
          )}
        </BottomSheetModal>
      </View>
    );
};

const styles = StyleSheet.create({
  radioButtonSelected: {
    borderColor: "blue",
    color: "blue",
  },
  radioButton: {
    marginRight: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  botoomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  border: {
    height: 1,
    backgroundColor: "#CFCFCF",
    marginVertical: 10,
  },
  OptionItem: {
    paddingLeft: 6,
    paddingVertical: 2,
  },
  dateTimeItem: {
    color: "#696969",
    marginStart: 5,
  },
  boxItem: {
    flexDirection: "column",
  },
  mainComponent: {},
  container: {
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    paddingRight: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    padding: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    padding: 10,
  },
  removeOption: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  textItem: {
    fontSize: 18,
    textTransform: "capitalize",
    paddingLeft: 10,
  },
  conponentLoading: {
    position: "absolute",
    top: 10,
    right: "45%",
    zIndex: 999,
  },
});

export default OptionItem;