import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import recoB from '../assets/reco-b.png'
import boostB from '../assets/boost-b.png'
import { StorageContext } from '../Context/StorageContext';
import lock from '../assets/lock.png'
import { useCallback } from 'react';
import CardLead from '../Components/CardLead/CardLead';



const Growth = ({ navigation }) => {

    const { data, sendGetLeads } = useContext(StorageContext)
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        sendGetLeads(data.agent.id)
    }, []);

    const handleReco = () => {
        data?.website?.market?.leadGen &&
            navigation.navigate('Recommandation')
    }

    const handleBoost = async () => {

        if (data?.website?.market?.leadGen)
            try {
                const result = await Share.share({
                    message:
                        `https://${data?.website?.subdomain}.${data?.website.domain}/form-quiz`,
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error) {
                Alert.alert(error.message);
            }
    };


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        sendGetLeads(data.agent.id).then((res) => {
            setRefreshing(false);
        })
    }, []);

    return (
        <>

            {

                <>
                    <View style={styles.container}>
                        <Text style={styles.heading}>Growth Share</Text>
                        <Text style={styles.subtitle}>Découvrez les prospects que vous avez généré pour votre Growth Share.</Text>
                        <View style={[styles.buttonContainer, (!data?.website?.market?.leadGen) && styles.buttonNoLeadgen]}>
                            <TouchableOpacity style={styles.button} onPress={handleReco}>

                                <View style={styles.pictoContainer}>
                                    <Image source={recoB} style={styles.picto} resizeMode="contain" />
                                </View>

                                <Text style={styles.buttonText}>Recommander</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleBoost}>
                                <View style={styles.pictoContainer}>
                                    <Image source={boostB} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.buttonText}>Booster</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        data?.website?.market?.leadGen ?
                            <ScrollView
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }>

                                {
                                    data?.leads && data?.leads
                                        .sort((lead1, lead2) => new Date(lead2.createdAt) - new Date(lead1.createdAt))
                                        .map((lead, i) => (
                                            <CardLead key={lead.id} lead={lead} last={i === data.leads.length - 1} />
                                        ))
                                }
                            </ScrollView> :
                            <View style={styles.containerLock}>
                                <View style={styles.pictoContainerLock}><Image source={lock} style={styles.picto} resizeMode="contain" /></View>

                                <Text>Votre Market Center</Text>
                                <Text>ne dispose pas de cette fonctionnalité.</Text>
                            </View>
                    }

                </>
            }

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingVertical: 30,
        justifyContent: "space-between",
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 20,
        fontWeight: '400',
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
    buttonContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    },
    button:
    {
        backgroundColor: '#009AA7',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,

    },
    buttonText: {
        padding: 10,
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    buttonNoLeadgen:
    {
        opacity: 0.4
    },
    pictoContainerLock: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picto: {
        height: '100%',
        width: '100%',
    },
    containerLock: {
        paddingVertical: 30,
        alignItems: "center"
    },
})

export default Growth;
