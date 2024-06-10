import { BottomSheetModal } from "@gorhom/bottom-sheet";
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";
import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface OptionNoteProps {
  bottomSheetModalRef: any;
  onUpdate: (data: { title: string; category: Category; status: Status }) => void;
}

enum Category {
  Location,
  Private,
  Group,
}

enum Status {
  Private,
  Public,
  Readonly,
}

const OptionNote = ({ bottomSheetModalRef, onUpdate }: OptionNoteProps) => {
    const initialSnapPoints = useMemo(() => ['35%'], []);
    const [snapPoints, setSnapPoints] = useState(initialSnapPoints);
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<Category>(
        Category.Private
    );
    const [status, setStatus] = useState<Status>(Status.Private);

    const handleSave = () => {
        onUpdate({
            title,
            category,
            status,
        });
    };

    const handleInputFocus = () => {
        setSnapPoints(['70%']); 
    };

    const handleDisable = () => {
        setSnapPoints(['35%']); 
    };

  return (
    <View >
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        <View style={styles.container}>
          <Text>Title:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Enter title"
            onFocus={handleInputFocus}
            onBlur={handleDisable}
          />
          <Text>Select Option:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === Category.Location &&
                  styles.radioButtonSelected,
              ]}
              onPress={() => setCategory(Category.Location)}
            >
              <Text>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === Category.Private &&
                  styles.radioButtonSelected,
              ]}
              onPress={() => setCategory(Category.Private)}
            >
              <Text>Private</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                category === Category.Group &&
                  styles.radioButtonSelected,
              ]}
              onPress={() => setCategory(Category.Group)}
            >
              <Text>Group</Text>
            </TouchableOpacity>
          </View>
          <Text>Status:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                status === Status.Private && styles.radioButtonSelected,
              ]}
              onPress={() => setStatus(Status.Private)}
            >
              <Text>Private</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                status === Status.Public && styles.radioButtonSelected,
              ]}
              onPress={() => setStatus(Status.Public)}
            >
              <Text>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                status === Status.Readonly && styles.radioButtonSelected,
              ]}
              onPress={() => setStatus(Status.Readonly)}
            >
              <Text>Readonly</Text>
            </TouchableOpacity>
          </View>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text>Save</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    paddingHorizontal: 20
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 10,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  radioButton: {
    marginRight: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  radioButtonSelected: {
    borderColor: "blue",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
});

export default OptionNote;
