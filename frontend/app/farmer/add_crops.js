import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { ActivityIndicator, Button, Chip, Icon, IconButton, RadioButton, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import axiosHttpInstance from '../../utils/axiosHttpInstance';

export default function AddCrops({ cropId = null }) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [cropDetails, setcropDetails] = useState({
        cropId: "",
        name: null,
        description: null,
        imageData: null,
        imageUrl: null,
        price: null,
        unit: "Kg",
        pincode: null,
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
                    {cropId ? "Update crop details" : "Add crop"}
                </Text>
            </View>
            <ScrollView>
                {categoriesData && (!cropId || (cropId && cropInfoLoaded && villageList.length > 0)) ? (<View style={{ display: "grid", gap: 10, padding: 15 }}>

                    <TouchableOpacity onPress={pickImage}
                        style={{
                            borderStyle: "dashed",
                            borderColor: "gray",
                            borderWidth: !cropDetails.imageData && !cropDetails.imageUrl ? 1 : 0,
                            padding: !cropDetails.imageData && !cropDetails.imageUrl ? 10 : 0,
                            borderRadius: 5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: 200,
                            backgroundColor: "#f0f0f0f1"
                        }}
                    >
                        {(!cropDetails.imageData && !cropDetails.imageUrl) && (<>
                            <Icon source={"cloud-upload-outline"} size={50} />
                            <Text>Upload crop Image</Text>
                        </>)}
                        {(cropDetails.imageData || cropDetails.imageUrl) && <Image source={{ uri: cropDetails.imageData || cropDetails.imageUrl }} style={{ borderRadius: 5, resizeMode: 'contain', width: "100%", height: "100%" }} />}
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold' }}>Crop name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Self descriptive name of the crop'
                        value={cropDetails.name}
                        onChangeText={text => setcropDetails({ ...cropDetails, name: text })}
                        cursorColor={theme.colors.primary}
                    />
                    <Text style={{ fontWeight: 'bold' }}>Crop description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Explain crop quality and quantity"
                        multiline
                        numberOfLines={5}
                        verticalAlign='top'
                        textAlignVertical='top'
                        value={cropDetails.description}
                        onChangeText={text => setcropDetails({ ...cropDetails, description: text })}
                        cursorColor={theme.colors.primary}
                    />
                    <Text style={{ fontWeight: 'bold' }}>Unit</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ display: 'flex', gap: 10, flexDirection: 'row' }}>
                        {[
                            { label: "Kilogram", value: "Kg" },
                            { label: "Gram", value: "Gm" },
                            { label: "Ton", value: "Ton" },
                            { label: "Quintal", value: "Qtl" },
                            { label: "Litre", value: "Ltr" },
                            { label: "Millilitre", value: "Ml" },
                            { label: "Bag", value: "Bag" },
                            { label: "Bunch", value: "Bunch" },
                            { label: "Packet", value: "Packet" },
                            { label: "Item", value: "Item" },
                            { label: "Piece", value: "Piece" },
                            { label: "Dozen", value: "Dozen" },
                            { label: "Bundle", value: "Bundle" },
                            { label: "Box", value: "Box" },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.categoryButton} onPress={() => setcropDetails({ ...cropDetails, unit: item.value })}>
                                <Text style={{ backgroundColor: item.value === cropDetails.unit ? theme.colors.primary : 'transparent', color: item.value === cropDetails.unit ? theme.colors.onPrimary : theme.colors.primary, fontWeight: 'bold', fontSize: 16, textAlign: 'center', paddingVertical: 5, paddingHorizontal: 10, marginRight: 5, borderRadius: 5, borderColor: theme.colors.primary, borderWidth: 1 }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Text style={{ fontWeight: 'bold' }}>Unit Price (Price of 1 {cropDetails.unit})</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount in Rupees"
                        value={cropDetails.price?.toString()}
                        onChangeText={text => setcropDetails({ ...cropDetails, price: text ? parseInt(text) : null })}
                        keyboardType="numeric"
                        inputMode='numeric'
                        cursorColor={theme.colors.primary}
                    />

                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Crop / Commodity Location
                    </Text>
                    <Text style={{ fontSize: 12 }}>Enter the postal code of your location of origin. You can use this to get the list of villages, then select the appropriate one</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            cursorColor={theme.colors.primary}
                            style={styles.input}
                            placeholder='Pincode'
                            value={cropDetails.pincode?.toString()}
                            inputMode='numeric'
                            maxLength={6}
                            dense={true}
                            mode="outlined"
                            autoComplete='postal-code'
                            onChangeText={(text) => {
                                setcropDetails({ ...cropDetails, pincode: text });
                            }}
                        />
                        {/* <Button
                            loading={loading === "SEARCH"}
                            disabled={cropDetails?.pincode?.toString()?.length !== 6}
                            onPress={() => getLocationSearch(cropDetails.pincode)}
                            mode="contained" style={{ flexGrow: 1, marginTop: 5, borderRadius: 5 }}>FIND</Button> */}
                    </View>
                    <View>
                        {villageList.map((village, index) => (
                            <TouchableOpacity key={village?.id} style={{ borderBottomWidth: index === villageList.length - 1 ? 0 : 1, borderColor: '#ddd', display: 'flex', flexDirection: 'row', gap: 8, paddingVertical: 8, alignItems: 'center' }} onPress={() => setcropDetails({ ...cropDetails, villageIds: [village?.id] })} >
                                <Icon color={theme.colors.primary} size={18} source={[...cropDetails?.villageIds || []].includes(village?.id) ? "check-circle" : "circle-outline"} />
                                <Text style={{ fontSize: 14 }}>{village?.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button
                        style={{ marginTop: 10 }}
                        loading={loading === "ADD"}
                        mode="contained"
                        disabled={!(cropDetails?.name && cropDetails?.description && cropDetails?.price && parseInt(cropDetails?.price) && cropDetails?.pincode && cropDetails?.villageIds?.length > 0)}
                        onPress={() => {
                            addcrop();
                        }}
                    >
                        {cropDetails?.cropId ? "UPDATE CROP DETAILS" : "ADD CROP"}
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
