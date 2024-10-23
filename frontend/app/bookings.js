import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated, ScrollView, RefreshControl } from 'react-native';
import { useTheme, Avatar, Card, Chip, Button, IconButton, ActivityIndicator, Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image, Text } from 'react-native';
import axiosHttpInstance from '../utils/axiosHttpInstance';
import { storeInDevice } from '../utils/appStorage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Bookings() {
    const [equipmentData, setEquipmentData] = useState(null);
    const [slotsList, setSlotsList] = useState([]);
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // {
    //     bookingNumber: "ORD4D5E6F",
    //     equipmentName: "Harvesting Equipment saman used for the farm",
    //     bookingInfo: {
    //         customerName: "Priya Sharma", // Another Indian name
    //         customerEmail: "priya@example.com",
    //         bookingDate: "2024-05-23",
    //         bookingTime: "2:00 PM"  
    //     },
    //     slot: {
    //         startTime: "2:00 PM",
    //         endTime: "4:00 PM"
    //     },
    //     location: "Palampur",
    //     amount: 75.00,
    //     status: "Confirmed"
    // }
    const [bookingList, setBookingList] = useState([]);

    async function getBookingList() {
        try {
            setLoading(true)
            const response = await axiosHttpInstance.get('/api/booking/history/');
            if (response.status === 200) {
                setBookingList(response.data);
            } else if (response.status === 401) {
                await storeInDevice('LOGIN_REDIRECT', '/bookings');
                router.push('/user/login');
            }
        } catch (error) {
            // console.log(error);
        }
        setLoading(false)
    }
    useEffect(() => {
        getBookingList();
    }, []);


    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                    {!loading && (<Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                        Bookings
                    </Text>)}
                </View>
                <ScrollView>
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            getBookingList();
                        }}
                    >
                        {!loading && bookingList?.length === 0 && (
                            <View style={{ marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon
                                    source={"history"}
                                    size={50}
                                    color={"#666"}
                                />
                                <Text style={{ color: "#666", fontSize: 20, fontWeight: 'bold' }}>No Bookings</Text>
                            </View>
                        )}
                        {!loading && bookingList?.length > 0 && (<>
                            {bookingList?.map((order, index) => (
                                <Card style={{ margin: 10, marginBottom: 3, marginTop: 10, borderRadius: 0, elevation: 0, backgroundColor: 'white' }} key={index}>
                                    <Card.Content style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                        <View style={{ marginRight: 10 }}>
                                            <Image
                                                resizeMode="contain"
                                                source={{ uri: order?.imageUrl }}
                                                style={{ width: 100, height: 100, backgroundColor: '#eee' }}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order?.equipmentName}</Text>
                                            <Text style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Slot: {`${order?.bookingInfo?.bookingDate} (${order?.slot?.startTime} - ${order?.slot?.endTime})`} </Text>
                                            {/* <Text style={{ marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis' }}>Location:{order?.location}</Text> */}
                                            <Text>Amount: ₹{order?.amount}</Text>

                                            <Text style={{ color: 'green', fontWeight: 'bold' }}>Status: {order?.status}</Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))}
                        </>)}
                        {loading && (<ActivityIndicator
                            style={{ marginTop: 10 }}
                            size="large"
                            color={theme.colors.primary}
                        />)}

                    </RefreshControl>

                </ScrollView>

            </SafeAreaView>
        </>
    )

}