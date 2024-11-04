import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Eye from '../assets/eyeHeader.png'
import { AuthContext } from '../Context/AuthContext';
import { StorageContext } from '../Context/StorageContext';
import arrowBack from '../assets/arrow-back.png'



const CustomHeader = ({ navigation, backTitle }) => {
    const { data, dataLoaded } = useContext(StorageContext)

    const openMenu = () => {
        navigation.openDrawer();
    }

    const handleBack = () => {

        navigation.goBack()
    }
    const handleImagePress = () => {
        const url = `https://${data?.website?.subdomain}.${data?.website.domain}`;
        Linking.openURL(url);
    };



    return (
        <>

            {
                (dataLoaded && !data.noWebsite) &&
                <View style={styles.header}>

                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={openMenu}>
                            <View style={[styles.initialesContainer, data.website.type === "agent" ? { backgroundColor: "#009AA7" } : { backgroundColor: "#CE031F" }]}>
                                <Text style={styles.initiales}>{data.website.initiales}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.title}>Site de {data.website.nameDisplay}</Text>
                        <TouchableOpacity onPress={handleImagePress}>
                            <View style={styles.pictoContainer}><Image source={Eye} style={styles.picto} resizeMode="contain" /></View>
                        </TouchableOpacity>
                    </View>
                    {backTitle &&

                        <TouchableOpacity onPress={handleBack}>
                            <View style={styles.backContainer}>
                                <View style={styles.pictoContainer}>
                                    <Image source={arrowBack} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.back}>{backTitle}</Text>
                            </View>
                        </TouchableOpacity>

                    }

                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: '#FFFFFF',
    },

    headerTop: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        height: 100,
        paddingBottom: 15,
    },
    initialesContainer:
    {
        backgroundColor: '#009AA7',
        width: 28,
        height: 28,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    initiales:
    {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    title: {
        color: '#333333',
        fontWeight: '500',
        fontSize: 14,
    },
    pictoContainer:
    {
        height: 18,
        width: 18
    },
    picto: {
        width: '100%',
        height: '100%',
    },
    backContainer:
    {
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    back: {
        fontWeight: '600',
        fontSize: 14,
        color: '#009AA7',
        paddingVertical: 10
    }

});

export default CustomHeader;
