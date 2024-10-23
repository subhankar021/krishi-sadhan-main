// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, StyleSheet, View } from 'react-native';
// import { Avatar, Text, useTheme } from 'react-native-paper';

// import { getFromDeviceStorage, storeInDevice } from '../../utils/appStorage';
// import axiosHttpInstance from '../../utils/axiosHttpInstance';

// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     isErrorWithCode,
//     isNoSavedCredentialFoundResponse,
//     isSuccessResponse,
//     statusCodes,
// } from '@react-native-google-signin/google-signin';
// GoogleSignin.configure({
//     webClientId: "1097159201701-squ4ennok8g67r4e04npbd2p5luolvq9.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
//     scopes: ['https://www.googleapis.com/auth/userinfo.email', 
//     'https://www.googleapis.com/auth/userinfo.profile',
//     ], // what API you want to access on behalf of the user, default is email and profile
//     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//     hostedDomain: '', // specifies a hosted domain restriction
//     forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//     // accountName: '', // [Android] specifies an account name on the device that should be used
//     // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//     // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
//     // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//     // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const theme = useTheme();
//     const router = useRouter();
//     const [modelData, setModelData] = useState({
//         phoneNumber: '',
//         acknowledged: false,
//         appMode: 'FARMER'
//     })
//     async function getAppMode() {
//         try {
//             let appMode = await getFromDeviceStorage("APP_MODE");
//             if (!appMode) {
//                 appMode = "FARMER";
//             }
//             setModelData({ ...modelData, appMode });

//         } catch (error) {
//             console.error(error);
//         }
//     }

//     async function onGoogleButtonPress() {
//         try {
//             await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//             // remove existing saved credentials
//             // await GoogleSignin.revokeAccess();
//             // await GoogleSignin.signOut();
//             const response = await GoogleSignin.signIn();
//             console.log('response', response);
//             if (isSuccessResponse(response)) {
//                 //   setState({ userInfo: response.data });
//             } else if (isNoSavedCredentialFoundResponse(response)) {
//                 // user has not signed in yet
//             } else {
//                 // sign in was cancelled by user
//             }
//         } catch (error) {
//             console.error(error);
//             if (isErrorWithCode(error)) {
//                 switch (error.code) {
//                     case statusCodes.IN_PROGRESS:
//                         // operation (eg. sign in) already in progress
//                         break;
//                     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//                         // Android only, play services not available or outdated
//                         break;
//                     default:
//                     // some other error happened
//                 }
//             } else {
//                 // an error that's not related to google sign in occurred
//             }
//         }
//     }

//     useEffect(() => {
//         getAppMode();
//     }, []);

//     return (
//         <SafeAreaView style={{ flex: 1, position: 'relative' }}>
//             <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//                 <Avatar.Image size={100} source={require('../../assets/kishan_bhai.png')} />
//                 <Text style={{ fontFamily: 'Inter_900Black', fontSize: 30, }}>Krishi Sadhan</Text>
//                 <Text style={{ fontSize: 15, marginBottom: 60 }}>Kisaan upkaran ka ek Matra Sadhan</Text>
//                 <Text style={{ fontSize: 15, marginBottom: 30 }}>Login with your Google account</Text>
//                 <GoogleSigninButton
//                     style={{ width: 200, height: 48, marginBottom: 30 }}
//                     size={GoogleSigninButton.Size.Wide}
//                     color={GoogleSigninButton.Color.Light}
//                     onPress={onGoogleButtonPress}

//                 // disabled={loading}
//                 />
//                 <Text style={{ textAlign: 'center' }}>
//                     By continuing, you agree to our
//                     <Text style={{ color: theme.colors.primary }}> Terms of Service </Text>
//                     and
//                     <Text style={{ color: theme.colors.primary }}> Privacy Policy</Text>
//                 </Text>
//             </View>
//         </SafeAreaView>
//     );
// };


// export default Login;
