import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

export default function HomeSearch() {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    return (
        <View
            key={"search_container"}
            style={[
              {
                paddingHorizontal: 10,
                backgroundColor: theme.colors.primary,
                paddingTop: 10,
                paddingBottom: 20,
                // transform: [{ translateY: searchContainerTranslateY }],
                borderBottomLeftRadius: 15, borderBottomRightRadius: 15
              },
            ]}
          >
            <Text style={{ paddingLeft: 5, textAlign: "center", fontFamily: "Inter_900Black", fontSize: 30, marginBottom: 0, color: theme.colors.onPrimary }}>
              {t('appTitle')}
            </Text>
            <Text style={{ paddingLeft: 5, textAlign: "center", color: theme.colors.onPrimary, marginBottom: 10 }}>{t('appSubtitle')}</Text>
            <TextInput
              placeholder={"Seeds, farm equipments and more..."}
              left={<TextInput.Icon icon="magnify" />}
              mode="outlined"
              cursorColor={theme.colors.primary}
              dense={true}
              disabled={true}
              style={{ backgroundColor: theme.colors.surface, height: 40, fontSize: 15, lineHeight: 15 }}
              theme={{ roundness: 20 }}
            />
          </View>
    );
}