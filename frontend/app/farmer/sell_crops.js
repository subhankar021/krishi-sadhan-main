import dayjs from "dayjs";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FAB, Icon, IconButton, Switch, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function Bookings() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tabView, setTabView] = useState("LIST");



    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: insets.top, display: 'flex', gap: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#fff', flexDirection: 'row' }}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onPrimary} onPress={() => router.back()} />
                    <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary, fontSize: 20 }}>
                        Sell Crops
                    </Text>
                </View>
                <View style={{ backgroundColor: theme.colors.surface, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setTabView("LIST");
                        }}
                        style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, borderBottomWidth: 3, borderBottomColor: tabView === "LIST" ? theme.colors.primary : "#EFEFEF", borderRadius: 0 }}
                    >
                        <Icon size={18} source="grid" color={"black"} />
                        <Text style={{ color: "black", textAlign: 'center', fontWeight: 'bold' }}>MY LIST</Text></TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setTabView("QUOTES");
                        }}
                        style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 10, borderBottomWidth: 3, borderBottomColor: tabView === "QUOTES" ? theme.colors.primary : "#EFEFEF", borderRadius: 0 }}>
                        <Icon size={18} source="receipt" color={"black"} />
                        <Text style={{ color: "black", textAlign: 'center', fontWeight: 'bold' }}>QUOTES</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {tabView === "LIST" ? <CommodityList /> : <CommodityQuotes />}
                </ScrollView>
                {tabView === "LIST" && <FAB style={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: theme.colors.primary, borderRadius: 100 }} color={theme.colors.onPrimary} icon="plus" onPress={() => router.push("/farmer/add_crops")} />}
            </SafeAreaView>
        </>
    )

}


