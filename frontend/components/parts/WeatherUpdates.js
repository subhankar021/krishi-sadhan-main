import { Image, ScrollView, View } from "react-native";
import dayjs from "dayjs";
import { Text } from "react-native-paper";
export default function WeatherUpdates() {

    const cityNames = ["Bahadurpur", "Raebareli", "Mubarakpur", "Lucknow"];

    const weatherInfo = cityNames.map((city) => {
        const dayStatuses = ["Sunny", "Rainy", "Cloudy", "Windy"];
        const nightStatuses = ["Snowy", "Cloudy", "Foggy", "Windy"];

        const now = dayjs();
        const currentHour = now.hour();
        const isDay = currentHour >= 6 && currentHour < 18;

        // Define temperature ranges and baselines with random offsets
        const baseTemperatureDay = 20 + Math.random() * 12;  // Baseline for daytime temperatures (20-30)
        const baseTemperatureNight = 22 + Math.random() * 12; // Baseline for nighttime temperatures (22-32)
        const maxTemperatureDay = baseTemperatureDay + 12;   // Max daytime temperature
        const minTemperatureNight = baseTemperatureNight - 2; // Min nighttime temperature

        // Temperature changes naturally through the day
        const temperature = isDay
            ? baseTemperatureDay + (currentHour - 6) * (maxTemperatureDay - baseTemperatureDay) / 12
            : baseTemperatureNight + (18 - currentHour) * (baseTemperatureNight - minTemperatureNight) / 6;

        const statusText = isDay
            ? dayStatuses[Math.floor(temperature) % dayStatuses.length]
            : nightStatuses[Math.floor(temperature) % nightStatuses.length];

        const hourlyForecast = Array.from({ length: 5 }, (_, i) => {
            const forecastHour = now.add(i, "hour").hour();
            const isForecastDay = forecastHour >= 6 && forecastHour < 18;
            const forecastTemperature = isForecastDay
                ? baseTemperatureDay + (forecastHour - 6) * (maxTemperatureDay - baseTemperatureDay) / 12
                : baseTemperatureNight + (18 - forecastHour) * (baseTemperatureNight - minTemperatureNight) / 6;
            const forecastStatusText = isForecastDay
                ? dayStatuses[Math.floor(forecastTemperature) % dayStatuses.length]
                : nightStatuses[Math.floor(forecastTemperature) % nightStatuses.length];

            return {
                displayHour: i === 0 ? "Now" : now.add(i, "hour").format("h A"),
                temperature: Math.floor(forecastTemperature),
                statusText: forecastStatusText
            };
        });

        return {
            city: city,
            temperature: Math.floor(temperature),
            statusText,
            hourlyForecast
        };
    });



    return (
        <View>
            <View style={{ paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Weather Updates</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>Real-time weather updates near your location</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    // paddingHorizontal: 10,
                    // backgroundColor: "#fff",
                    paddingTop: 10,
                    // paddingBottom: 20,
                    // borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
                }}
                contentContainerStyle={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    paddingHorizontal: 10
                }}
            >
                {weatherInfo.map((weather, index) => (
                    <View
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                            position: "relative",
                        }}
                    >
                        <View
                            style={{ zIndex: 5, position: "absolute", top: 0, left: 0, paddingHorizontal: 20, paddingVertical: 10, right: 0, left: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "space-between", gap: 20 }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 10
                                }}
                            >

                                <View>
                                    <Text
                                        style={{
                                            fontFamily: "Inter_800ExtraBold",
                                            fontSize: 20,
                                            color: "#fff"
                                        }}
                                    >
                                        {weather.city}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: "Inter_900Black",
                                            fontSize: 30,
                                            color: "#fff"
                                        }}
                                    >
                                        {weather.temperature} °C
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 3
                                    }}
                                >
                                    <WeatherIcon statusText={weather.statusText} width={40} height={40} />
                                    <Text
                                        style={{
                                            // fontFamily: "Inter_900Black",
                                            fontSize: 14,
                                            color: "#fff"
                                        }}
                                    >
                                        {weather.statusText}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                                {weather.hourlyForecast.map((hour, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 1,
                                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                                            borderRadius: 8,
                                            paddingHorizontal: 8,
                                            paddingVertical: 5
                                        }}
                                    >
                                        <Text
                                            style={{
                                                // fontFamily: "Inter_900Black",
                                                fontSize: 13,
                                                color: "#fff"
                                            }}
                                        >
                                            {hour.displayHour}
                                        </Text>
                                        <WeatherIcon statusText={hour.statusText} width={25} height={25} />
                                        <Text
                                            style={{
                                                // fontFamily: "Inter_900Black",
                                                fontSize: 14,
                                                color: "#fff",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {hour.temperature} °C
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <Image
                            source={require("../../assets/weather/weather_background.png")}
                            style={{ borderRadius: 10, width: 300, height: 180 }}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}


function WeatherIcon({ statusText, width, height }) {
    return (<>
        {statusText === "Sunny" && <Image
            source={require(`../../assets/weather/sunny.png`)}
            style={{ width, height }}
        />}

        {statusText === "Cloudy" && <Image
            source={require(`../../assets/weather/cloudy.png`)}
            style={{ width, height }}
        />}

        {statusText === "Rainy" && <Image
            source={require(`../../assets/weather/rainy.png`)}
            style={{ width, height }}
        />}

        {statusText === "Snowy" && <Image
            source={require(`../../assets/weather/snowy.png`)}
            style={{ width, height }}
        />}
        {statusText === "Foggy" && <Image
            source={require(`../../assets/weather/foggy.png`)}
            style={{ width, height }}
        />}

        {statusText === "Windy" && <Image
            source={require(`../../assets/weather/windy.png`)}
            style={{ width, height }}
        />}
    </>)
}