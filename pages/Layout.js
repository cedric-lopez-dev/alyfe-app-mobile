import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import FlashMessage from "react-native-flash-message";
import { StorageContext } from '../Context/StorageContext';
import { AuthContext } from '../Context/AuthContext';
import { removeToken } from '../services/AsyncStorageService';
import Login from './Login';

const Layout = ({ children }) => {
    const { dataLoaded, setDataLoaded, setData } = useContext(StorageContext)
    const { isLoaded, isLogged, setIsLogged, setEmail } = useContext(AuthContext)

    useEffect(() => {
        if (isLoaded && !isLogged)
            handleLogout()
    }, [isLoaded]);

    const handleLogout = () => {
        removeToken('token')
        removeToken('refreshToken')
        setIsLogged(false)
        setDataLoaded(true)
        setEmail(null)
        setData({})
    }

    if (!isLoaded || !dataLoaded)
        return (
            <View style={styles.container}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#CE181F" />
                </View>
            </View >
        )
    if (isLoaded && !isLogged)

        return (
            <Login />
        )
    return <View style={styles.container}>
        <FlashMessage />
        {children}

    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    },
});

export default Layout;
