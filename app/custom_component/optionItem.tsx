import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Modal, Pressable, View, StyleSheet, Text } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface OptionItemProps {
    dataOption: any;
    bottomSheetModalRef: any;
}

const OptionItem = ({ dataOption, bottomSheetModalRef }: OptionItemProps) => {
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    return (
        <View style={[styles.container]}>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
            >
                <View style={styles.container}>
                    <View>
                        <Text>{dataOption?.title}</Text>
                        <Text>{dataOption?.title}</Text>
                    </View>
                    <Pressable style={styles.option}>
                        <Text>Copy link</Text>
                    </Pressable>
                </View>
            </BottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainComponent: {
    },
    container: {
     
    },
    option: {
        // Add your styling here
    },
    removeOption: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
});

export default OptionItem;