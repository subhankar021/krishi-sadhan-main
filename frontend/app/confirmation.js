import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator, Button, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import axiosHttpInstance from "../utils/axiosHttpInstance";
import { storeInDevice } from "../utils/appStorage";

export default function DetailPage() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const theme = useTheme();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState("INIT");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    async function getItemDetails() {
        setLoading("INIT");
        try {
            const response = await axiosHttpInstance.get(`/api/booking/book`);
            // console.log(response.data);
            if (response.status === 200) {
                setItem(response.data);
            } else if (response.status === 401) {
                await storeInDevice("LOGIN_REDIRECT", "/confirmation");
                router.replace({
                    pathname: "/user/login",
                    params: { sourceUrl: router.asPath }
                });
                // router.push("/user/login");
                return;
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    async function confirmBooking() {
        setLoading("CONFIRM");
        try {
            const response = await axiosHttpInstance.post(`/api/booking/confirm`);
            if (response.status === 200) {
                setBookingConfirmed(true);
                setTimeout(() => {
                    // router.dismiss();
                    router.replace({
                        pathname: "/bookings/",
                    });
                }, 2000);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(null);
    }

    const bookingItems = [{ "Booking Date": dayjs().format('DD-MM-YYYY') }, { "Slot": "10:00 - 11:00" }, { "Amount": item?.price || "" }];

    useEffect(() => {
        getItemDetails();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: theme.colors.primary,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onPrimary}
                    size={20}
                    onPress={() => router.back()}
                />
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        paddingLeft: 10,
                        paddingRight: 10,
                        color: theme.colors.onPrimary,
                        fontSize: 16,
                    }}
                    variant="titleLarge"
                >{`Booking Confirmation`}</Text>
            </View>
            <ScrollView style={{ backgroundColor: theme.colors.background }}>
                {loading && (
                    <View style={{ flex: 1, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        {loading === "INIT" && (
                            <>
                                <Text style={{ marginTop: 15 }}>Booking in progress...</Text>
                                <Text style={{ marginTop: 5 }}>Please wait while we process your booking.</Text>
                            </>
                        )}
                        {loading === "CONFIRM" && (
                            <>
                                <Text style={{ marginTop: 15 }}>Confirming booking...</Text>
                            </>
                        )}
                    </View>
                )}
                {bookingConfirmed && (
                    <View style={{ flex: 1, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                        <Icon source="check-circle" size={50} color={theme.colors.primary} />
                        <Text style={{ marginTop: 15, fontSize: 20, fontWeight: 'bold' }}>Booking confirmed!</Text>
                        <Text style={{ marginTop: 5, fontSize: 16 }}>Redirecting to booking history.</Text>
                    </View>
                )}
                {item && !loading && !bookingConfirmed && (<View style={{ backgroundColor: theme.colors.surface, marginBottom: 10, padding: 10 }}>
                    {/* <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16, marginBottom: 15 }}>Booking Details:</Text> */}
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View>
                            <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 100, borderRadius: 5 }} />
                        </View>
                        <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.colors.surface }}>
                            <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16, flex: 1, overflow: 'hidden' }}>{item.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.onBackground, flex: 1, flexWrap: 'wrap' }}>{item.description}</Text>
                                </View>
                                {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Text numberOfLines={1} style={{ color: theme.colors.onBackground, fontWeight: 'bold', flex: 1 }}>{item.price}</Text>
                                </View> */}
                                {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Icon
                                        source="account-circle-outline"
                                        color={theme.colors.onBackground}
                                        size={15}
                                    />
                                    <Text numberOfLines={1} style={{ color: theme.colors.primary, fontWeight: 'bold', flex: 1 }}>{item.owner}</Text>
                                </View> */}
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 15, marginTop: 20, borderRadius: 5 }}>
                        {bookingItems.map((detail, index) => (
                            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5, paddingVertical: 10, borderBottomWidth: bookingItems.length - 1 === index ? 0 : 1, borderBottomColor: theme.colors.outline, borderStyle: "dashed" }}>
                                <Text numberOfLines={1} style={{ color: theme.colors.onBackground, fontSize: 14, flex: 1 }}>{Object.keys(detail)[0]}</Text>
                                <Text numberOfLines={1} style={{ color: theme.colors.onBackground, fontSize: 15, flex: 1, fontWeight: 'bold', textAlign: 'right' }}>{Object.values(detail)[0]}</Text>
                            </View>
                        ))}
                    </View>
                    <Button
                        mode="contained"
                        style={{ marginVertical: 20, fontSize: 18, paddingVertical: 5 }}
                        onPress={() => {
                            confirmBooking();
                        }}
                    >
                        CONFIRM
                    </Button>
                </View>)}
            </ScrollView>
        </SafeAreaView>
    );
}
