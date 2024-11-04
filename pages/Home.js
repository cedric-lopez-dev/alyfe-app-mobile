import React, { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Alert, Button, FlatList, Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { StorageContext } from '../Context/StorageContext';
import RNEventSource from 'react-native-event-source';
import VersionCheck from 'react-native-version-check-expo'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AppState } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { updateUser } from '../services/UserService';
import PostPreview from '../Components/Post/PostPreview';
import sad from '../assets/sad.png'
import Constants from "expo-constants"
import { getAppInfos } from '../services/AppInfosService';
import { getPosts } from '../services/PostService';



Notifications.setNotificationHandler(
    {
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        })
    }

)

const Home = ({ navigation }) => {

    const { data, dataLoaded, sendGetChatMessages, sendGetPosts, currentVersion, setData } = useContext(StorageContext)
    const { user, setUser } = useContext(AuthContext)
    const [refreshing, setRefreshing] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        getAppInfos().then((res) => {
            let url
            if (Platform.OS === 'android') {
                url = 'https://play.google.com/store/apps/details?id=com.kw.mymarketing'
            }
            if (Platform.OS === 'ios') {
                url = 'https://apps.apple.com/fr/app/6462874559'
            }
            if (res.data.appInfos.alertMessage)
                Alert.alert(
                    `${res.data.appInfos.alertMessageTitle}`,
                    `${res.data.appInfos.alertMessageText}`,
                    [
                        {
                            text: 'ok',
                            onPress: async () => {

                            },
                        },

                    ]
                );
            if (res.data.appInfos.version !== currentVersion)
                Alert.alert(
                    'Nouvelle version disponible',
                    'Voulez-vous mettre à jour l\'application ?',
                    [
                        {
                            text: 'Mettre à jour',
                            onPress: async () => {
                                Linking.openURL(url);
                            },
                        },
                        {
                            text: 'Annuler',
                            onPress: () => {
                            },
                            style: 'cancel',
                        },
                    ]
                );
        }

        )
    }, []);



    // useEffect(() => {
    //     const mcId = data?.website?.market?.id
    //     const eventSource = new RNEventSource(`https://mercurehub.cedriclopez.com/.well-known/mercure?topic=/${mcId}`);
    //     eventSource.addEventListener('message', (data) => {
    //         sendGetChatMessages()

    //     });

    // }, [data?.website?.market?.id]);

    useEffect(() => {
        // const eventSource = new RNEventSource('http://192.168.54.67:8090/.well-known/mercure?topic=/test');
        // eventSource.addEventListener('message', (data) => {
        //     console.log(data);
        // });

        if (dataLoaded) {
            registerForPushNotificationsAsync().then(res => {
                let token = res.data
                if (data.website?.market?.leadGen) {
                    let newUser = { ...user, currentToken: token }
                    if (!user?.exponentPushToken) {
                        newUser = { ...user, exponentPushToken: [] }
                    }

                    if (!newUser.exponentPushToken.includes(token)) {
                        const newArray = [...newUser.exponentPushToken, token]
                        const userToUpdate = { ...newUser, exponentPushToken: newArray }
                        updateUser(userToUpdate.id, userToUpdate)

                    }

                    setUser(newUser)
                }
                else {
                    const newArray = user?.exponentPushToken.filter((pushToken) => pushToken !== token)
                    const userToUpdate = { ...user, exponentPushToken: newArray }
                    updateUser(user.id, userToUpdate)
                    setUser(userToUpdate)
                }
            }
            );
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                sendGetPosts()
            });
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                navigation.navigate('Home')
            });
            AppState.addEventListener('change', (e) => {
                if (e === "active") {
                    sendGetPosts()
                }
            });
        }
    }, [dataLoaded]);

    const handleLink = (url) => {
        Linking.openURL(url)
    }
    const formatContent = (content) => {
        const regex = /<p>(.*?)<\/p>/g;
        const paragrafsWithBalises = content.match(regex)
        const regexLink = /<a.*?href="(.*?)".*?>(.*?)<\/a>/g;
        let array = []
        paragrafsWithBalises.forEach((p) => {
            const links = p.match(regexLink)
            const paragrafsWithoutBalises = p.replace(/<p>|<\/p>/g, '')
            let indexInit = 0
            if (!links) {
                array.push(paragrafsWithoutBalises + '\n');
            }
            else {
                links.forEach((a) => {
                    const indexLink = paragrafsWithoutBalises.indexOf(a)
                    const text = paragrafsWithoutBalises.slice(indexInit, indexLink)
                    array.push(text)
                    indexInit = indexLink + a.length
                    const urlRegex = /href="(.*?)"/;
                    const urlMatch = a.match(urlRegex);
                    const textRegex = />(.*?)</;
                    const textMatch = a.match(textRegex);
                    const textLink = textMatch ? textMatch[1] : '';
                    const url = urlMatch[1];
                    array.push(

                        <Text onPress={() => {
                            handleLink(url)
                        }} style={{ color: "#009AA7" }} >{textLink}
                        </Text>

                    )
                }

                )
            }

        })
        return array
    }

    const handlePostPreview = (post) => {
        navigation.navigate('Post', { post: post })
    };

    const handleActivation = () => {
        Linking.openURL('https://start.agentkw.fr')
    };

    function formatTimeDifference(publishedAt) {
        const currentTime = Date.now();
        const timeDifference = currentTime - publishedAt;

        // Convertir la différence de temps en secondes, minutes, heures, jours, etc.
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Choisissez le format de la chaîne en fonction de la différence de temps
        if (days > 0) {
            return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds > 0) {
            return `Il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        }
        else {
            return "à l'instant"
        }
    }

    const handleAnnoncePost = (url) => {
        Linking.openURL(url);
    };
    const onRefresh = () => {
        setRefreshing(true);
        sendGetPosts().then((res) => {
            setRefreshing(false)
        })
    };

    return (
        <>

            {
                data.noWebsite ? (
                    <View style={styles.containerNoWebsite}>
                        <View style={styles.textActivationContainer}>
                            <Text>
                                Vous n'avez actuellement
                            </Text>
                            <Text>
                                pas activé votre site.
                            </Text>
                        </View >
                        <TouchableOpacity onPress={handleActivation}>
                            <View style={styles.buttonActivation}>
                                <Text style={styles.buttonText}>Activer mon site</Text>
                            </View>
                        </TouchableOpacity>
                    </View>)

                    : (
                        data.website.market.leadGen ? (

                            <View style={styles.container}>
                                {
                                    data.posts &&
                                    <FlatList
                                        contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
                                        data={[{ type: "header", key: "header" }, ...data.posts]}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => {
                                            if (item.type === "header") {
                                                return (
                                                    <View style={styles.header}>
                                                        <View>
                                                            <Text>Bonjour !</Text>
                                                            <Text style={styles.heading}>{`${data?.agent?.firstname || ""} ${data?.agent?.lastname || ""}`}</Text>
                                                        </View>
                                                        <View style={styles.pictureContainer}>
                                                            {
                                                                data?.agent?.picture &&
                                                                <Image source={{ uri: data?.agent?.picture }} style={styles.picture} />
                                                            }

                                                        </View>
                                                    </View>
                                                );
                                            } else {
                                                const formatedTimeDifference = formatTimeDifference(Date.parse(item.publishedAt));
                                                let newPost = { ...item, publishedAt: formatedTimeDifference };
                                                if (item.type === "newProperty") {
                                                    return (
                                                        <TouchableOpacity onPress={() => {

                                                            (newPost.data.property.baseUrl && newPost.data.property.path && newPost.data.property.isPublished) &&
                                                                handleAnnoncePost('https://' + newPost.data.property.baseUrl + newPost.data.property.path)
                                                        }}>
                                                            <PostPreview post={newPost}

                                                            />
                                                        </TouchableOpacity>
                                                    );
                                                } else {
                                                    newPost = { ...newPost, content: formatContent(newPost.content) }
                                                    return (
                                                        <TouchableOpacity onPress={() => handlePostPreview(newPost)}>
                                                            <PostPreview post={newPost} />
                                                        </TouchableOpacity>
                                                    );
                                                }
                                            }
                                        }}
                                        refreshControl={
                                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                        }
                                    />
                                }
                                {/* <FlatList
                                    contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
                                    data={[{ type: "header", key: "header" }, ...data.posts]}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => {
                                        if (item.type === "header") {
                                            return (
                                                <View style={styles.header}>
                                                    <View>
                                                        <Text>Bonjour !</Text>
                                                        <Text style={styles.heading}>{`${data?.agent?.firstname || ""} ${data?.agent?.lastname || ""}`}</Text>
                                                    </View>
                                                    <View style={styles.pictureContainer}>
                                                        {
                                                            data?.agent?.picture &&
                                                            <Image source={{ uri: data?.agent?.picture }} style={styles.picture} />
                                                        }

                                                    </View>
                                                </View>
                                            )
                                        }

                                        return (
                                            <View>
                                                <Text>{item.title}</Text>
                                                <Image source={{ uri: item.pictureUrl }} style={styles.testPicture} />
                                            </View>
                                        )

                                    }}
                                /> */}

                            </View>
                        ) : (
                            <View style={styles.containerSad}>
                                <View style={styles.pictoContainerSad}>
                                    <Image source={sad} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.textSad}>Votre Market Center ne dispose pas de la fonctionnalité Fil d'actualités</Text>
                            </View>
                        )
                    )
            }

        </>
    );

};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const styles = StyleSheet.create({
    textActivationContainer:
    {
        alignItems: 'center'
    },
    buttonActivation:
    {
        backgroundColor: '#009AA7',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,

    },
    buttonText:
    {
        padding: 10,
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    containerNoWebsite: {
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
        gap: 30
    },
    container: {

        justifyContent: "space-between",
    },
    header: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#CE181F',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 30,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    picture: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    pictureContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 154, 167,0.15)',
    },
    news: {
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
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    textSad: {
        textAlign: "center",
    },
    test: {
        fontSize: 14,
        fontWeight: '800',
        paddingLeft: 30,
        paddingRight: 30,
    },
    testPicture: {
        height: 200
    }
});

export default Home;
