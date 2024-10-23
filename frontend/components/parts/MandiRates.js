import dayjs from "dayjs";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function MandiRates() {
    // What is APMC? APMC means the Agricultural Produce & Livestock Market Committee
    
    const sampleCommodityList = [
        {
            name: "Barley",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/barley-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",

        },
        {
            name: "Channa",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/chana-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Wheat",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/wheat-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Moong",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/moong-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Paddy (Basmathi)",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/paddy-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Bajra",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/bajra.jpg",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Maize (Kharif)",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/maize-kharif-south.jpg",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Turmeric",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/turmric-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Jeera",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/jeera-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Corriander",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/corriander-seeds-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Gorakhpur",
        },
        {
            name: "Castor Seed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/castor-seed-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Soy Beans",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/soy-bean-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Mustard Seed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/mustard-seed-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Ground Nut",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/ground-nut-1.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Refined Castor Oil",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/refined-castor-oil.jpg",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Soybean Meal",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/hipro.jpg",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Palm Oil",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/palm-oil-product.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Seseme Seed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/natural-whitish-sesame-seeds.jpg",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Soy Oil",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/refined-soy-oil-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Guar Seed    ",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/guar-seed10mt-products.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        },
        {
            name: "Isabgol Seed",
            imageUrl: "https://storage.googleapis.com/nccl-prod-bucket/assets/products/isabgol-seed.png",
            minPrice: 100,
            maxPrice: 200,
            market: "Shamli",
        }
    ].map((commodity) => ({ ...commodity, minPrice: commodity.name.length * commodity.name.charCodeAt(0), maxPrice: commodity.name.length * commodity.name.charCodeAt(0) + 20 }));
    
    const [commodityList, setCommodityList] = useState(sampleCommodityList);
    const [selectedMarket, setSelectedMarket] = useState("All Markets");
    const theme = useTheme();
    return (
        <View style={{ padding: 12, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily: "Inter_900Black", marginBottom: 5 }}>Live Mandi Rates</Text>
            <Text style={{ fontSize: 12, color: "gray", }}>Last Update: {dayjs().subtract(1, "minute").format("DD/MM/YYYY [at] hh:mm A")}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    marginVertical: 10
                }}
                contentContainerStyle={{ gap: 10 }}
            >
                {["All Markets", ...new Set(sampleCommodityList.map((commodity) => commodity.market))].map((market, index) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (market === "All Markets") {
                                setCommodityList(sampleCommodityList);
                            } else {
                                setCommodityList(sampleCommodityList.filter((commodity) => commodity.market === market));
                            }
                            setSelectedMarket(market);
                        }}
                        key={index}>
                        <Text
                            key={index}
                            style={{
                                fontSize: 12,
                                color: selectedMarket === market ? theme.colors.primary : "#333",
                                fontWeight: selectedMarket === market ? "bold" : 500,
                                borderWidth: 1,
                                borderColor: selectedMarket === market ? theme.colors.primary : "#333",
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                        >
                            {market}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                    flexWrap: "wrap",
                    gap: 10
                }}
            >
                {commodityList.map((commodity, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // marginVertical: 10,
                            width: "45%",
                            // paddingHorizontal: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <Image
                                source={{ uri: commodity.imageUrl }}
                                style={{ width: 50, height: 50, borderRadius: 100 }}
                            />
                            <View style={{ flexDirection: "column", gap: 3 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {commodity.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {currencyFormatter(commodity.minPrice)} - {currencyFormatter(commodity.maxPrice)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
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