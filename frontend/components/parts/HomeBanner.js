import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Text } from "react-native-paper";
import { SwiperFlatList } from 'react-native-swiper-flatlist';

export default function HomeBanner({bannerList = []}) {
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    return (
        <>
        {bannerList.length > 0 && <View>
            <SwiperFlatList
                autoplay
                autoplayDelay={5}
                autoplayLoop
                autoplayLoopKeepAnimation
                renderAll
                bounces
                nestedScrollEnabled
                data={bannerList}
                renderItem={({ item }) => (
                    <View key={item.imageUrl} style={{ padding: 10, borderRadius: 10, width: SCREEN_WIDTH, height: 180, position: "relative" }}>
                        {item.text && <View style={{ borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", top: 10, left: 10, right: 10, bottom: 10, zIndex: 5, backgroundColor: "rgba(0, 0, 0, 0.25)" }}>
                            <Text style={{ color: "#fff", fontSize: 25, fontFamily: "Inter_900Black", textAlign: "center" }}>{item.text}</Text>
                        </View>}
                        <Image
                            resizeMode="stretch"
                            source={{ uri: item.imageUrl, cache: "force-cache" }}
                            style={{ borderRadius: 10, width: "100%", height: "100%" }}
                        />
                    </View>
                )}
            />
        </View>}
        </>
    );
}

