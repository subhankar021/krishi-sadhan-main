import dayjs from "dayjs";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosHttpInstance from "../../../utils/axiosHttpInstance";

export default function DetailPage() {
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { equipmentId } = useGlobalSearchParams();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [equipmentData, setEquipmentData] = useState(null);
    const [slotsList, setSlotsList] = useState([]);
    const [selectingSlot, setSelectingSlot] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    async function getEquipmentDetails() {
        try {
            const response = await axiosHttpInstance.get(`/api/equipments/${equipmentId}/details`);
            if (response.status === 200) {
                setEquipmentData(response.data?.equipmentInfo);
                setSlotsList(response.data?.slotInfo);
                setSelectedSlot(response.data?.selectedSlot);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        setRefreshing(false);
    }

    async function selectSlot(timestamp) {
        setSelectingSlot(timestamp)
        try {
            const response = await axiosHttpInstance.post(`/api/equipments/${equipmentId}/select-slot`, { timestamp });
            if (response.status === 200) {
                await getEquipmentDetails();
            }
        } catch (error) {
            console.error(error);
        }
        setSelectingSlot(null);
    }

    useEffect(() => {
        getEquipmentDetails();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: theme.colors.primary, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onPrimary}
                    size={20}
                    onPress={() => router.back()}
                />
                <Text numberOfLines={1} style={{ flex: 1, overflow: 'hidden', paddingLeft: 10, paddingRight: 10, color: theme.colors.onPrimary, fontSize: 16 }} variant="titleLarge">{equipmentData?.name}</Text>
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
                    setRefreshing(true);
                    await getEquipmentDetails();
                }} />}
                style={{ paddingTop: 10, backgroundColor: theme.colors.background, }}>
                {loading && (
                    <ActivityIndicator
                        style={{ marginTop: 10 }}
                        size="large"
                        color={theme.colors.primary}
                    />
                )}
                {!loading && equipmentData && (<View style={{ backgroundColor: theme.colors.surface, marginBottom: 10, padding: 10 }}>
                    <View>
                        <View>
                            <Image source={{ uri: equipmentData.imageUrl }} style={{ backgroundColor: "#EFEFEF", resizeMode: 'contain', width: '100%', height: 200, borderRadius: 5 }} />
                        </View>
                        <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                            <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18, flex: 1, overflow: 'hidden' }}>{equipmentData.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.onBackground, flex: 1, flexWrap: 'wrap' }}>{equipmentData.description}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Text numberOfLines={1} style={{ fontSize: 18, color: theme.colors.onBackground, fontWeight: 'bold', flex: 1 }}>{equipmentData.price}</Text>
                                </View>
                                {equipmentData.aggregatorName && (<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Icon
                                        source="account-circle-outline"
                                        color={theme.colors.onBackground}
                                        size={15}
                                    />
                                    <Text numberOfLines={2} style={{ color: theme.colors.primary, fontWeight: 'bold', flex: 1 }}>{equipmentData.aggregatorName}</Text>
                                </View>)}
                            </View>
                        </View>
                    </View>
                    <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18, flex: 1, overflow: 'hidden', marginTop: 20 }}>Slot Selection for Booking</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}>
                            {slotsList.map((slot, slotIndex) => (
                                <Pressable key={`slot-item-${slotIndex}`} onPress={() => setSelectedDate(slot.date)}>
                                    <View style={{ backgroundColor: slot.date === selectedDate ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.primary, padding: 8, borderRadius: 10, width: 55, height: 60, borderWidth: 1, }}>
                                        <Text style={{ color: slot.date === selectedDate ? theme.colors.onPrimary : theme.colors.onBackground, textAlign: 'center', textTransform: 'uppercase', fontSize: 14 }}>{slot.day}</Text>
                                        <Text style={{ color: slot.date === selectedDate ? theme.colors.onPrimary : theme.colors.onBackground, textAlign: 'center', fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>{slot.dateOnly}</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                    <View>
                        {slotsList.filter((slot) => slot.date === selectedDate).map((slot, slotIndex) => (
                            <View key={`slot-type-${slotIndex}`} >
                                <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: "gray" }}>LEGENDS: </Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        {[
                                            { color: theme.colors.primary, text: "Available" }, // Green for indicating availability
                                            { color: "#9E9E9E", text: "Not Available" }, // Gray for indicating not available
                                            // { color: "#2196F3", text: "Selected" }, // Blue for indicating selected items
                                            { color: "#F44336", text: "Booked" }, // Red for indicating booked items

                                        ].map((item, index) => (
                                            <View key={index} style={{ borderWidth: 1, paddingLeft: 3, paddingRight: 8, borderColor: item.color, borderRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <View style={{ backgroundColor: item.color, width: 12, height: 12, borderRadius: 6 }} />
                                                <Text variant="bodyMedium" style={{ color: item.color, fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10 }}>{item.text}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>

                                {["morning", "afternoon", "evening"].map((timeSlot, timeSlotIndex) => (
                                    <View key={`time-slot-container-${timeSlotIndex}`}>
                                        <Text key={`time-slot-title-${timeSlotIndex}`} style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize', marginVertical: 10 }}>{timeSlot} Slots:</Text>
                                        <View key={`time-slot-${timeSlotIndex}`} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                                            {slot.slots[timeSlot].map((daySlot, daySlotIndex) => {
                                                let backgroundColor = "#9E9E9E";
                                                let textColor = "#9E9E9E";
                                                let statusText = "Not Available";
                                                let isSelectable = false;
                                                if (daySlot.isSelected) {
                                                    backgroundColor = "#2196F3";
                                                    textColor = "#2196F3";
                                                    statusText = "Selected";
                                                } else if (daySlot.isBooked) {
                                                    backgroundColor = "#F44336";
                                                    textColor = "#F44336";
                                                    statusText = "Booked";
                                                } else if (daySlot.available && !daySlot.isBooked) {
                                                    backgroundColor = theme.colors.primary;
                                                    textColor = theme.colors.primary;
                                                    statusText = "Available";
                                                    isSelectable = true;
                                                }

                                                return (
                                                    <Pressable
                                                        key={`time-slot-item-${timeSlotIndex}-${daySlotIndex}`}
                                                        style={{ opacity: isSelectable || daySlot.isSelected ? 1 : 0.5, borderWidth: 1, borderBottomWidth: 2, borderColor: backgroundColor, backgroundColor: daySlot.isSelected ? backgroundColor : null, width: "31%", borderRadius: 4, position: 'relative' }}
                                                        onPress={() => {
                                                            if (isSelectable) {
                                                                // selectSlot(daySlot.timestamp)
                                                            }
                                                        }}
                                                    >
                                                        <Text style={{ paddingHorizontal: 2, paddingVertical: 6, color: daySlot.isSelected ? theme.colors.onPrimary : backgroundColor, textAlign: 'center', textTransform: 'uppercase', fontSize: 15, fontWeight: 700 }}>{daySlot.slotTime}</Text>
                                                        {/* <Text style={{ paddingHorizontal: 2, paddingVertical: 1, letterSpacing: 0.75, color: textColor, backgroundColor: backgroundColor, textAlign: 'center', textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}>{statusText}</Text> */}
                                                        {selectingSlot === daySlot.timestamp && (<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 4, opacity: 0.75 }}>
                                                            <ActivityIndicator animating={true} color={theme.colors.primary} size="small" />
                                                        </View>)}
                                                    </Pressable>
                                                )
                                            })}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>)}
            </ScrollView>
        </SafeAreaView>
    );
}