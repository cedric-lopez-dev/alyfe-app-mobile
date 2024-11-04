import { Image, StyleSheet, Text, View } from "react-native";
import Avatar from '../../assets/avatar-male.png'


const PostHeader = ({ post }) => {
    return (

        <View style={styles.postHeaderContainer}>
            {
                post.type === "custom" &&
                <>

                    <View style={styles.pictureCustomContainer}>
                        {
                            post?.author?.logoUrl &&
                            <Image source={{ uri: post?.author?.logoUrl }} style={styles.picture} resizeMode="contain" />
                        }

                    </View>
                    <View>
                        <Text style={styles.headerTitle}>{post.title}</Text>
                        <Text style={styles.headerSubTitle}>{post.publishedAt}</Text>

                    </View>
                </>
            }
            {
                post?.type === "newProperty" &&
                <>

                    <View style={styles.pictureAnnonceContainer}>
                        {
                            post.data.member.picture ?
                                <Image source={{ uri: post.data.member.picture }} style={styles.picture} resizeMode="contain" /> :
                                <Image source={Avatar} style={styles.picture} resizeMode="contain" />
                        }

                    </View>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Nouveau mandat de {post.data.member.firstname} {post.data.member.lastname}</Text>
                        <Text style={styles.headerSubTitle}>{post.publishedAt}</Text>
                    </View>
                </>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    postHeaderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 20,
    },
    headerTitleContainer: {
        flex: 1
    },
    pictureCustomContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 100,
        padding: 5,
        borderWidth: 0.5,
        borderColor: 'grey'

    },
    pictureAnnonceContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 100,

    },
    picture: {
        height: '100%',
        width: '100%',
        borderRadius: 30,

    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    headerSubTitle: {
        fontSize: 10
    },
})

export default PostHeader;