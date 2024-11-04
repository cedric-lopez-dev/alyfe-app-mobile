import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { StorageContext } from '../Context/StorageContext';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { isLogged } = useContext(AuthContext)
    const { data, dataLoaded } = useContext(StorageContext)

    return (
        <>

            {
                (isLogged && dataLoaded && !data.noWebsite) &&
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const picto = isFocused ? options.picto.red : options.picto.grey
                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={onPress}
                                style={[
                                    styles.tabBarItem,
                                ]}
                            >
                                <View style={options.picto?.size === "big" ? styles.pictoContainerBig : styles.pictoContainer}>
                                    <Image source={picto} style={styles.picto} resizeMode="contain" />
                                    {(options?.chat && data?.noReadMessages) &&
                                        <View style={styles.chatNotifContainer}>
                                            <Text style={styles.chatNotifText}>{data.noReadMessages}</Text>
                                        </View>}
                                </View>
                                {
                                    options.picto?.size !== "big" && (
                                        <>
                                            <View
                                                style={[
                                                    styles.underline,
                                                    {
                                                        backgroundColor: isFocused && !options.picto?.notUnderline
                                                            ? "#CE011F"
                                                            : "transparent",
                                                    },
                                                ]}
                                            ></View>

                                        </>
                                    )
                                }


                            </TouchableOpacity>

                        );
                    })}
                </View >
            }
        </>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 80,
        backgroundColor: '#FFFFFF',
    },
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    pictoContainer:
    {
        height: 20,
        width: 20
    },
    pictoContainerBig:
    {
        height: 34,
        width: 34

    },
    picto:
    {
        height: '100%',
        width: '100%',
    },
    underline:
    {
        width: 60,
        height: 3,
        marginTop: 10,
    },
    chatNotifContainer: {
        height: 16,
        width: 16,
        backgroundColor: '#CE0311',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: [{ translateX: 8 }],

    },
    chatNotifText: {
        color: "#ffffff",
        fontSize: 8,
        fontWeight: "600",

    }
});






export default CustomTabBar;
