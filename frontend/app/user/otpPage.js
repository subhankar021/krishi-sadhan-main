import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme, Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import axiosHttpInstance from '../../utils/axiosHttpInstance';
import { getFromDeviceStorage, removeFromDeviceStorage } from '../../utils/appStorage';


const OtpPage = () => {
    const router = useRouter();
    const theme = useTheme();
    const { primary } = theme.colors;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const inputsRef = useRef([]);
    const [isErrorFound, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginTop: 60,
        },
        avatarImage: {
            backgroundColor: 'transparent',
        },
        continueButton: {
            borderRadius: 10,
            padding: 15,
            elevation: 2,
            width: '100%',
            backgroundColor: 'white'
        },
        continueButtonText: {
            color: theme.colors.onPrimary,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 16,
            textTransform: 'uppercase',
            backgroundColor: theme.colors.primary
        },
        continueButton: {
            borderRadius: 10,
            padding: 15,
            elevation: 2,
            width: '100%'
        },
        krishiText: {
            fontFamily: 'Inter_900Black',
            fontSize: 30,
            color: primary,
            marginBottom: 10,
        },
        descriptionText: {
            fontSize: 15,
            color: primary,
        },
        cloudContainer: {
            backgroundColor: primary,
            height: '60%',
            marginTop: 50,
            borderTopLeftRadius: 150,
            borderTopRightRadius: 1,
            overflow: 'hidden',
            position: 'relative',
        },
        otpContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
        },
        otpInput: {
            backgroundColor: 'white',
            margin: 5,
            width: 40,
            borderColor: isErrorFound ? 'red' : '#e0e0e0',
            height: 40,
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: 'Inter_900Black'
        },
    });

    useEffect(() => {
        if (currentIndex < 0) return;
        if (currentIndex >= inputsRef.current.length) return;
        inputsRef.current[currentIndex].focus();
    }, [currentIndex]);

    useEffect(() => {
        if (isErrorFound) {
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
            ]).start();
        }
    }, [isErrorFound]);



    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value !== '') {
                setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, otp.length - 1));
            } else {
                setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            }
            setError(false);
        }
    };
    async function sendOtp(otp) {
        try {
            const res = await axiosHttpInstance.post('/api/user/otp', { otp: otp });
            if (res?.status === 200) {
                router.dismissAll();
                const LOGIN_REDIRECT = await getFromDeviceStorage('LOGIN_REDIRECT');
                await removeFromDeviceStorage('LOGIN_REDIRECT');
                if (res?.data?.redirectUrl){
                    router.push(`${res?.data?.redirectUrl}`);
                } else if (LOGIN_REDIRECT) {
                    router.push(`${LOGIN_REDIRECT}`);
                } else {
                    router.push('/');
                }
            }
            else {
                setError(true);
                setErrorMessage(res?.data?.error || 'Invalid OTP');

            }

        } catch (err) {
            // console.log(err);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Avatar.Image
                    size={80}
                    source={require('../../assets/kishan_bhai.png')}
                    style={styles.avatarImage}
                />
                <Text style={styles.krishiText}>Krishi Sadhan</Text>
                <Text style={styles.descriptionText}>Kisaan upkaran ka ek Matra Sadhan</Text>
            </View>
            <View style={styles.cloudContainer}>
                <View style={{ marginTop: 40 }}>
                    <Text style={{ padding: 10, marginTop: 20, textAlign: 'center', fontFamily: 'Inter_900Black', fontSize: 24, color: 'white' }}>VERIFY OTP</Text>
                    <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 15, color: 'white' }}>Enter OTP sent to your mobile number</Text>
                    <View style={styles.otpContainer}>
                        {otp.map((value, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.otpInputContainer,
                                    {
                                        transform: [
                                            { translateX: shakeAnimation }
                                        ]
                                    }
                                ]}
                            >
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputsRef.current[index] = ref)}
                                    style={styles.otpInput}

                                    onChangeText={(text) => handleOtpChange(index, text)}
                                    value={value}
                                    maxLength={1}
                                    keyboardType="numeric"
                                />
                            </Animated.View>
                        ))}
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 20, borderRadius: 50, padding: 10, elevation: 2, width: '90%', backgroundColor: 'white' }}>
                        <Pressable disabled={true} style={{ elevation: 2, width: '100%' }} onPress={() => { }}>
                            <Text style={{ textAlign: 'center', fontFamily: 'Inter_900Black', fontSize: 16 }}>Resend OTP</Text>
                        </Pressable>
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 20, borderRadius: 50, padding: 10, elevation: 2, width: '90%', backgroundColor: 'white', marginBottom: 20 }}>
                        <Pressable onPressIn={() => {
                            sendOtp(otp);
                        }} style={{ elevation: 2, width: '100%' }} onPress={() => { }}>
                            <Text style={{ textAlign: 'center', fontFamily: 'Inter_900Black', fontSize: 16 }}>Verify OTP</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
};

export default OtpPage;
