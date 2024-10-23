import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axiosHttpInstance from '../../utils/axiosHttpInstance';

export default function Registration() {
    const theme = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: {
            line1: null,
            line2: null,
            villageId: null,
            pinCode: null
        }
    });

    const [villageList, setVillageList] = useState([]);
    const [loading, setLoading] = useState(false);

    async function initRegister() {
        setLoading("INIT");
        try {
            const response = await axiosHttpInstance.get('/api/user/init-register');
            if (response.status === 200) {
                setUserInfo((prev) => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    async function getPincodeInfo(pincode) {
        setLoading("PINCODE");
        try {
            const response = await axiosHttpInstance.post('/api/location/pincode', { pincode });
            if (response.status === 200) {
                setVillageList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    async function registerUser() {
        setLoading("REGISTER");
        try {
            const response = await axiosHttpInstance.post('/api/user/register', userInfo);
            if (response.status === 200) {
                router.push('/');
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    useEffect(() => {
        initRegister();
    }, []);
    

    return (
        <SafeAreaView>
            <ScrollView style={{ marginTop: insets.top, paddingBottom: insets.bottom + 10, flexGrow: 1 }}>
                <View style={{ display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                    <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                        Account Registration
                    </Text>
                </View>
                {loading !== "INIT" && (<View style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>User Details</Text>
                    <TextInput value={userInfo?.fullName} dense={true} mode='outlined' label="Full Name" autoComplete='name' onChangeText={(text) => setUserInfo({ ...userInfo, fullName: text })} />
                    <TextInput value={userInfo?.email} dense={true} mode="outlined" label="Email Address" autoComplete='email' onChangeText={(text) => setUserInfo({ ...userInfo, email: text })} />
                    <TextInput value={userInfo?.phoneNumber} dense={true} mode="outlined" disabled={true} label="Phone Number" />
                    <Text style={{ fontSize: 16, marginTop: 15, fontWeight: 'bold' }}>Address Details</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TextInput inputMode='numeric' value={userInfo?.address?.pinCode} maxLength={6} style={{ flexGrow: 3 }} dense={true} mode="outlined" label="Postal / PIN / Zip Code" autoComplete='postal-code' onChangeText={(text) => setUserInfo({ ...userInfo, address: { ...userInfo.address, pinCode: text } })} />
                        <Button
                            loading={loading === "PINCODE"}
                        onPress={() => getPincodeInfo(userInfo?.address?.pinCode)}
                        disabled={userInfo?.address?.pinCode?.length !== 6} mode="contained" style={{ flexGrow: 1, marginTop: 5, borderRadius: 5 }}>VERIFY</Button>
                    </View>
                    <Text style={{ color: '#444', fontSize: 12 }}>
                        {"Upon entering a valid postal code and clicking 'verify', the city and state fields will be automatically populated."}
                    </Text>
                    <TextInput value={userInfo?.address?.line1} dense={true} mode="outlined" label="Address Line 1" autoComplete='address-line1' onChangeText={(text) => setUserInfo({ ...userInfo, address: { ...userInfo.address, line1: text } })} />
                    <TextInput value={userInfo?.address?.line2} dense={true} mode="outlined" label="Address Line 2" autoComplete='address-line2' onChangeText={(text) => setUserInfo({ ...userInfo, address: { ...userInfo.address, line2: text } })} />
                    {/* <TextInput value={userInfo?.address?.villageId} dense={true} mode="outlined" label="Village" /> */}
                    <RadioButton.Group
                    
                        value={userInfo?.address?.villageId}
                        onValueChange={(value) => setUserInfo({ ...userInfo, address: { ...userInfo.address, villageId: value } })}
                    >
                            {villageList?.map((village) => (
                                <RadioButton.Item mode='ios' position='trailing' key={village?.villageId} label={village?.villageName} value={village?.villageId} />
                            ))}
                    </RadioButton.Group>
                    {/* <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}> */}
                        <TextInput disabled={true} readOnly={true} style={{ flexGrow: 1 }} dense={true} value={villageList[0]?.districtName} mode="outlined" label="District" />
                        <TextInput disabled={true} readOnly={true} style={{ flexGrow: 1 }} dense={true} value={villageList[0]?.stateName} mode="outlined" label="State" />
                    {/* </View> */}


                    {/* <Text style={{ fontSize: 16, marginTop: 15, fontWeight: 'bold' }}>Locate your location</Text>
                    <MapView provider={PROVIDER_GOOGLE} loadingEnabled={true} region={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude }} style={{ width: '100%', height: 200 }} >
                        <MapMarker coordinate={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude }} />
                    </MapView>
                    <Text style={{ color: '#444', fontSize: 12 }}>
                        Note: Your location will be utilized to display the nearest availability of farm equipment in your area.
                    </Text> */}
                    <Button 
                    loading={loading === "REGISTER"}
                    disabled={userInfo.fullName?.trim().length < 3 || villageList.length === 0 } mode="contained" uppercase
                        onPress={() => {
                            registerUser(userInfo);
                        }}
                    >COMPLETE REGISTRATION</Button>
                </View>)}
            </ScrollView>
        </SafeAreaView>
    );
}


// const [location, setLocation] = useState(null);
// const [errorMsg, setErrorMsg] = useState(null);

// useEffect(() => {
//     (async () => {
//         if (Platform.OS === 'android' && !Device.isDevice) {
//             setErrorMsg(
//                 'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
//             );
//             return;
//         }
//         let { status } = await Location.requestForegroundPermissionsAsync({});
//         if (status !== 'granted') {
//             setErrorMsg('Permission to access location was denied');
//             return;
//         }

//         let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
//         setLocation(location);
//     })();
// }, []);

// let text = null;
// if (errorMsg) {
//     text = errorMsg;
// }

// if (!location) {
//     return null;
// }