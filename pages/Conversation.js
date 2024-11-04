import { useContext, useEffect } from "react"
import { FlatList, Image, StyleSheet, Text, View } from "react-native"
import { StorageContext } from "../Context/StorageContext"

const Conversation = () => {

    const { data } = useContext(StorageContext)

    useEffect(() => {
        console.log("message lu");

        return () => {
            console.log("conversation quit");
        }
    }, []);


    const renderItem = ({ item }) => (
        <View style={styles.containerMessageTime} key={item.id}>
            <View style={styles.messageContainer}>
                <View style={styles.pictureContainer}>
                    <Image source={{ uri: data?.website?.market?.logoOppositeUrl }} style={styles.picture} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                    <Text selectable={true}>{item.text}</Text>
                </View>
            </View>
            <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
    );

    return (
        <>
            <FlatList
                inverted
                data={data?.chatMessages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.container}
                contentContainerStyle={{ paddingTop: 20 }}
            />

        </>
    )
}

export default Conversation

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
    },
    containerMessageTime: {
        paddingVertical: 10
    },

    messageContainer: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 10
    },

    pictureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        backgroundColor: '#000',
        borderRadius: 100,

    },
    picture: {
        height: '100%',
        width: '100%',
        borderRadius: 30,
    },

    textContainer:
    {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
    },
    timeText:
    {
        textAlign: "right",
        fontSize: 10,
    }

})