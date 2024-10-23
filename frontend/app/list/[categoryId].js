import { useGlobalSearchParams, useRouter } from "expo-router";
import { Image, RefreshControl, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import axiosHttpInstance from "../../utils/axiosHttpInstance";
import { useEffect, useState } from "react";

export default function CategoryPage() {
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
            const response = await axiosHttpInstance.get(`/api/equipments/${categoryId}/list`);
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: theme.colors.primary, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onPrimary}
                    size={20}
                    onPress={() => router.back()}
                />
                <Text numberOfLines={1} style={{ flex: 1, overflow: 'hidden', paddingLeft: 10, paddingRight: 10, color: theme.colors.onPrimary, fontSize: 16 }} variant="titleLarge">{categoryTitle}</Text>
            </View>
            <ScrollView 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
                setRefreshing(true);
                await getEquipmentList();
              }} />}
            style={{ paddingTop: 10, paddingBottom: insets.bottom + 50, backgroundColor: theme.colors.background }}>
                {loading && (
                    <ActivityIndicator
                        style={{ marginTop: 10 }}
                        size="large"
                        color={theme.colors.primary}
                    />
                )}
                {!loading && equipmentList.length === 0 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon
                        source={"information-outline"}
                        size={50}
                        color={"#666"}
                    />
                    <Text style={{ marginTop: 10, color: theme.colors.onBackground, textAlign: 'center' }}>No equipments found in this category.</Text>
                    </View>
                )}
                {!loading && equipmentList.map((item) => (
                    <TouchableOpacity key={item.equipmentId} onPress={() => {
                        router.push({
                            pathname: '/details/[equipmentId]',
                            params: { equipmentId: item.equipmentId },
                        })
                    }}>
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
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}