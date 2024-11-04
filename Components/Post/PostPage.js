import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostHeader from './PostHeader';

const PostPage = ({ route }) => {
    const { post } = route.params

    return (
        <View style={styles.postContainer}>

            <PostHeader post={post} />
            <View style={styles.postContent}>
                {
                    post?.annoncePicture &&
                    <Image source={{ uri: post.annoncePicture }} style={styles.annoncePicture} />
                }

                {
                    post?.content &&
                    <Text>

                        {post.content}


                    </Text>
                }

                {
                    post?.type === "annoncePost" &&
                    <TouchableOpacity onPress={handleAnnonce}>
                        <View style={styles.buttonContainer}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Voir l'annonce</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                {
                    post?.pictureUrl &&
                    <Image source={{ uri: post?.pictureUrl }} style={styles.annoncePicture} />
                }

            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        gap: 20,
        flex: 1
    },
    postContent: {
        gap: 20,
    },
    postHeaderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 20
    },

    pictureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        backgroundColor: '#000',
        borderRadius: 100,
        padding: 5

    },
    picture: {
        height: '100%',
        width: '100%',
        borderRadius: 30,

    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "500"
    },
    headerSubTitle: {
        fontSize: 10
    },
    more: {
        color: "#009AA7"
    },
    footer: {
        borderTopWidth: 0.25,
        borderTopColor: "#8F9294",
        flexDirection: 'row',
        alignItems: "center",
        gap: 30,
        fontSize: 12,
    },
    footerElement: {
        alignItems: "center",
    },
    footerText: {
        fontSize: 12
    },
    pictoContainer:
    {
        width: 20,
        height: 20
    },
    picto: {
        height: '100%',
        width: '100%',
    },
    annoncePicture: {
        height: 200
    },
    annonceTitle: {
        fontWeight: "500",
        fontSize: 18

    },
    button:
    {
        backgroundColor: '#009AA7',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        width: '50%'

    },
    buttonContainer:
    {
        alignItems: 'center',
        paddingTop: 10
    },
    buttonText: {
        padding: 10,
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '400',
    },

})
export default PostPage;