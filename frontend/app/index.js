import { useEffect, useState } from "react";
import AggregatorHome from "../components/aggregator/Home";
import FarmerHome from "../components/farmer/Home";
import { getFromDeviceStorage } from "../utils/appStorage";
import { Image, View } from "react-native";

export default function App() {
  const [appMode, setAppMode] = useState(null);
  async function getAppMode() {
    try {
      let appMode = await getFromDeviceStorage("APP_MODE");
      if (!appMode) {
        appMode = "FARMER";
      }
      setAppMode(appMode);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAppMode();
  }, []);

  if (appMode === "FARMER") {
    return <FarmerHome />;
  } else if (appMode === "AGGREGATOR") {
    return <AggregatorHome />;
  } else {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={require("../assets/kishan_bhai.png")} style={{ width: 100, height: 100 }} />
    </View>;
  }
}