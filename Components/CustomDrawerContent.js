import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StorageContext } from '../Context/StorageContext';
import { removeToken } from '../services/AsyncStorageService';
import logout from '../assets/logout.png'
import { AuthContext } from '../Context/AuthContext';
import { updateUser } from '../services/UserService';

const CustomDrawerContent = ({ navigation }) => {
    const { data, dataLoaded, setDataLoaded, setData, getWebsiteData, switchWebsite } = useContext(StorageContext)
    const { setIsLogged, setEmail, user } = useContext(AuthContext)
    const handleLogout = () => {

        const newArray = user?.exponentPushToken.filter((pushToken) => pushToken !== user.currentToken)
        const userToUpdate = { ...user, exponentPushToken: newArray }
        updateUser(user.id, userToUpdate).then(() => {
            removeToken('token')
            removeToken('refreshToken')
            setIsLogged(false)
            setEmail(null)
            setData({})

        })
        navigation.navigate('Login');

    }
    const handlePress = (website) => {
        setDataLoaded(false)
        getWebsiteData(website)
        switchWebsite(website, navigation)
        navigation.navigate('Tab');
    }

    return (
        <>
            {

                (dataLoaded) &&
                <View style={styles.container}>
                    {
                        !data.noWebsite &&
                        <View>
                            {
                                data.websites.map((website) => (
                                    <TouchableOpacity key={website.id} onPress={() => handlePress(website)}>
                                        <View style={styles.elementDrawer}>
                                            <View style={[styles.initialesContainer, website.type === "agent" ? { backgroundColor: "#009AA7" } : { backgroundColor: "#CE031F" }]}>
                                                <Text style={styles.initiales}>{website.initiales}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.elementTitle}>Site de {website.nameDisplay}</Text>
                                                <Text style={styles.elementSubtitle}>{website.subdomain}{website.subdomain && "."}{website.domain}</Text>
                                            </View>
                                        </View>

                                    </TouchableOpacity>

                                ))
                            }
                        </View>
                    }


                    <TouchableOpacity onPress={handleLogout}>
                        <View style={styles.logoutContainer}>
                            <Image source={logout} style={styles.pictoLogout} resizeMode="contain" />
                            <Text style={styles.logoutText}>Se déconnecter</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 70,
        paddingBottom: 50,
        paddingHorizontal: 30,
    },
    elementDrawer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30
    },
    initialesContainer:
    {
        width: 36,
        height: 36,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initiales:
    {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    elementTitle:
    {
        fontWeight: '500'
    },
    elementSubtitle:
    {
        fontSize: 12
    },
    logoutContainer:
    {
        flexDirection: 'row',
        gap: 10
    },
    pictoLogout: {
        width: 25,
        height: 25
    },
    logoutText:
    {
        fontWeight: '500'
    }
});

export default CustomDrawerContent;