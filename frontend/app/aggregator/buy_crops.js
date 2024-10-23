import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, Avatar, Card, Chip, Button, IconButton, ActivityIndicator, Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommodityQuotes } from '../farmer/sell_crops';

export default function Bookings() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tabView, setTabView] = useState("LIST");

    const sampleCommodityList = [
        {
            name: "Barley Whole Grain for Cooking",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/barley-product.png",
            price: 2000,
            farmerName: "Rajesh Kumar",
            unit: "kg",
        },
        {
            name: "Desi Chickpeas for Cooking and Snacks",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/chana-product.png",
            price: 5500,
            farmerName: "Sita Devi",
            unit: "kg",
        },
        {
            name: "High Quality Wheat for Flour Production",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/wheat-product.png",
            price: 2200,
            farmerName: "Mohit Yadav",
            unit: "kg",
        },
        {
            name: "Green Gram for Pulses and Sprouts",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/moong-products.png",
            price: 8000,
            farmerName: "Aarti Singh",
            unit: "kg",
        },
        {
            name: "Premium Basmathi Rice Paddy for Milling",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/paddy-products.png",
            price: 3000,
            farmerName: "Vinod Sharma",
            unit: "q",  // Quintals for large quantities of paddy
        },
        {
            name: "Pearl Millet for Traditional Dishes",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/bajra.jpg",
            price: 1500,
            farmerName: "Pooja Patel",
            unit: "kg",
        },
        {
            name: "Kharif Corn for Animal Feed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/maize-kharif-south.jpg",
            price: 2000,
            farmerName: "Anil Kumar",
            unit: "q",  // Quintals for large quantities of maize
        },
        {
            name: "Dried Turmeric Rhizomes for Spice Use",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/turmric-products.png",
            price: 12000,
            farmerName: "Sunita Devi",
            unit: "kg",
        },
        {
            name: "Cumin Seeds for Cooking and Seasoning",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/jeera-product.png",
            price: 20000,
            farmerName: "Ramesh Chandra",
            unit: "kg",
        },
        {
            name: "Coriander Seeds for Spice Blends",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/corriander-seeds-product.png",
            price: 6000,
            farmerName: "Gita Patel",
            unit: "kg",
        },
        {
            name: "Castor Seed for Oil Extraction",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/castor-seed-products.png",
            price: 3500,
            farmerName: "Raj Kumar",
            unit: "kg",
        },
        {
            name: "Soybean Seeds for Oil and Feed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/soy-bean-products.png",
            price: 4000,
            farmerName: "Neelam Singh",
            unit: "kg",
        },
        {
            name: "Yellow Mustard Seeds for Oil Extraction",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/mustard-seed-products.png",
            price: 5500,
            farmerName: "Suraj Yadav",
            unit: "kg",
        },
        {
            name: "Peanuts for Snacking and Cooking",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/ground-nut-1.png",
            price: 7500,
            farmerName: "Amit Kumar",
            unit: "kg",
        },
        {
            name: "Processed Refined Castor Oil for Use",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/refined-castor-oil.jpg",
            price: 20000,
            farmerName: "Rekha Rani",
            unit: "L",  // Liters for oil
        },
        {
            name: "Protein-Rich Soybean Meal for Livestock",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/hipro.jpg",
            price: 3000,
            farmerName: "Suresh Chandra",
            unit: "kg",
        },
        {
            name: "Refined Palm Oil for Cooking and Frying",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/palm-oil-product.png",
            price: 7000,
            farmerName: "Anju Sharma",
            unit: "L",  // Liters for oil
        },
        {
            name: "Natural White Sesame Seeds for Cooking",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/natural-whitish-sesame-seeds.jpg",
            price: 10000,
            farmerName: "Manoj Patel",
            unit: "kg",
        },
        {
            name: "Refined Soybean Oil for Cooking and Baking",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/refined-soy-oil-products.png",
            price: 15000,
            farmerName: "Nita Devi",
            unit: "L",  // Liters for oil
        },
        {
            name: "Guar Beans for Industrial and Farm Use",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/guar-seed10mt-products.png",
            price: 4000,
            farmerName: "Krishna Kumar",
            unit: "kg",
        },
        {
            name: "Psyllium Husk for Health Supplements",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/isabgol-seed.png",
            price: 9000,
            farmerName: "Suman Sharma",
            unit: "kg",
        }
    ];

    const { width: SCREEN_WIDTH } = Dimensions.get('window');

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                    <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                        Buy Crops
                    </Text>
                </View>
                <View style={{ backgroundColor: theme.colors.surface, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setTabView("LIST");
                        }}
                        style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, borderBottomWidth: 3, borderBottomColor: tabView === "LIST" ? theme.colors.primary : "#EFEFEF", borderRadius: 0 }}
                    >
                        <Icon size={18} source="sprout" color={"black"} />
                        <Text style={{ color: "black", textAlign: 'center', fontWeight: 'bold' }}>CROP LIST</Text></TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setTabView("QUOTES");
                        }}
                        style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, borderBottomWidth: 3, borderBottomColor: tabView === "QUOTES" ? theme.colors.primary : "#EFEFEF", borderRadius: 0 }}>
                        <Icon size={18} source="receipt" color={"black"} />
                        <Text style={{ color: "black", textAlign: 'center', fontWeight: 'bold' }}>  MY QUOTES</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {

                        }}
                    >
                        { tabView === "LIST" && <View style={{ display: 'flex', flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {sampleCommodityList.map((commodity) => (
                                <View key={commodity.name} style={{ width: SCREEN_WIDTH / 2 - 6, padding: 8, backgroundColor: "#fff", display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10 }}>
                                    <View style={{ backgroundColor: "#eee", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                                        <Image source={{ uri: commodity.imageUrl }} style={{ borderRadius: 100, width: 90, height: 90 }} />
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <Text style={{ fontSize: 14 }}>{commodity.name}</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: 4, marginTop: 4, marginRight: 4, alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: 14, fontWeight: 'bold' }}>{currencyFormatter(commodity.price)} / {commodity.unit}</Text>
                                            <TouchableOpacity 
                                            onPress={() => {
                                                router.push(`/aggregator/quote_commodity/`);
                                            }}
                                            style={{ display: 'flex', flexDirection: 'row', gap: 4, marginTop: 4, alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                                                <Icon
                                                    source={"cart-plus"}
                                                    size={14}
                                                    color={"#FFF"}
                                                />
                                                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 12 }}>
                                                    BUY
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: 4, marginTop: 4, alignItems: 'center' }}>
                                            <Icon
                                                source={"account"}
                                                size={14}
                                                color={"#666"}
                                            />
                                            <Text style={{ color: "#666", fontSize: 12 }}>
                                                {commodity.farmerName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>}
                        { tabView === "QUOTES" && <CommodityQuotes viewFor="AGGREGATOR" />}
                    </RefreshControl>

                </ScrollView>

            </SafeAreaView>
        </>
    )

}
function currencyFormatter(value) {
    const currency = "INR";
    return Intl.NumberFormat("en-IN", {
        style: "currency",
        minimumFractionDigits: 0,
        currency: currency,
    }).format(value);
}