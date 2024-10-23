import { Checkbox, Modal, Text, TextInput } from "react-native-paper";
import { StyleSheet, Pressable, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function LanguageModel(props) {
    const { openModel } = props;
    const theme = useTheme();

    const styles = StyleSheet.create({
        modalView: {
            position: 'absolute',
            bottom: 0,
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 25,
            alignItems: 'left',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '100%',
            // Take up the entire width
        },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={openModel}
            statusBarTranslucent
            onRequestClose={() => {
                // Handle modal close action if needed
            }}
        >
            <View style={styles.modalView}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    {/* <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{'Select Language'}</Text> */}
                </View>
                
                {/* Add more content here if needed */}
            </View>
        </Modal>
    );
}
