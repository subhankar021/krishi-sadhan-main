import React, { useEffect } from "react";
import { Avatar, Text, Card, IconButton, Divider, useTheme, Icon } from "react-native-paper";
import { View, StyleSheet, SafeAreaView, Pressable, Alert, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import axiosHttpInstance from "../../utils/axiosHttpInstance";
import { getFromDeviceStorage, storeInDevice } from "../../utils/appStorage";

export default function UserProfile() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState("PROFILE");
    const [userDetails, setUserDetails] = useState({
        fullName: null,
        phoneNumber: null,
        appMode: null
    });

    async function getUserProfile() {
        setLoading("PROFILE");
        try {
            const response = await axiosHttpInstance.get('/api/user/profile');
            if (response.status === 200) {
                setUserDetails((prev) => ({ ...prev, ...response.data }));
            } else if (response.status === 401) {
                await storeInDevice("LOGIN_REDIRECT", "/user/profile");
                router.push('/user/login');
                return;

            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    async function logout() {
        setLoading("LOGOUT");
        try {
            const response = await axiosHttpInstance.get('/api/user/logout');
            if (response.status === 200) {
                router.dismissAll();
                router.push('/');
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    async function getAppMode() {
        try {
            let appMode = await getFromDeviceStorage("APP_MODE");
            if (!appMode) {
                appMode = "FARMER";
            }
            setUserDetails({ ...userDetails, appMode });
        } catch (error) {
            console.error(error);
        }
    }

    async function setAppMode(appMode) {
        try {
            await storeInDevice("APP_MODE", appMode);
            setUserDetails({ ...userDetails, appMode });
            router.dismissAll();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAppMode();
        getUserProfile();
    }, []);

    return (
        <SafeAreaView>
            <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderColor: '#ddd', flexDirection: 'row' }}>
                <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                {loading !== "PROFILE" && (<Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                    My Profile
                </Text>)}
            </View>
            <View style={{ margin: 10, gap: 10, backgroundColor: theme.colors.surface, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => {
                        setAppMode("FARMER");
                    }}
                    style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, backgroundColor: userDetails?.appMode === "FARMER" ? theme.colors.primary : "#EFEFEF", borderRadius: 8, }}
                >
                    <Icon size={18} source="sprout" color={userDetails?.appMode === "FARMER" ? "white" : "black"} />
                    <Text style={{ color: userDetails?.appMode === "FARMER" ? "white" : "black", textAlign: 'center', fontWeight: 'bold' }}>Farmer Mode</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setAppMode("AGGREGATOR");
                    }}
                    style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, backgroundColor: userDetails?.appMode === "AGGREGATOR" ? theme.colors.primary : "#EFEFEF", borderRadius: 8 }}>
                    <Icon size={18} source="tractor-variant" color={userDetails?.appMode === "AGGREGATOR" ? "white" : "black"} />
                    <Text style={{ color: userDetails?.appMode === "AGGREGATOR" ? "white" : "black", textAlign: 'center', fontWeight: 'bold' }}>Aggregator Mode</Text>
                </TouchableOpacity>
            </View>
            {loading !== "PROFILE" && (<View style={{ padding: 5, paddingTop: 20, alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <Avatar.Image size={100} source={require('../../assets/kishan_bhai.png')} style={{
                        backgroundColor: 'transparent',
                    }} />
                    <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>{userDetails?.fullName}</Text>
                    <Text style={{ marginTop: 5 }}>{userDetails?.phoneNumber}</Text>
                </View>
                <Divider style={{ marginTop: 50, width: '0' }} />
                {/* <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => router.push('/bookings')}
                >
                    <IconButton icon="calendar" color="#000" />
                    <Text style={{ flexGrow: 1 }}>My Bookings</Text>
                    <IconButton icon="chevron-right" color="#000" />
                </TouchableOpacity>
                <Divider style={{ width: '90%' }} /> */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="information-variant" color="#000" />
                    <Text style={{ flexGrow: 1 }}>General Info</Text>
                    <IconButton icon="chevron-right" color="#000" />
                </View>
                <Divider style={{ width: '90%' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="help-circle" color="#000" />
                    <Text style={{ flexGrow: 1 }}> Support & FAQ</Text>
                    <IconButton icon="chevron-right" color="#000" />
                </View>
                <Divider style={{ width: '90%' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="star-shooting" color="#000" />
                    <Text style={{ flexGrow: 1 }} > Feedback & Suggestions</Text>
                    <IconButton icon="chevron-right" color="#000" />
                </View>
                <Divider style={{ width: '90%' }} />
                <Pressable
                    onPress={() => {
                        Alert.alert('Are you sure you want to logout?', 'Your current session will be terminated and you will be logged out.', [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Yes', onPress: () => {
                                    logout();
                                }
                            },
                        ]);
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="logout" color="#000" />
                    <Text style={{ flexGrow: 1 }} > Logout</Text>
                    {/* <IconButton icon="chevron-right" color="#000" /> */}
                </Pressable>
                {/* <Link href="/user/register">
                    <Text style={{ marginTop: 50, color: '#666' }}>Register Page (Testing Link)</Text>
                </Link>
                <Text style={{ marginTop: 50, color: '#666' }}>Ver. 0.0.1</Text> */}
            </View>)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 50,
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
});
