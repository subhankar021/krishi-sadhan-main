import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Pressable, View } from 'react-native';
import { Button, HelperText, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

import axiosHttpInstance from '../../utils/axiosHttpInstance';
import { getFromDeviceStorage, storeInDevice } from '../../utils/appStorage';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const router = useRouter();
    const [modelData, setModelData] = useState({
        phoneNumber: '',
        acknowledged: false,
        appMode: 'FARMER'
    })
    const [errorMessage, setErrorMessage] = useState('')

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.primary
        },
        titleText: {
            color: theme.colors.onPrimary,
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 30,
        },
        loginButton: {
            borderRadius: 25,
            padding: 15,
            elevation: 2,
            width: '70%',
        },
        continueButton: {
            borderRadius: 10,
            padding: 15,
            elevation: 2,
            width: '100%'
        },
        loginButtonText: {

            fontWeight: 'bold',
            textAlign: 'center',
        },
        continueButtonText: {
            color: theme.colors.onPrimary,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 16,
            textTransform: 'uppercase'
        },
        modalView: {
            position: 'absolute',
            bottom: 0,
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 25,
            alignItems: 'left',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '100%',
        },
    });
    // functions for api calls
    async function sendOtp(modelData) {
        setLoading(true);
        try {
            const res = await axiosHttpInstance.post('/api/user/login', modelData);
            if (res?.status === 200) {
                // setModalVisible(false);
                setErrorMessage('');
                router.push('/user/otpPage');
                return
            }
            else {
                setErrorMessage(res?.data?.message);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }
    async function getAppMode() {
        try {
            let appMode = await getFromDeviceStorage("APP_MODE");
            if (!appMode) {
                appMode = "FARMER";
            }
            setModelData({ ...modelData, appMode });
            
        } catch (error) {
            console.error(error);
        }
    }

    async function setAppMode(appMode) {
        try {
            await storeInDevice("APP_MODE", appMode);
            setModelData({ ...modelData, appMode });
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getAppMode();
    }, []);

    return (
        <SafeAreaView style={{ flex: 0.80, position: 'relative' }}>
            <View style={styles.container}>
                <Avatar.Image size={100} source={require('../../assets/kishan_bhai.png')} />
                <Text style={{ fontFamily: 'Inter_900Black', fontSize: 30, color: theme.colors.onPrimary }}>Krishi Sadhan</Text>
                <Text style={{ fontSize: 15, marginBottom: 90, color: theme.colors.onPrimary }}>Kisaan upkaran ka ek Matra Sadhan</Text>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {
                        router.push('/')
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Get Started With Krishi Sadhan</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 15, marginBottom: 10 }}>Enter phone number</Text>
                        </View>
                        <TextInput
                            style={{ width: '100%' }}
                            theme={{ roundness: 10 }}
                            keyboardType="phone-pad"
                            mode='outlined'
                            value={modelData.phoneNumber}
                            autoComplete='tel'
                            onChangeText={(value) => {
                                const cleanedValue = value
                                const formattedValue = cleanedValue
                                // console.log(formattedValue)
                                if (formattedValue.length <= 11) {
                                    setModelData({ ...modelData, phoneNumber: formattedValue });
                                    setErrorMessage('')
                                }
                                else {
                                    setErrorMessage('Phone number should be of 10 digits')
                                }
                            }}
                            left={<TextInput.Icon icon="phone" />}
                            dense={true}
                        />
                        {errorMessage && (<HelperText type="error" visible={errorMessage}>
                            {errorMessage}
                        </HelperText>)}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-start', marginVertical: 10 }}>
                            <Checkbox
                                status={modelData.acknowledged ? 'checked' : 'unchecked'}
                                onPress={() => setModelData({ ...modelData, acknowledged: !modelData.acknowledged })}
                            />
                            <Text style={{ fontSize: 15 }}>I accept the terms and conditions </Text>
                        </View>
                        <Button
                            mode='contained'
                            loading={loading}s
                            disabled={!modelData.acknowledged || modelData.phoneNumber.length < 10}
                            onPress={() => {
                                sendOtp(modelData);
                            }}>
                            CONTINUE
                        </Button>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};


export default Login;
