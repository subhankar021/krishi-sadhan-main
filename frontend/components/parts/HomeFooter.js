import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function HomeFooter({ appMode = "FARMER", onMenuClicked = () => { } }) {
    const { t } = useTranslation();
    const menuList = {
        FARMER: [
            { icon: "home-outline", code: "home", label: t('home') },
            { icon: "dots-grid", code: "categories", label: t('categories') },
            { icon: "calendar-month-outline", code: "bookings", label: t('booking'), link: "/bookings" },
            { icon: "account-outline", code: "profile", label: t('profile'), link: "/user/profile" }
        ],
        AGGREGATOR: [
            { icon: "home-outline", code: "home", label: t('home') },
            { label: "Equipments", icon: "tractor-variant", code: "equipments",},
            // { icon: "calendar-month-outline", code: "bookings", label: t('booking') },
            { label: "Crop Quotes", icon: "sprout-outline", code: "crop_quotes" },
            { label: "Profile", icon: "account-outline", link: "/user/profile" }
        ]
    }
    const router = useRouter();
    const theme = useTheme();

    const [selectedMenu, setSelectedMenu] = useState(menuList[appMode]?.[0]?.code);
    return (
        <View style={{
            position: "absolute",
            zIndex: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: 60,
            backgroundColor: theme.colors.surface,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around", alignItems: "center",
        }}>
            {menuList[appMode].map((item, index) => (
                <TouchableOpacity
                    onPress={() => {
                        if (item?.link) {
                            router.push(item.link)
                        } else {
                            setSelectedMenu(item.code);
                            onMenuClicked(item.code);
                        }
                    }}
                    key={`footer_item_${index}`}
                >
                    <View style={{ padding: 10, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Icon
                            source={item.icon}
                            color={selectedMenu === item.code ? theme.colors.primary : theme.colors.onSurfaceVariant}
                            size={20}
                        />
                        <Text style={{ fontSize: 12, fontWeight: "bold", color: selectedMenu === item.code ? theme.colors.primary : theme.colors.onSurfaceVariant }}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}