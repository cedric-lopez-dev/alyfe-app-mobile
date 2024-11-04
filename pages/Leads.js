import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StorageContext } from '../Context/StorageContext';
import CardLead from '../Components/CardLead/CardLead';
import lock from '../assets/lock.png'
import sad from '../assets/sad.png'
import search from '../assets/search.png'


const Leads = ({ navigation }) => {
    const { data, sendGetLeadsProspects } = useContext(StorageContext)
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        sendGetLeadsProspects(data.website.id).then((res) => {
            setIsLoading(false)

        })
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        sendGetLeadsProspects(data.website.id).then((res) => {
            setRefreshing(false);
        })
    }, []);

    const handleLeadCard = (lead) => {
        navigation.navigate('Lead', { lead: lead })
    }
    const handleSearch = (text) => {
        setSearchInput(text.toLowerCase().replace(/\s/g, ''))
    }
    if (isLoading)
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#CE181F" />
            </View>
        )

    return (
        <>

            <View style={styles.container}>
                <View>
                    <Text style={styles.heading}>Prospects</Text>
                    <Text style={styles.subtitle}>Découvrez les prospects que vous avez généré avec votre site</Text>
                </View>
                {

                    data?.leadsProspects.filter((lead) => lead.status !== "fynder").length > 0 &&
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.search}
                            placeholder="Rechercher"
                            onChangeText={(text) => {
                                handleSearch(text);
                            }}
                        />
                        <View style={styles.searchAbsoluteContainer}>
                            <View style={styles.pictoContainer}>
                                <Image source={search} style={styles.picto} resizeMode="contain" />

                            </View>
                            <View style={styles.separator}></View>
                        </View>

                    </View>
                }

            </View>




            {
                data?.website?.market?.leadGen ?
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>

                        {
                            data?.leadsProspects && data?.leadsProspects
                                .sort((lead1, lead2) => {
                                    const date2 = lead2?.createdAt ? new Date(lead2?.createdAt) : 0
                                    const date1 = lead1?.createdAt ? new Date(lead1?.createdAt) : 0

                                    return date2 - date1
                                }
                                )
                                .filter((lead) => lead.status !== "fynder")
                                .length > 0 ? (
                                data.leadsProspects.filter((lead) => {
                                    const phone = lead?.phone ? lead?.phone.toLowerCase().replace(/\s/g, '') : ""
                                    const mail = lead?.email ? lead?.email.toLowerCase().replace(/\s/g, '') : ""
                                    const fullName = lead?.fullname ? lead?.fullname.toLowerCase().replace(/\s/g, '') : ""
                                    const verif = phone.includes(searchInput) || mail.includes(searchInput) || fullName.includes(searchInput)
                                    return (lead.status !== "fynder" && verif)
                                }

                                ).map((lead, i) => (
                                    <TouchableOpacity onPress={() => handleLeadCard(lead)} key={i}>
                                        <CardLead lead={lead} last={i === data.leadsProspects.length - 1} />
                                    </TouchableOpacity>

                                ))
                            ) : (
                                <View style={styles.containerSad}>
                                    <View style={styles.pictoContainerSad}>
                                        <Image source={sad} style={styles.picto} resizeMode="contain" />
                                    </View>
                                    <Text>Vous n'avez pas de leads pour le moment.</Text>
                                </View>
                            )
                        }
                    </ScrollView> :
                    <View style={styles.containerLock}>
                        <View style={styles.pictoContainerLock}><Image source={lock} style={styles.picto} resizeMode="contain" /></View>
                        <Text>Votre Market Center</Text>
                        <Text>ne dispose pas de cette fonctionnalité.</Text>
                    </View>
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
    pictoContainerSad: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    picto: {
        height: '100%',
    },
    containerSad: {
        paddingTop: 30,
        paddingBottom: 30,
        alignItems: "center",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    search: {
        backgroundColor: '#fff',
        height: 40,
        borderRadius: 5,
        paddingLeft: 60
    },
    pictoContainer:
    {
        height: 18,
        width: 18,

    },
    picto: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        position: 'relative'

    },
    separator: {
        width: 1,
        backgroundColor: '#009AA7',
        height: 30
    },
    searchAbsoluteContainer: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: [{ translateY: -15 }, { translateX: 18 }],
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
});


export default Leads;