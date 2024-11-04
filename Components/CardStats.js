import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const CardStats = ({ data, picto, backgroundColor }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.value}>{data.value}</Text>
                <Text style={styles.title}>{data.title}</Text>
            </View>
            <View style={[styles.pictoContainer, { backgroundColor }]}><Image source={picto} style={styles.picto} resizeMode="contain" /></View>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
    },
    pictoContainer: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    picto: {
        height: '50%',
    },
    value: {
        fontSize: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 12,
        fontWeight: '400',
        color: '#8F9294'
    }
});
export default CardStats;