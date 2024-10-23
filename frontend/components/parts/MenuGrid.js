import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenuGrid({ appMode = "FARMER" }) {
    const router = useRouter();
    const titleText = {
        FARMER: "Agricultural Services",
        AGGREGATOR: "Aggregator Services",
    };
    const subTitleText = {
        FARMER: "Discover essential farming services",
        AGGREGATOR: "Explore curated aggregator services",
    };
    return (
        <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{titleText[appMode]}</Text>
            <Text style={{ fontSize: 12, marginBottom: 10, color: "gray" }}>{subTitleText[appMode]}</Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 10 }}>
                {appMode === "FARMER" && <>

                    <TouchableOpacity onPress={() => {
                        router.push("/farmer/sell_crops");
                    }}
                        style={{ backgroundColor: "#D6EFD8", padding: 10, width: "48%", borderRadius: 10, flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Image
                            source={require("../../assets/menu/farming.png")}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Sell Crops</Text>
                        <Text style={{ fontSize: 12, textAlign: "center" }}>Turn Your Harvest into Profit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "#D6EFD8", padding: 10, width: "48%", borderRadius: 10, flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Image
                            source={require("../../assets/menu/tractor.png")}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Hire Equipments</Text>
                        <Text style={{ fontSize: 12, textAlign: "center" }}>Reserve Essential Machinery</Text>
                    </TouchableOpacity>
                </>}
                {appMode === "AGGREGATOR" && <>
                    <TouchableOpacity
                        onPress={() => {
                            router.push("/aggregator/buy_crops");
                        }}
                        style={{ backgroundColor: "#D6EFD8", padding: 10, width: "48%", borderRadius: 10, flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Image
                            source={require("../../assets/menu/shopping-bag.png")}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Buy Crops</Text>
                        <Text style={{ fontSize: 12, textAlign: "center" }}>Purchase Quality Seeds and Produce</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "#D6EFD8", padding: 10, width: "48%", borderRadius: 10, flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Image
                            source={require("../../assets/menu/tractor.png")}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Rent Equipments</Text>
                        <Text style={{ fontSize: 12, textAlign: "center" }}>Earn by Renting Out Your Equipment</Text>
                    </TouchableOpacity>
                </>}
            </View>
        </View>
    );
}

