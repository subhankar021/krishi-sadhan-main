import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const axiosHttpInstance = axios.create({
  withCredentials: true,
  validateStatus: function () {
    return true;
  },
  baseURL: "http://139.59.47.180:8081/",
  // baseURL: "http://192.168.1.58:9081/",
});

function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

async function generateAuthToken() {
  try {
    const randomData = generateRandomToken(16);
    const authToken = randomData;
    await SecureStore.setItemAsync("authToken", randomData);
    return authToken;
  } catch (error) {
    console.error("Error generating auth token:", error);
    return null;
  }
}

async function getAuthToken() {
  try {
    let authToken = await SecureStore.getItemAsync("authToken");
    if (authToken) {
      authToken = await generateAuthToken();
    }
    return authToken;
  } catch (error) {
    return null;
  }
}

axiosHttpInstance.interceptors.request.use(
  async function (config) {
    const authToken = await getAuthToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosHttpInstance;
