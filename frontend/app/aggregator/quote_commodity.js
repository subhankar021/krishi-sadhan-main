import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { ActivityIndicator, Button, Chip, Icon, IconButton, RadioButton, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import axiosHttpInstance from '../../utils/axiosHttpInstance';

export default function AddCrops({ cropId = null }) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const searchParams = useLocalSearchParams();

    const [cropDetails, setcropDetails] = useState({
        cropId: "",
        name: null,
        description: null,
        imageData: null,
        imageUrl: null,
        price: null,
        unit: "Kg",
        pincode: null,
        quantity: 1,
        villageIds: []
    });

    const [villageList, setVillageList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [cropInfoLoaded, setcropInfoLoaded] = useState(false);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                base64: true
            });
            // console.log(result);

            if (!result.canceled) {
                const image = result.assets[0];
                setcropDetails({ ...cropDetails, imageData: `data:${image.mimeType};base64,${image.base64}` });
            }
        } catch (error) {
            console.log(error);
        }
    };

    async function getLocationSearch(searchText = "") {
        try {
            if (`${searchText}`.length !== 6) return;
            setLoading("SEARCH");
            const response = await axiosHttpInstance.post("/api/location/pincode-search", { pinCode: searchText });
            console.log(response.data);
            if (response.status === 200) {
                setVillageList(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    async function addcrop() {
        try {
            setLoading("ADD");
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const response = await axiosHttpInstance.post("/api/aggregator/crops/add", cropDetails);
            // if (response.status === 200) {
            //     router.back();
            // }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            router.back();
        }
    }
    // async function getCategories() {
    //     setLoading("CATEGORIES");
    //     try {
    //         const response = await axiosHttpInstance.get('/api/categories/list');
    //         if (response.status === 200) {
    //             setCategoriesData(response.data);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     setLoading(false);
    // }

    // async function getcropDetails(cropId) {
    //     try {
    //         const response = await axiosHttpInstance.get(`/api/aggregator/crops/${cropId}/details`);
    //         if (response.status === 200) {
    //             setcropDetails(response.data);
    //             setcropInfoLoaded(true);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    useEffect(() => {
        getLocationSearch(cropDetails.pincode);
    }, [cropDetails.pincode]);

    // useEffect(() => {
    //     getCategories();
    //     if (cropId) {
    //         getcropDetails(cropId);
    //     }
    // }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                    {"Create Quote"}
                </Text>
            </View>
            <ScrollView>
                {categoriesData && (!cropId || (cropId && cropInfoLoaded && villageList.length > 0)) ? (<View style={{ display: "grid", gap: 10, padding: 15 }}>

                    <Text style={{fontSize: 16, fontWeight: 'bold' }}>
                        {"Natural White Sesame Seeds for Cooking"}
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                            <Icon source="map-marker" size={16} color={theme.colors.primary} />
                            <Text style={{ fontSize: 12 }}>Bahadurpur, UP</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                            <Icon source="account" size={16} color={theme.colors.primary} />
                            <Text style={{ fontSize: 12 }}>Rohit Agarwal</Text>
                        </View>
                    </View>
                    <Text style={{ fontWeight: 'bold' }}>
                        Estimated Price: 
                    </Text>
                    <Text style={{ fontSize: 18, backgroundColor: "#eee", fontFamily: "Inter_800ExtraBold",  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, fontWeight: 'bold' }}>
                    ₹1050 / Kg
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>Quote Price (Price of 1 {cropDetails.unit})</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount in Rupees"
                        value={cropDetails.price?.toString()}
                        onChangeText={text => setcropDetails({ ...cropDetails, price: text ? parseInt(text) : null })}
                        keyboardType="numeric"
                        inputMode='numeric'
                        cursorColor={theme.colors.primary}
                    />
                    <Text style={{ fontWeight: 'bold' }}>Quantity Required (in {cropDetails.unit})</Text>
                    <TextInput
                        style={styles.input}
                        value={cropDetails.quantity?.toString()}
                        onChangeText={text => setcropDetails({ ...cropDetails, quantity: text ? parseInt(text) : null })}
                        keyboardType="numeric"
                        inputMode='numeric'
                        cursorColor={theme.colors.primary}
                    />
                    { cropDetails.price > 0 && cropDetails.quantity > 0 && (<>
                    <Text style={{ fontWeight: 'bold' }}>
                        Your Quote Price ({cropDetails.quantity} x {cropDetails.price}): 
                    </Text>
                    <Text style={{ fontSize: 18, backgroundColor: "#eee", color: cropDetails.price * cropDetails.quantity < 1050 ? "red" : theme.colors.primary, fontFamily: "Inter_800ExtraBold",  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, fontWeight: 'bold' }}>
                    ₹{Math.round(cropDetails.price * cropDetails.quantity)}
                    </Text>
                    </>)}
                    <Text style={{ fontWeight: 'bold' }}>Messages / Remarks</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        multiline
                        numberOfLines={5}
                        verticalAlign='top'
                        textAlignVertical='top'
                        value={cropDetails.description}
                        onChangeText={text => setcropDetails({ ...cropDetails, description: text })}
                        cursorColor={theme.colors.primary}
                    />
                    <Button
                        style={{ marginTop: 10 }}
                        loading={loading === "ADD"}
                        mode="contained"
                        disabled={!(cropDetails?.price && parseInt(cropDetails?.price) > 0 && cropDetails?.quantity && parseInt(cropDetails?.quantity) > 0)}
                        onPress={() => {
                            addcrop();
                        }}
                    >
                        SUBMIT QUOTE
                    </Button>
                </View>) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            style={{ marginTop: 10 }}
                            size="large"
                            color={theme.colors.primary}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: { flexGrow: 1, borderWidth: 1, fontSize: 14, borderColor: 'gray', backgroundColor: '#efefef', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 6 },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    }
});
