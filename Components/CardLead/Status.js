import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Status = ({ status }) => {

    const getStatus = (status) => {
        switch (status) {
            case 'captured':
                return { label: 'Capturé', colorText: '#1D293E', colorBackground: 'rgba(29, 41, 62, 0.15)' }
            case 'contact':
                return { label: 'Contact', colorText: '#1D293E', colorBackground: 'rgba(29, 41, 62, 0.15)' }
            case 'cultivated':
                return { label: 'Cultivé', colorText: '#FFBC7D', colorBackground: 'rgba(255, 188, 125, 0.15)' }
            case 'buyer':
                return { label: 'Acquéreur', colorText: '#FFBC7D', colorBackground: 'rgba(255, 188, 125, 0.15)' }
            case 'connected':
                return { label: 'Connecté', colorText: '#9499DA', colorBackground: 'rgba(148, 153, 218, 0.15)' }
            case 'fynder':
                return { label: 'Fynder', colorText: '#9499DA', colorBackground: 'rgba(148, 153, 218, 0.15)' }
            case 'closed':
                return { label: 'Closé', colorText: '#009AA7', colorBackground: '(rgba(0, 154, 167, 0.15)' }
            case 'seller':
                return { label: 'Vendeur', colorText: '#009AA7', colorBackground: '(rgba(0, 154, 167, 0.15)' }
            default:
                return {}
        }
    }
    const leadStatus = getStatus(status)


    return (
        <View style={[styles.statusContainer, { backgroundColor: leadStatus.colorBackground }]}>
            <Text style={[styles.status, { color: leadStatus.colorText }]}>{leadStatus.label}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    statusContainer:
    {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 50
    },
    status: {
        fontWeight: '600',
        fontSize: 10,
    },


});

export default Status;