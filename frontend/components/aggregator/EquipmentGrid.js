import { useGlobalSearchParams, useRouter } from "expo-router";
import { Image, RefreshControl, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosHttpInstance from "../../utils/axiosHttpInstance";
import { useEffect, useState } from "react";

export default function EquipmentsGrid() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { categoryId } = useGlobalSearchParams();
    const [categoryTitle, setCategoryTitle] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [equipmentList, setEquipmentList] = useState([]);

    async function getEquipmentList() {
        setLoading(true);
        try {
            const response = await axiosHttpInstance.get(`/api/aggregator/equipments/list`);
            if (response.status === 200) {
                setCategoryTitle(response.data.categoryName);
                setEquipmentList(response.data.equipments);
                // console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        setRefreshing(false);
    }

    useEffect(() => {
        getEquipmentList();
    }, []);

    return (
        <View>
            {loading && equipmentList.length === 0 && (
                <ActivityIndicator
                    style={{ marginTop: 10 }}
                    size="large"
                    color={theme.colors.primary}
                />
            )}
            {equipmentList.length === 0 && !loading && (
                <>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>No Equipments Found</Text>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Please add Equipments</Text>
                </>
            )}
            {equipmentList.length > 0 && (
                <>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Your Equipments</Text>
                    {equipmentList.map((item) => (
                        <View
                            key={item.equipmentId}
                            style={{ borderWidth: 1, borderRadius: 2, borderColor: "#e0e0e0", marginBottom: 10 }}
                        >
                            <View style={{ backgroundColor: theme.colors.surface, marginBottom: 10, padding: 10 }} key={item.equipmentId}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <View>
                                        <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 100, borderRadius: 5 }} />
                                    </View>
                                    <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <View style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text numberOfLines={1} style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16, flex: 1, overflow: 'hidden' }}>{item.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text numberOfLines={2} style={{ color: theme.colors.onBackground, flex: 1, flexWrap: 'wrap' }}>{item.description}</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text numberOfLines={1} style={{ color: theme.colors.onBackground, fontWeight: 'bold', flex: 1 }}>{item.price}</Text>
                                            </View>
                                            {item.aggregatorName && (<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Icon
                                                    source="account-circle-outline"
                                                    color={theme.colors.onBackground}
                                                    size={15}
                                                />
                                                <Text numberOfLines={1} style={{ color: theme.colors.primary, fontWeight: 'bold', flex: 1 }}>{item.aggregatorName}</Text>
                                            </View>)}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ backgroundColor: "#efefef", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({
                                            pathname: '/aggregator/details/[equipmentId]',
                                            params: { equipmentId: item.equipmentId },
                                        })
                                    }}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}
                                >
                                    <Icon
                                        source="eye-outline"
                                        color={theme.colors.onBackground}
                                        size={15}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({
                                            pathname: '/aggregator/equipment/edit/[equipmentId]',
                                            params: { equipmentId: item.equipmentId },
                                        })
                                    }}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Icon
                                        source="pencil-outline"
                                        color={theme.colors.onBackground}
                                        size={15}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({
                                            pathname: '/aggregator/equipment/scheduler/[equipmentId]',
                                            params: { equipmentId: item.equipmentId },
                                        })
                                    }}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Icon
                                        source="calendar-outline"
                                        color={theme.colors.onBackground}
                                        size={15}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Schedule</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </>
            )}
        </View>
    );
}