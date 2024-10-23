import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeBanner from '../parts/HomeBanner';
import HomeFooter from '../parts/HomeFooter';
import MandiRates from '../parts/MandiRates';
import MenuGrid from '../parts/MenuGrid';
import WeatherUpdates from '../parts/WeatherUpdates';
import EquipmentsGrid from './EquipmentGrid';
import { CommodityQuotes } from '../../app/farmer/sell_crops';

export default function AggregatorHome() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [selectedMenu, setSelectedMenu] = useState("home");

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: insets.top, display: 'flex', gap: 10, padding: 10, backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row' }}>
                <Image
                    source={require('../../assets/kishan_bhai.png')}
                    style={{ width: 32, height: 32 }}
                />
                <Text style={{ color: theme.colors.onPrimary, fontSize: 20, fontFamily: "Inter_900Black", }}>
                    Krishi Sadhan
                </Text>
            </View>
            <ScrollView>
            {selectedMenu === "home" && (
            <>
              {/* <HomeSearch /> */}
              <HomeBanner
              bannerList={[
                { imageUrl: "https://media.licdn.com/dms/image/v2/C5112AQED_5PhAZKwVg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520132337849?e=2147483647&v=beta&t=QA1Vrf49LjGEJpVfA972WL0uhdelcVaZqbPopJDe338", text: "\n\n\nRent Your Equipments\n@ Krishi Sadhan" },
                { imageUrl: "https://www.tractorjunction.com/blog/wp-content/uploads/2022/09/Top-10-agriculture-equipment-list-in-India.jpg", text: null },
                { imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*ZMQfziglB84oE_R124d29w.jpeg", text: null },
            ]}
              />
              <MenuGrid appMode='AGGREGATOR' />
              <View style={{ height: 10 }} />
              <WeatherUpdates />
              <MandiRates />
              <View style={{ height: 50 }} />
            </>
          )}
                {selectedMenu === "equipments" && <View style={{ padding: 10 }}>
                    <EquipmentsGrid />
                </View>}
                {selectedMenu === "crop_quotes" && <View style={{ padding: 10 }}>
                    <CommodityQuotes pageFor="AGGREGATOR" />
                </View>}
              <View style={{ height: 50 }} />

            </ScrollView>
            <HomeFooter appMode="AGGREGATOR" onMenuClicked={setSelectedMenu} />
            {selectedMenu === "equipments" && <FAB
                color='white'
                backgroundColor={theme.colors.primary}
                icon="plus"
                mode="flat"
                variant="primary"
                style={{ position: "absolute", borderRadius: 100, bottom: 70, right: 20 }}
                onPress={() => {
                    router.push("/aggregator/equipment/create");
                }}
            />}
        </SafeAreaView>
    );
}