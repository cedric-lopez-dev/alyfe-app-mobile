import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = (tokenKey, token) => {
    AsyncStorage.setItem(tokenKey, token);
}

export const getToken = (tokenKey) => {
    return AsyncStorage.getItem(tokenKey);
}

export const removeToken = (tokenKey) => {
    AsyncStorage.removeItem(tokenKey);
}
