import React, { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardPerf from '../Components/CardPerf';
import { StorageContext } from '../Context/StorageContext';
import sad from '../assets/sad.png'
import { FlatList } from 'react-native-gesture-handler';
import CardStats from '../Components/CardStats';
import house from '../assets/house.png'
import eye from '../assets/eye.png'
import userPicto from '../assets/user.png'
import send from '../assets/send.png'


const Performances = () => {



    const { data, sendGetPropertiesStats, sendGetProspects, sendGetMessages, sendGetViews, sendGetChatMessages } = useContext(StorageContext)
    const [refreshing, setRefreshing] = useState(false);

    const handleCardPress = (property) => {
        const url = `https://${data?.website?.subdomain}.${data?.website.domain}/annonces/${stringToValidURL(property.title)}/${property.id}`;
        Linking.openURL(url);
    };
    const stringToValidURL = (inputString) => {
        const accentChars = ['À-Ö', 'Ø-ö', 'ø-ÿ']; // Character ranges for accented letters
        const specialChars = ['!', '*', "'", "(", ")", ",", ";", ":", "@", "&", "=", "+", "$", "/", "?", "%", "#", "[", "]", "\\", "<", ">"];
        let validURL = inputString
            .replace(new RegExp(`[${accentChars.join('')}]`, 'g'), removeAccents)
            .replace(/[^\w\-._~]/g, '-')
            .replace(new RegExp(`[${specialChars.join('\\')}]`, 'g'), '-')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();

        return validURL
    }
    const removeAccents = char => {
        return accentMap[char] || char;
    }

    // Map of correspondences between accented characters and their unaccented equivalents
    const accentMap = {
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'Æ': 'AE', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'TH',
        'ß': 'ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e',
        'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd',
        'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y',
        'þ': 'th', 'ÿ': 'y'
    };
    const onRefresh = () => {
        setRefreshing(true);
        Promise.all([
            sendGetPropertiesStats(data?.properties),
            sendGetProspects(data?.website?.id),
            sendGetMessages(data?.website?.id),
            sendGetViews(data?.website?.id)

        ]).then((res) => {
            setRefreshing(false);
        }).catch(() =>
            setRefreshing(false)
        )
    };

    const dataList = [{ type: 'header', key: 'header' }, ...data.properties];
    return (
        <>
            {/* <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }> */}
            {data?.properties?.length ? (
                <View>
                    <FlatList
                        data={dataList}
                        renderItem={({ item, index }) => {
                            // Rendez le header s'il s'agit du premier élément du tableau
                            if (item.type === 'header') {
                                return (
                                    <View style={styles.headerContainer}>

                                        <View style={styles.container}>
                                            <Text style={styles.heading}>Performances</Text>
                                            <Text style={styles.subtitle}>Découvrez les performances générées sur vos sites web</Text>
                                        </View>
                                        <View style={styles.containerWebsite}>

                                            <View style={styles.header} >
                                                <View style={styles.pictureContainer}>
                                                    <Image source={{ uri: data?.agent?.picture }} style={styles.picture} />
                                                </View>
                                            </View>
                                            <CardStats data={{ value: data?.propertiesCount || 0, title: "Mandats de vente" }} picto={house} backgroundColor={"#E8E9EB"} />
                                            <CardStats data={{ value: data?.visits || 0, title: "Nombre de visites" }} picto={eye} backgroundColor={"rgba(148, 153, 218,0.15)"} />
                                            <CardStats data={{ value: data?.prospects || 0, title: "Nombre de prospects" }} picto={userPicto} backgroundColor={"rgba(0, 154, 167,0.15)"} />
                                            <CardStats data={{ value: data?.messages || 0, title: "Nombre de messages" }} picto={send} backgroundColor={"rgba(255, 188, 125,0.15)"} />
                                        </View>
                                    </View>
                                );
                            } else {
                                return (
                                    <TouchableOpacity onPress={() => handleCardPress(item)}>
                                        <CardPerf dataProperty={item} last={index === data.properties.length - 1} />
                                    </TouchableOpacity>
                                );
                            }
                        }}
                        keyExtractor={(item) => item.id || item.key} // Utilisez keyExtractor pour extraire la clé de chaque élément
                    />
                </View>

            ) : (
                <>
                    <ScrollView>
                        <View style={styles.headerContainer}>

                            <View style={styles.container}>
                                <Text style={styles.heading}>Performances</Text>
                                <Text style={styles.subtitle}>Découvrez les performances générées sur vos sites web</Text>
                            </View>
                            <View style={styles.containerWebsite}>

                                <View style={styles.header} >
                                    <View style={styles.pictureContainer}>
                                        <Image source={{ uri: data?.agent?.picture }} style={styles.picture} />
                                    </View>
                                </View>
                                <CardStats data={{ value: data?.propertiesCount || 0, title: "Mandats de vente" }} picto={house} backgroundColor={"#E8E9EB"} />
                                <CardStats data={{ value: data?.visits || 0, title: "Nombre de visites" }} picto={eye} backgroundColor={"rgba(148, 153, 218,0.15)"} />
                                <CardStats data={{ value: data?.prospects || 0, title: "Nombre de prospects" }} picto={userPicto} backgroundColor={"rgba(0, 154, 167,0.15)"} />
                                <CardStats data={{ value: data?.messages || 0, title: "Nombre de messages" }} picto={send} backgroundColor={"rgba(255, 188, 125,0.15)"} />
                            </View>
                        </View>
                        <View style={styles.containerSad}>
                            <View style={styles.pictoContainerSad}>
                                <Image source={sad} style={styles.picto} resizeMode="contain" />
                            </View>
                            <Text>Vous n'avez pas de mandats pour le moment.</Text>
                        </View>
                    </ScrollView>
                </>
            )}
            {/* </ScrollView> */}
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        justifyContent: "space-between",
    },
    containerWebsite: {
        paddingLeft: 30,
        paddingRight: 30,
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
    headerContainer: {
        marginBottom: 20
    }
})

export default Performances;