import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Button, Icon, IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import axiosHttpInstance from '../../utils/axiosHttpInstance';

export default function CreateEquipment({ equipmentId = null }) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [equipmentDetails, setEquipmentDetails] = useState({
        equipmentId,
        categoryId: null,
        name: null,
        description: null,
        imageData: null,
        imageUrl: null,
        price: null,
        pincode: null,
        villageIds: []
    });

    const [villageList, setVillageList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [equipmentInfoLoaded, setEquipmentInfoLoaded] = useState(false);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                base64: true
            });
            console.log(result);

            if (!result.canceled) {
                const image = result.assets[0];
                setEquipmentDetails({ ...equipmentDetails, imageData: `data:${image.mimeType};base64,${image.base64}` });
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
    async function addEquipment() {
        try {
            setLoading("ADD");
            const response = await axiosHttpInstance.post("/api/aggregator/equipments/add", equipmentDetails);
            if (response.status === 200) {
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    async function getCategories() {
        setLoading("CATEGORIES");
        try {
            const response = await axiosHttpInstance.get('/api/categories/list');
            if (response.status === 200) {
                setCategoriesData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    async function getEquipmentDetails(equipmentId) {
        try {
            const response = await axiosHttpInstance.get(`/api/aggregator/equipments/${equipmentId}/details`);
            if (response.status === 200) {
                setEquipmentDetails(response.data);
                setEquipmentInfoLoaded(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getLocationSearch(equipmentDetails.pincode);
    }, [equipmentDetails.pincode]);

    useEffect(() => {
        getCategories();
        if (equipmentId) {
            getEquipmentDetails(equipmentId);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                    {equipmentId ? "Edit Equipment" : "Create Equipment"}
                </Text>
            </View>
            <ScrollView>
                {categoriesData && (!equipmentId || (equipmentId && equipmentInfoLoaded && villageList.length > 0)) ? (<View style={{ display: "grid", gap: 10, padding: 15 }}>

                    <TouchableOpacity onPress={pickImage}
                        style={{
                            borderStyle: "dashed",
                            borderColor: "gray",
                            borderWidth: !equipmentDetails.imageData && !equipmentDetails.imageUrl ? 1 : 0,
                            padding: !equipmentDetails.imageData && !equipmentDetails.imageUrl ? 10 : 0,
                            borderRadius: 5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: 200,
                            backgroundColor: "#f0f0f0f1"
                        }}
                    >
                        {(!equipmentDetails.imageData && !equipmentDetails.imageUrl) && (<>
                            <Icon source={"cloud-upload-outline"} size={50} />
                            <Text>Upload Equipment Image</Text>
                        </>)}
                        {(equipmentDetails.imageData || equipmentDetails.imageUrl) && <Image source={{ uri: equipmentDetails.imageData || equipmentDetails.imageUrl }} style={{ borderRadius: 5, width: "100%", height: "100%" }} />}
                    </TouchableOpacity>
                    <TextInput
                        dense
                        mode='outlined'
                        label="Equipment Name"
                        value={equipmentDetails.name}
                        onChangeText={text => setEquipmentDetails({ ...equipmentDetails, name: text })}
                    />
                    <TextInput
                        mode='outlined'
                        label="Equipment Description"
                        multiline
                        numberOfLines={5}
                        value={equipmentDetails.description}
                        onChangeText={text => setEquipmentDetails({ ...equipmentDetails, description: text })}
                    />
                    <TextInput
                        mode='outlined'
                        label="Rate per hour (in Rupees)"
                        value={equipmentDetails.price?.toString()}
                        onChangeText={text => setEquipmentDetails({ ...equipmentDetails, price: text ? parseInt(text) : null })}
                        keyboardType="numeric"
                    />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Equipment Category</Text>
                    <Text>Select a category suitable for your equipment from the list of categories given below</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            {categoriesData.sort((a, b) => b.items.length - a.items.length).map((categoryGroup, cgIndex) => (
                                <View key={`category_group_${cgIndex}`} style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, borderRadius: 5, borderColor: "#eee" }}>
                                    <Text style={{ backgroundColor: "#eee", fontSize: 16, padding: 8, fontWeight: 'bold' }}>{categoryGroup.name}</Text>
                                    {categoryGroup.items.map((category, catIndex) => (
                                        <TouchableOpacity
                                            key={category.categoryId}
                                            onPress={() => setEquipmentDetails({ ...equipmentDetails, categoryId: category.categoryId })}
                                            style={{
                                                backgroundColor: equipmentDetails.categoryId === category.categoryId ? theme.colors.primary : null,
                                                padding: 8,
                                                // borderRadius: 5,
                                                borderBottomWidth: catIndex === categoryGroup.items.length - 1 ? 0 : 1,
                                                borderColor: equipmentDetails.categoryId === category.id ? theme.colors.primary : "#eee",
                                            }}
                                        >
                                            <Text style={{ color: equipmentDetails.categoryId === category.categoryId ? theme.colors.onPrimary : "black" }}>{category.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Location
                    </Text>
                    <Text>Enter the postal code of your location to get the list of villages, then select the appropriate one</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            value={equipmentDetails.pincode?.toString()}
                            inputMode='numeric'
                            maxLength={6}
                            style={{ flexGrow: 3 }}
                            dense={true}
                            mode="outlined"
                            autoComplete='postal-code'
                            onChangeText={(text) => {
                                setEquipmentDetails({ ...equipmentDetails, pincode: text });
                            }}
                        />
                        <Button
                            loading={loading === "SEARCH"}
                            disabled={equipmentDetails?.pincode?.toString()?.length !== 6}
                            onPress={() => getLocationSearch(equipmentDetails.pincode)}
                            mode="contained" style={{ flexGrow: 1, marginTop: 5, borderRadius: 5 }}>FIND</Button>
                    </View>
                    <View>
                        {villageList.map((village, index) => (
                            <TouchableOpacity key={village?.id} style={{ borderBottomWidth: index === villageList.length - 1 ? 0 : 1, borderColor: '#ddd', display: 'flex', flexDirection: 'row', gap: 8, paddingVertical: 8, alignItems: 'center' }} onPress={() => setEquipmentDetails({ ...equipmentDetails, villageIds: [...equipmentDetails?.villageIds || [], village?.id] })} >
                                <Icon color={theme.colors.primary} size={18} source={[...equipmentDetails?.villageIds || []].includes(village?.id) ? "check-circle" : "circle-outline"} />
                                <Text style={{ fontSize: 14 }}>{village?.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button
                        style={{ marginTop: 10 }}
                        loading={loading === "REGISTER"}
                        mode="contained"
                        disabled={Object.values(equipmentDetails).filter(Boolean).length === (Object.keys(equipmentDetails).length - 1)}
                        onPress={() => {
                            addEquipment();
                        }}
                    >
                        {equipmentDetails?.equipmentId ? "UPDATE" : "ADD"} EQUIPMENT
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
    },
    input: {
        width: '100%',
        marginBottom: 10,
    },
});
