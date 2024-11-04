
import { Image, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../assets/avatar-male.png'

const HeaderCardProperty = ({ property }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.pictureContainer}>
                {
                    property.agentPicture ?
                        <Image source={{ uri: property.agentPicture }} style={styles.picture} resizeMode="contain" /> :
                        <Image source={Avatar} style={styles.picture} resizeMode="contain" />
                }

            </View>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{property.agentFirstname} {property.agentLastname}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 20,
    },
    pictureContainer: {
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
    headerTitleContainer: {
        flex: 1
    },

})

export default HeaderCardProperty;