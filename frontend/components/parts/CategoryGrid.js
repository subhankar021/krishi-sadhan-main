import React, { useEffect } from 'react';
import { View, Dimensions, Image, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
export default function CategoryGrid({ categoriesList }) {
    const {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    } = Dimensions.get('window');

    const [categories, setCategories] = React.useState(categoriesList);
    useEffect(() => {
        // console.log("categoriesList", categoriesList);
        setCategories(categoriesList);
    }, [categoriesList]);
    if (!categories) {
        return [...Array.from({ length: 4 }, (_, i) => (
            <View key={i} style={{ paddingHorizontal: 10, marginVertical: 10 }}>
                <ShimmerPlaceholder style={{ marginVertical: 10, height: 20 }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'space-between' }}>
                    {[...Array.from({ length: 6 }, (_, j) => (
                        <View key={j} style={{ width: SCREEN_WIDTH > 768 ? "10%" : "49%", borderRadius: 8 }}>
                            <View style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                <ShimmerPlaceholder style={{ width: '100%', height: 120 }} />
                            </View>
                            <View style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                                <ShimmerPlaceholder style={{ width: '100%', height: 20 }} />
                            </View>
                        </View>
                    ))]}
                </View>
            </View>
        ))];
    }
    return categories && categories.map(categoryGroup => (
        <View key={categoryGroup.categoryGroupId}>
            <Text style={{ marginLeft: 10, marginVertical: 10 }} variant='titleLarge'>{categoryGroup.name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 10, }}>
                {categoryGroup.items.map(category => (
                    <Surface mode='flat' key={`${categoryGroup.categoryGroupId}-${category.categoryId}`} style={{ borderWidth: 1, borderColor: "#e0e0e0", width: SCREEN_WIDTH > 768 ? "10%" : "48%", borderRadius: 8 }}>
                        <Pressable onPress={() => router.push({
                            pathname: '/list/[categoryId]',
                            params: { categoryId: category.categoryId },
                        })}>
                            <View >
                                <Image source={{ uri: category.imageUrl, cache: 'force-cache', resizeMode: 'contain' }} style={{ width: '100%', height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                            </View>
                            <View >
                                <Text style={{ textAlign: 'center', padding: 5, fontWeight: 'bold' }}>{category.name}</Text>
                            </View>
                        </Pressable>
                    </Surface>
                ))}
            </View>
        </View>
    ));
}