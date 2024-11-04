import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


const CardPerf = ({ dataProperty, last }) => {
    return (
        <View style={[styles.container, !last && styles.borderBottom]}>
            <View style={styles.pictoContainer}>
                {
                    dataProperty.pictures.length > 0 &&
                    <Image source={{ uri: dataProperty.pictures[0].name }} style={styles.picture} resizeMode="cover" />
                }

            </View>
            <View style={styles.content} >
                <Text style={styles.publicRef}>{dataProperty?.publicRef}</Text>
                <Text style={styles.propertyTitle} numberOfLines={2}>{dataProperty?.title}</Text>
                <Text style={styles.city}>{dataProperty?.city} | {dataProperty?.price.toLocaleString()}€</Text>
            </View>
            <View style={styles.visitContainer} >
                <Text style={styles.viewsNumber}>{dataProperty?.allViews || "0"}</Text>
                <Text style={styles.visits}>{dataProperty?.allViews > 1 ? "Visites" : "Visite"}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 0.5

    },
    borderBottom: {
        borderBottomWidth: 0.25,
        borderColor: '#8F9294',
    },
    pictoContainer:
    {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

    },
    picture: {
        height: '100%',
        width: '100%',
        borderRadius: 100,
    },
    content: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 30
    },
    publicRef: {
        fontSize: 10,
        color: '#333333',
    },
    propertyTitle:
    {
        fontSize: 14,
        fontWeight: '600'
    },
    city:
    {
        fontSize: 10,
        fontWeight: '400'
    },
    visitContainer: {
        alignItems: 'center',
    },
    viewsNumber:
    {
        fontWeight: '600',
        fontSize: 20,
    },
    visits: {
        fontWeight: '400',
        fontSize: 10,
    }

});
export default CardPerf;