function CommodityList() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const [commodityList, setCommodityList] = useState([
        {
            id: 1,
            name: "Barley Whole Grain for Cooking",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/barley-product.png",
            price: 2000,
            itemLocation: "Gidhaura Village, Prayagraj",
            unit: "kg",
            isActive: true
        },
        {
            id: 2,
            name: "Desi Chickpeas for Cooking and Snacks",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/chana-product.png",
            price: 5500,
            itemLocation: "Niriya Village, Prayagraj",
            unit: "kg",
            isActive: true
        },
        {
            id: 3,
            name: "High Quality Wheat for Flour Production",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/wheat-product.png",
            price: 2200,
            itemLocation: "Shyam Vihar, Prayagraj",
            unit: "kg",
            isActive: true
        },
        {
            id: 4,
            name: "Green Gram for Pulses and Sprouts",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/moong-products.png",
            price: 8000,
            itemLocation: "Gidhaura Village, Prayagraj",
            unit: "kg",
            isActive: false
        },
        {
            id: 5,
            name: "Premium Basmathi Rice Paddy for Milling",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/paddy-products.png",
            price: 3000,
            itemLocation: "Niriya Village, Prayagraj",
            unit: "q",  // Quintals for large quantities of paddy
            isActive: true
        },
    ]);
    return (
        <View style={{ paddingTop: 10, display: 'flex', flexDirection: 'row', margin: 4, gap: 10, flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            {commodityList.map((commodity, commodityIndex) => (
                <View key={commodity.id} style={{ padding: 8, borderBottomWidth: 1, borderColor: "#eee", backgroundColor: "#fff", display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10 }}>
                    <View style={{ borderRadius: 4, backgroundColor: "#eee", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                        <Image source={{ uri: commodity.imageUrl }} style={{ borderRadius: 100, width: 90, height: 90 }} />
                    </View>
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14 }}>{commodity.name}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 4, marginTop: 4, marginRight: 4, alignItems: 'center' }}>
                            <Text style={{ flex: 1, fontSize: 14, fontWeight: 'bold' }}>{currencyFormatter(commodity.price)} / {commodity.unit}</Text>
                            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', gap: 4, marginTop: 4, alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
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
                                source={"map-marker"}
                                size={14}
                                color={"#666"}
                            />
                            <Text style={{ color: "#666", fontSize: 12 }}>
                                {commodity.itemLocation}
                            </Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                            <Switch value={commodity.isActive} onValueChange={() => {
                                setCommodityList(prev => {
                                    const newCommodityList = [...prev];
                                    newCommodityList[commodityIndex].isActive = !newCommodityList[commodityIndex].isActive;
                                    return newCommodityList
                                })
                            }} />
                            <Text style={{ color: "#666", fontSize: 12 }}>
                                {commodity.isActive ? "Available for sale" : "Not available for sale"}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )

}

export function CommodityQuotes({ viewFor = "FARMER" }) {
    const router = useRouter();
    const [quoteList, setQuoteList] = useState([
        {
            quoteId: 1,
            name: "Green Gram for Pulses and Sprouts",
            farmerName: "Shivam Kumar",
            quotedBy: "Mirch Jain",
            unitPrice: 8000,
            quantity: 1,
            unit: "kg",
            quotedPrice: 8000,
            quotedOn: dayjs().subtract(2, "day").format("DD-MM-YYYY HH:mm:ss"),
            isActive: true,
        },
        {
            quoteId: 2,
            name: "Basmati Rice Paddy for Milling",
            farmerName: "Shivam Hegde",
            quotedBy: "Ashok Kumar",
            unitPrice: 3000,
            quantity: 2,
            unit: "kg",
            quotedPrice: 6000,
            quotedOn: dayjs().subtract(1, "day").format("DD-MM-YYYY HH:mm:ss"),
            isActive: false,
        },
        {
            quoteId: 3,
            name: "Wheat - Harvested for Milling",
            farmerName: "Krishna Malhotra",
            quotedBy: "Suresh",
            unitPrice: 2000,
            quantity: 1,
            unit: "kg",
            quotedPrice: 2000,
            quotedOn: dayjs().subtract(1, "day").format("DD-MM-YYYY HH:mm:ss"),
            isActive: true,
        },
        {
            quoteId: 4,
            name: "Cotton | Seed removed & well packed | Ready for ship & export quality",
            farmerName: "Manish Gupta",
            quotedBy: "Suresh",
            unitPrice: 5000,
            quantity: 1,
            unit: "kg",
            quotedPrice: 4000,
            quotedOn: dayjs().subtract(1, "day").format("DD-MM-YYYY HH:mm:ss"),
            isActive: true,
        },
    ]);
    return (
        <View style={{ padding: 10 }}>
            {quoteList.map((quote, quoteIndex) => (
                <View key={quote.quoteId} style={{
                    marginBottom: 15,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 5,
                    backgroundColor: '#f9f9f9',
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{quote.name}</Text>

                    {quoteData = [
                        viewFor === "FARMER" ? { label: 'Quoted By:', value: quote.quotedBy } : { label: 'Farmer Name:', value: quote.farmerName },
                        { label: 'Estimated Price:', value: `${currencyFormatter(quote.unitPrice)} / ${quote.quantity} ${quote.unit}` },
                        { label: 'Quoted Price:', value: `${currencyFormatter(quote.quotedPrice)} / ${quote.quantity} ${quote.unit}` },
                        { label: 'Quoted On:', value: quote.quotedOn }
                    ].map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontSize: 13, color: '#666', fontWeight: 'bold' }}>{item.label} </Text>
                            <Text style={{ fontSize: 14}}>{item.value}</Text>
                        </View>
                    ))}
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginVertical: 5,
                        color: quote.isActive ? '#008000' : '#C00000'
                    }}>
                        {quote.isActive ? "Quote Active" : "Quote Withdrawn"}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#ddd',
                        paddingTop: 10
                    }}>
                        <TouchableOpacity onPress={() => {
                            if (quote.isActive) {

                                Alert.alert("Withdraw", "Are you sure you want to withdraw this quote?", [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        style: "destructive", text: "Withdraw", onPress: () => setQuoteList(prev => {
                                            const newQuoteList = [...prev];
                                            newQuoteList[quoteIndex].isActive = false;
                                            return newQuoteList
                                        })
                                    }
                                ]);
                            }
                        }} style={{ opacity: quote.isActive ? 1 : 0.3, borderRightColor: '#ddd', borderRightWidth: 1, flexGrow: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon source="cancel" size={16} color="#C00000" />
                            <Text style={{ marginLeft: 5, color: '#C00000', fontWeight: 'bold', fontSize: 14 }}>Withdraw Quote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            router.push(`/farmer/commodity_chat?cropId=${quote.name}&quoteId=${quote.quoteId}&pageFor=${viewFor}`);
                        }} style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon source="message" size={16} color="#008000" />
                            <Text style={{ marginLeft: 5, color: '#008000', fontWeight: 'bold', fontSize: 14 }}>Message Buyer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

        </View>
    );
}

function currencyFormatter(value) {
    const currency = "INR";
    return Intl.NumberFormat("en-IN", {
        style: "currency",
        minimumFractionDigits: 0,
        currency: currency,
    }).format(value);
}