import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeInDevice(key, value) { 
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        // saving error
    }
}

export async function getFromDeviceStorage(key) {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        // error reading value
    }

    return null
}

export async function removeFromDeviceStorage(key) {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        // error reading value
    }
}