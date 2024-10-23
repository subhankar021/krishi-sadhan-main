import { Slot } from "expo-router";
import { Provider } from 'react-redux';
import "./../translation";

import {
    PaperProvider,
    MD3LightTheme,
    MD3DarkTheme,
    configureFonts,
    useTheme
} from 'react-native-paper';

import {
    useFonts,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
} from '@expo-google-fonts/inter';
import { StatusBar, View } from "react-native";
import { Appearance, useColorScheme } from 'react-native';
import { store } from "../store/store";


const fontConfig = {
    default: {
        fontFamily: 'Inter_400Regular',
    },
    titleLarge: {
        fontFamily: 'Inter_700Bold',
    },
    titleMedium: {
        fontFamily: 'Inter_600SemiBold',
    },
    titleSmall: {
        fontFamily: 'Inter_600SemiBold',
    },
}
// fontConfig.ios = fontConfig.default;
// fontConfig.android = fontConfig.default;
// fontConfig.web = fontConfig.default;
const lightTheme = {
    ...MD3LightTheme,
    dark: false,
    fonts: configureFonts({ config: fontConfig }),

    colors: {
        primary: "#059142",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(135, 251, 158)",
        onPrimaryContainer: "rgb(0, 33, 10)",
        secondary: "rgb(120, 89, 0)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(255, 223, 158)",
        onSecondaryContainer: "rgb(38, 26, 0)",
        tertiary: "rgb(0, 88, 202)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(217, 226, 255)",
        onTertiaryContainer: "rgb(0, 25, 69)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "#fafafa",
        onBackground: "rgb(26, 28, 25)",
        surface: "rgb(252, 253, 247)",
        onSurface: "rgb(26, 28, 25)",
        surfaceVariant: "rgb(221, 229, 218)",
        onSurfaceVariant: "rgb(65, 73, 65)",
        outline: "rgb(114, 121, 112)",
        outlineVariant: "rgb(193, 201, 190)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(46, 49, 46)",
        inverseOnSurface: "rgb(240, 241, 236)",
        inversePrimary: "rgb(106, 221, 132)",
        elevation: {
            level0: "transparent",
            level1: "rgb(239, 246, 237)",
            level2: "rgb(232, 242, 231)",
            level3: "rgb(224, 237, 225)",
            level4: "rgb(222, 236, 223)",
            level5: "rgb(217, 233, 219)"
        },
        surfaceDisabled: "rgba(26, 28, 25, 0.12)",
        onSurfaceDisabled: "rgba(26, 28, 25, 0.38)",
        backdrop: "rgba(43, 50, 43, 0.4)"
    }

};

const darkTheme = {
    ...MD3DarkTheme,
    dark: true,
    fonts: configureFonts(fontConfig),
    colors: {
        primary: "rgb(106, 221, 132)",
        onPrimary: "rgb(0, 57, 21)",
        primaryContainer: "rgb(0, 83, 34)",
        onPrimaryContainer: "rgb(135, 251, 158)",
        secondary: "rgb(250, 189, 0)",
        onSecondary: "rgb(63, 46, 0)",
        secondaryContainer: "rgb(91, 67, 0)",
        onSecondaryContainer: "rgb(255, 223, 158)",
        tertiary: "rgb(176, 198, 255)",
        onTertiary: "rgb(0, 45, 110)",
        tertiaryContainer: "rgb(0, 66, 155)",
        onTertiaryContainer: "rgb(217, 226, 255)",
        error: "rgb(255, 180, 171)",
        onError: "rgb(105, 0, 5)",
        errorContainer: "rgb(147, 0, 10)",
        onErrorContainer: "rgb(255, 180, 171)",
        background: "rgb(26, 28, 25)",
        onBackground: "rgb(226, 227, 221)",
        surface: "rgb(26, 28, 25)",
        onSurface: "rgb(226, 227, 221)",
        surfaceVariant: "rgb(65, 73, 65)",
        onSurfaceVariant: "rgb(193, 201, 190)",
        outline: "rgb(139, 147, 137)",
        outlineVariant: "rgb(65, 73, 65)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(226, 227, 221)",
        inverseOnSurface: "rgb(46, 49, 46)",
        inversePrimary: "rgb(0, 109, 48)",
        elevation: {
            level0: "transparent",
            level1: "rgb(30, 38, 30)",
            level2: "rgb(32, 43, 34)",
            level3: "rgb(35, 49, 37)",
            level4: "rgb(36, 51, 38)",
            level5: "rgb(37, 55, 40)"
        },
        surfaceDisabled: "rgba(226, 227, 221, 0.12)",
        onSurfaceDisabled: "rgba(226, 227, 221, 0.38)",
        backdrop: "rgba(43, 50, 43, 0.4)"
    }
}


export default function RootLayout() {
    const colorScheme = useColorScheme();
    let [fontsLoaded] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    if (!fontsLoaded) {
        return null;
    }

    const theme = lightTheme;

    return (
        <PaperProvider theme={colorScheme === 'light' ? lightTheme : lightTheme}>
            <StatusBar
                animated={true}
                translucent={false}
                backgroundColor={theme.colors.primary}
                //   barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
                showHideTransition={"slide"}
            // hidden={true}
            />
            <Provider store={store}>
                <Slot />
            </Provider>
        </PaperProvider>
    );
}