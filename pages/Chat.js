import { useContext, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, View, RefreshControl, TouchableOpacity } from "react-native"
import { StorageContext } from "../Context/StorageContext"

const Chat = ({ navigation }) => {

    const { data, sendGetChatMessages } = useContext(StorageContext)

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        sendGetChatMessages().then((res) => {
            setRefreshing(false);
        }).catch(() =>
            setRefreshing(false)
        )
    };
    const handleConversation = () => {
        navigation.navigate('Conversation')
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>


            <View style={styles.container}>
                <Text style={styles.heading}>Messages</Text>
            </View>

            <TouchableOpacity style={styles.margin} onPress={handleConversation}>
                <View style={styles.consersationContainer}>
                    <View style={styles.pictureContainer}>
                        <Image source={{ uri: data?.website?.market?.logoOppositeUrl }} style={styles.picture} resizeMode="contain" />
                    </View>
                    <View style={styles.messageContainer}>
                        <Text style={styles.conversationTitle}>{data.website.market.name}</Text>
                        <Text style={styles.conversationText} numberOfLines={2} ellipsizeMode="tail">{data?.chatMessages[0].text}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{new Date(data?.chatMessages[0].createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        </ScrollView>

    )

}
export default Chat

const styles = StyleSheet.create({

    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: "space-between",
    },
    margin: {
        padding: 20,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
    },
    picture: {
        height: '100%',
        width: '100%',
        borderRadius: 100,
    },
    consersationContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 10
    },
    conversationTitle: {
        fontWeight: '600',
    },
    pictureContainer: {
        width: 60,
        height: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    messageContainer: {
        flex: 4
    },
    conversationText:
    {
        fontSize: 12,
    },
    timeContainer: {
        flex: 2,
    },
    timeText: {
        fontSize: 10,
    },
})