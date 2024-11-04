import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import reco from '../../assets/reco.png'
import Status from './Status';


const CardLead = ({ lead, last }) => {

    const fullname = lead?.fullname || ""
    const split = fullname.split(" ")
    const initiales = split[0] !== "" ? split[0][0] + (split[1] ? split[1][0] : "") : ""
    return (

        <View style={[styles.container, !last && styles.borderBottom]}>

            <View style={styles.initialesContainer}>
                <Text style={styles.initiales}>{initiales}</Text>
            </View>
            <View style={styles.content} >
                <View style={styles.titleContainer}>
                    <Text style={styles.fullname}>{lead?.fullname}</Text>
                    {
                        lead?.origin?.name === "recommandation" &&
                        <View style={styles.pictoContainer}>
                            <Image source={reco} style={styles.picto} resizeMode="contain" />
                        </View>
                    }

                </View>
                {
                    lead?.phone &&
                    <Text style={styles.phone}>{lead?.phone}</Text>
                }

                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.mail}>{lead?.email}</Text>
            </View>
            <View style={styles.infoContainer} >
                {
                    lead?.createdAt &&
                    <Text style={styles.date}>{(new Date(lead.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }))}</Text>
                }

                <Status status={lead?.status} />
            </View>
        </View >

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
        marginBottom: 0.5,
    },
    borderBottom: {
        borderBottomWidth: 0.25,
        borderColor: '#8F9294',
    },
    initialesContainer:
    {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#009AA7'
    },
    initiales:
    {
        color: '#009AA7',
        fontSize: 20,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    content: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 30
    },
    fullname: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '600'
    },
    phone:
    {
        fontSize: 12,
        fontWeight: '400'
    },
    mail:
    {
        fontSize: 12,
        fontWeight: '400'
    },
    infoContainer: {
        alignItems: 'center',
        gap: 5
    },
    date:
    {
        fontWeight: '400',
        fontSize: 12,
    },
    pictoContainer:
    {
        height: 16,
        width: 16
    },
    picto: {
        width: '100%',
        height: '100%',
    },
    titleContainer:
    {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    }

});
export default CardLead;