import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import { ActivityIndicator, Button, Icon, IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import axiosHttpInstance from '../../utils/axiosHttpInstance';
import dayjs from "dayjs";

export default function EquipmentScheduler({ equipmentId = null }) {
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
        villageId: null
    });
    const [loading, setLoading] = useState(false);
    const [slotsList, setSlotsList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectingSlot, setSelectingSlot] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    async function getEquipmentDetails(equipmentId) {
        try {
            const response = await axiosHttpInstance.get(`/api/aggregator/equipments/${equipmentId}/schedule`);
            if (response.status === 200) {
                console.log(response.data);
                setEquipmentDetails(response.data?.equipmentInfo);
                setSlotsList(response.data?.slotInfo);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateBlockage(timestamp) {
        setSelectingSlot(timestamp);
        try {
            const response = await axiosHttpInstance.put(`/api/aggregator/equipments/${equipmentId}/update-blockage`, { timestamp });
            if (response.status === 200) {
                await getEquipmentDetails(equipmentId);
            }
        } catch (error) {
            console.error(error);
        }

        setSelectingSlot(null);
    }

    useEffect(() => {
        getEquipmentDetails(equipmentId);
    }, []);

    return (
        <AutocompleteDropdownContextProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                    {!loading && (<Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                        Equipment Scheduler
                    </Text>)}
                </View>
                <ScrollView>
                    {(equipmentId && equipmentDetails.name) ? (<View style={{ display: "grid", gap: 10, padding: 15 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                source={{ uri: equipmentDetails?.imageUrl }}
                                style={{ width: 40, height: 40, borderRadius: 100 }}
                            />
                            <View>
                                <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18 }}>{equipmentDetails?.name}</Text>
                            </View>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}>
                                {slotsList.map((slot, slotIndex) => (
                                    <Pressable key={`slot-item-${slotIndex}`} onPress={() => setSelectedDate(slot.date)}>
                                        <View style={{ backgroundColor: slot.date === selectedDate ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, borderRadius: 10, width: 55, height: 65, borderWidth: 1, }}>
                                            <Text style={{ color: slot.date === selectedDate ? theme.colors.onPrimary : theme.colors.onBackground, textTransform: 'uppercase', fontSize: 14 }}>{slot.day}</Text>
                                            <Text style={{ color: slot.date === selectedDate ? theme.colors.onPrimary : theme.colors.onBackground, fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>{slot.dateOnly}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                        <View>
                            <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 14 }}>
                                Slot Scheduling Mechanism
                            </Text>
                            <Text style={{ color: theme.colors.onBackground, fontSize: 12 }}>
                                All slots in the system are initially enabled for farmers to book equipment.
                                You can only block unbooked and future slots for booking by clicking on them and waiting for the update. Once blocked, you can click again to unblock them.
                            </Text>
                        </View>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: "gray" }}>LEGENDS: </Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        {[
                                            { color: theme.colors.primary, text: "Available" }, // Green for indicating availability
                                            { color: "#9E9E9E", text: "Booked" }, // Gray for indicating not available
                                            // { color: "#2196F3", text: "Selected" }, // Blue for indicating selected items
                                            { color: "#F44336", text: "Blocked" }, // Red for indicating booked items

                                        ].map((item, index) => (
                                            <View key={index} style={{ borderWidth: 1, paddingLeft: 3, paddingRight: 8, borderColor: item.color, borderRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <View style={{ backgroundColor: item.color, width: 12, height: 12, borderRadius: 6 }} />
                                                <Text variant="bodyMedium" style={{ color: item.color, fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10 }}>{item.text}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                        <View>
                            {slotsList.filter(slot => slot.date === selectedDate).map((slot, slotIndex) => (
                                <View key={`slot-type-${slotIndex}`} >
                                    {["morning", "afternoon", "evening"].map((timeSlot, timeSlotIndex) => (
                                        <View key={`time-slot-container-${timeSlotIndex}`}>
                                            <Text key={`time-slot-title-${timeSlotIndex}`} style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize', marginVertical: 10 }}>{timeSlot} Slots:</Text>
                                            <View key={`time-slot-${timeSlotIndex}`} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                                                {slot.slots[timeSlot].map((daySlot, daySlotIndex) => {
                                                    let backgroundColor = "#666";
                                                    let isSelectable = false;
                                                    if (daySlot.isBlocked) {
                                                        isSelectable = true;
                                                        backgroundColor = "#FF0000";
                                                        textColor = "#FF0000";
                                                        statusText = "Blocked";
                                                    } else if (daySlot.isSelected) {
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
                                                                    updateBlockage(daySlot.timestamp)
                                                                }
                                                            }}
                                                        >
                                                            <Text style={{ paddingHorizontal: 2, paddingVertical: 6, color: daySlot.isSelected ? theme.colors.onPrimary : backgroundColor, textAlign: 'center', textTransform: 'uppercase', fontSize: 15, fontWeight: 700 }}>{daySlot.slotTime}</Text>
                                                            {selectingSlot === daySlot.timestamp && (<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 4, opacity: 0.75 }}>
                                                                <ActivityIndicator animating={true} color={backgroundColor} size="small" />
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
        </AutocompleteDropdownContextProvider>
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
