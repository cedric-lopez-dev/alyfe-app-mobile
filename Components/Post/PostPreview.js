import React, { useContext, useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LikePictoG from '../../assets/likePictoG.png'
import LikePicto from '../../assets/likePicto.png'
import LocalisationPicto from '../../assets/localisation.png'
import ComPicto from '../../assets/comPictoG.png'
import PostHeader from './PostHeader';
import NoPhoto from '../../assets/nophoto.png'

const PostPreview = ({ post }) => {

    return (
        <View style={styles.postContainer}>
            <PostHeader post={post} />
            {post.type === "newProperty" &&
                <>

                    <Text style={styles.annonceTitle}>{post.data.property.title}</Text>
                    <Text selectable={true}>Ref: {post.data.property.publicRef}</Text>

                    <View style={styles.infosContainer}>
                        {
                            post.data?.property.city &&
                            <View style={styles.cityContainer}>
                                <View style={styles.pictoContainer}>
                                    <Image source={LocalisationPicto} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.infos}>{post.data.property.city}</Text>
                            </View>

                        }
                        {
                            post.data?.property.price &&
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>{post.data.property.price.toLocaleString()}</Text>
                                <Text style={styles.price}> €</Text>
                            </View>
                        }

                    </View>
                </>

            }
            {
                post.content !== "" &&
                <View style={styles.postContent}>
                    <Text numberOfLines={4} ellipsizeMode="tail">
                        {
                            post.content.map((text, i) => {
                                return <Text key={i}>{text}</Text>;
                            })
                        }

                    </Text>
                    <Text style={styles.more}>Afficher</Text>
                </View>
            }
            <View>
                {(!post.pictureUrl && post.pictureUrl !== "") ?
                    <View style={styles.annonceNoPictureContainer}>
                        <Image source={NoPhoto} style={styles.annonceNoPicture} />
                    </View> :
                    post?.pictureUrl &&
                    <Image source={{ uri: post.pictureUrl }} style={styles.annoncePicture} />
                }
                {
                    (post.data?.property.baseUrl && post.data?.property.isPublished) &&
                    <View style={styles.linkContent}>
                        <Text style={styles.link}>{post.data.property.baseUrl}</Text>
                        <Text style={styles.linkMore}>En savoir plus</Text>

                    </View>
                }
            </View>

            {/* <View style={styles.footer}>
                    <View style={styles.footerElement}>
                        <View style={styles.pictoContainer}>
                            <Image source={LikePictoG} style={styles.picto} resizeMode="contain" />
                        </View>

                        <Text style={styles.footerText}>
                            J'aime
                        </Text>
                    </View>

                    <View style={styles.footerElement}>
                        <View style={styles.pictoContainer}>
                            <Image source={ComPicto} style={styles.picto} resizeMode="contain" />
                        </View>

                        <Text style={styles.footerText}>
                            Commenter
                        </Text>
                    </View>

                </View> */}
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
        gap: 10
    },
    postHeaderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 20
    },
    pictureCustomContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        backgroundColor: '#000',
        borderRadius: 100,
        padding: 5

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
        fontWeight: "500"
    },
    headerSubTitle: {
        fontSize: 10
    },
    cityContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    annonceTitle: {
        fontWeight: "500"
    },

    annoncePicture: {
        height: 200,
        maxWidth: "100%",

    },
    annonceNoPicture: {
        height: 100,
        width: 100
    },
    annonceNoPictureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200
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
        paddingTop: 10
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
    priceContainer: {
        flexDirection: 'row',

    },
    price: {
        fontSize: 14,
        color: "#CE011F",
        fontWeight: "600"

    },
    infosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        paddingTop: 5,
        paddingBottom: 5,
    },
    infos: {
        fontSize: 14,

    },
    linkContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F7F7F7',
        flexWrap: "wrap",
        alignItems: 'center'
    },
    linkMore: {
        color: '#009AA7',
        paddingTop: 5,
        paddingBottom: 5
    }

})

export default PostPreview;
