import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Animated, TouchableOpacity, Pressable, RefreshControl, Dimensions } from 'react-native';
import { Appbar, Surface, Title, useTheme, Icon, TextInput, IconButton, Text, Button, Portal, Dialog, Modal, Card, ActivityIndicator, RadioButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from "react-i18next";
import { useRouter } from 'expo-router';
import axiosHttpInstance from '../../utils/axiosHttpInstance';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList, selectCategories } from '../../store/slices/category';
import { getLayout, selectlayout } from '../../store/slices/layout';
import CategoryGrid from '../parts/CategoryGrid';
import HomeSearch from '../parts/HomeSearch';
import WeatherUpdates from '../parts/WeatherUpdates';
import MandiRates from '../parts/MandiRates';
import HomeBanner from '../parts/HomeBanner';
import MenuGrid from '../parts/MenuGrid';
import HomeFooter from '../parts/HomeFooter';

const languageNames = [
  {
    name: "English",
    englishName: "English",
    code: "en"
  },
  {
    name: "हिंदी",
    englishName: "Hindi",
    code: "hi"
  }
];


export default function FarmerHome() {

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState("LAYOUT");
  const [refreshing, setRefreshing] = useState(false);

  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const { t, i18n } = useTranslation();

  const [layoutInfo, setLayoutInfo] = useState({
    villageName: null,
    pincode: null
  })

  const searchContainerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const dispatch = useDispatch();

  const layout = useSelector((state) => selectlayout(state));
  const categoriesList = useSelector((state) => selectCategories(state));


  const [villageList, setVillageList] = useState([]);

  const [selectedMenu, setSelectedMenu] = useState("home");

  console.log("layout", layout);

  async function getPincodeInfo(pincode) {
    setLoading("PINCODE");
    try {
      const response = await axiosHttpInstance.post('/api/location/pincode', { pincode });
      if (response.status === 200) {
        setVillageList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(null);
  }

  async function updateLocation() {
    setLoading("VILLAGE");
    try {
      const response = await axiosHttpInstance.put('/api/location/update', layoutInfo);
      if (response.status === 200) {
        setShowLocationPopup(false);
        // await getLayoutInfo();
        dispatch(getLayout());
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(null);
  }

  useEffect(() => {
    if (layout === undefined) {
      dispatch(getLayout());
    }
    if (categoriesList === undefined) {
      dispatch(getCategoriesList());
    }
  }, []);

  useEffect(() => {
    if (layout?.villageName) {
      dispatch(getCategoriesList());
    }
    setShowLocationPopup(!layout?.villageName);
  }, [layout?.villageName]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, position: 'relative', }}>
        <View style={{ backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingHorizontal: 10, paddingBottom: 10 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setShowLocationPopup(true);
              }}
              style={{ visibility: layout?.villageName ? "visible" : "hidden", display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon
                source="map-marker-outline"
                color={layout?.villageName ? theme.colors.onPrimary : "transparent"}
                size={20}
              />
              <Text style={{ color: theme.colors.onPrimary }}>{layout?.villageName}</Text>
              <Icon
                source="chevron-down"
                color={layout?.villageName ? theme.colors.onPrimary : "transparent"}
                size={20}
              />
            </TouchableOpacity>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 15, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setOpenPopup(true)
                }}
              >
                <Icon
                  source="web"
                  color={theme.colors.onPrimary}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
            setRefreshing(true);
            dispatch(getCategoriesList());
            setRefreshing(false);
          }} />}
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentInsetAdjustmentBehavior="automatic"
          key={"scroll_container"}
          contentContainerStyle={styles.scrollViewContent}
        >
          {selectedMenu === "home" && (
            <>
              <HomeSearch />
              <View style={{ height: 10 }} />
              <HomeBanner
                bannerList={[
                  { imageUrl: "https://www.jurist.org/features/wp-content/uploads/sites/8/2021/05/India-farm.jpeg", text: "Welcome to\nKrishi Sadhan" },
                  { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1PvPrmPBeARqUBwuAH9zeKlBeYRjhqGcBQA&s", text: "Farming with\nEco Sustainability" },
                ]}
              />
              <MenuGrid />
              <View style={{ height: 10 }} />
              <WeatherUpdates />
              <MandiRates />
              <View style={{ height: 50 }} />
            </>
          )}

          {selectedMenu === "categories" && (
            <CategoryGrid categoriesList={categoriesList} />
          )}
        </ScrollView>
        <HomeFooter appMode="FARMER" onMenuClicked={setSelectedMenu} />
      </SafeAreaView>
      <Portal>
        <Modal
          animationType="slide" // Use slide animation
          transparent={true}
          onDismiss={() => setOpenPopup(false)}
          visible={openPopup}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.popupContent}>
            <View style={{ display: 'flex', alignItems: 'left', justifyContent: 'space-between', width: '100%', marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{t('selectLanguage')}</Text>
              <Text style={{ fontSize: 15, marginBottom: 10, marginTop: 10, color: '#000' }}>{t('chooseLanguage')}</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 80 }}>
                {languageNames.map((language, index) => (
                  <View key={index} style={{ width: '50%', padding: 5 }}>
                    <Card onPress={() => {
                      i18n.changeLanguage(language.code)
                      setOpenPopup(false)
                    }}>
                      <Card.Content >
                        <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', height: 40 }}>{language?.name}</Text>
                        <Text style={{ textAlign: 'center', color: '#000' }}>{language?.englishName}</Text>
                      </Card.Content>
                    </Card>
                  </View>
                ))}
              </View>
            </ScrollView>

          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          dismissableBackButton={layoutInfo?.villageName ? true : false}
          dismissable={layoutInfo?.villageName ? true : false}
          onDismiss={() => setShowLocationPopup(false)}
          visible={showLocationPopup}
          contentContainerStyle={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', backgroundColor: theme.colors.background, margin: 10, padding: 15, borderRadius: 5 }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}>Select your location</Text>
            <IconButton size={20} icon="close" onPress={() => setShowLocationPopup(false)} />
          </View>

          <Text style={{ color: '#444', fontSize: 11, marginBottom: 10 }}>
            {"Upon entering a valid postal code and clicking 'submit', you will be prompted to select your village."}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 5 }}>
            <TextInput
              placeholder='Enter Pincode'
              inputMode='numeric' value={layoutInfo?.pincode} maxLength={6} style={{ flexGrow: 3 }} dense={true} mode="outlined"
              // label="Postal / PIN / Zip Code" 
              autoComplete='postal-code' onChangeText={(text) => setLayoutInfo((prev) => ({ ...prev, pincode: text }))} />
            <Button
              loading={loading === "PINCODE"}
              onPress={() => getPincodeInfo(layoutInfo?.pincode)}
              disabled={layoutInfo?.pincode?.length !== 6} mode="contained" style={{ flexGrow: 1, borderRadius: 5 }}>SUBMIT</Button>
          </View>
          <ScrollView>
            <RadioButton.Group

              value={layoutInfo?.villageId}
              onValueChange={(value) => setLayoutInfo((prev) => ({ ...prev, villageId: value }))}
            >
              {villageList?.map((village, index) => (
                <RadioButton.Item key={village.villageId} mode='ios' position='trailing' label={village?.villageName} value={village.villageId} />
              ))}
            </RadioButton.Group>
          </ScrollView>
          <Button
            disabled={!layoutInfo?.villageId}
            loading={loading === "VILLAGE"}
            onPress={() => {
              updateLocation();
            }} mode="contained" style={{ marginTop: 10, borderRadius: 5 }}>CONTINUE</Button>
        </Modal>
      </Portal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-evenly',
    margin: 8,
    gap: 8
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    height: '100%',
    margin: 0,
  },


  popupContent: {
    backgroundColor: 'white',
    height: '75%',
    padding: 16,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
    margin: 0,
  },


  surface: {
    width: "48%", // Adjust the width as needed to fit 3 surfaces per row
    marginBottom: 8,
    borderRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  textContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    // height: 45,
  },
  contentContainer: {
    padding: 8,
    alignItems: 'center'
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  madeWithLove: {
    textAlign: 'center',
    marginVertical: 20,
    paddingBottom: 20,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16
  },
  groupTitle: {
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
