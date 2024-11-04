import { Image, StyleSheet, Text, View } from "react-native";
import LocalisationPicto from '../../assets/localisation.png'
import HeaderCardProperty from "./HeaderCardProperty";

const CardProperty = ({ property }) => {
    return (
        <View style={styles.cardContainer}>
            <HeaderCardProperty property={property} />
            <Text style={styles.annonceTitle}>{property.title}</Text>
            <Text selectable={true}>Ref: {property.publicRef}</Text>

            <View style={styles.infosContainer}>
                {
                    property.city &&
                    <View style={styles.cityContainer}>
                        <View style={styles.pictoContainer}>
                            <Image source={LocalisationPicto} style={styles.picto} resizeMode="contain" />
                        </View>
                        <Text style={styles.infos}>{property.city}</Text>
                    </View>

                }
                {
                    property.price &&
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{property.price.toLocaleString()}</Text>
                        <Text style={styles.price}> €</Text>
                    </View>
                }

            </View>
            {
                property.pictures[0] &&
                <View>
                    <Image source={{ uri: property.pictures[0].name }} style={styles.annoncePicture} />
                </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    annonceTitle: {
        fontWeight: "500"
    },
    infosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        paddingTop: 5,
        paddingBottom: 5,
    },
    cityContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    pictoContainer: {
        width: 20,
        height: 20
    },
    picto: {
        height: '100%',
        width: '100%',
    },
    infos: {
        fontSize: 14,

    },
    priceContainer: {
        flexDirection: 'row',

    },
    price: {
        fontSize: 14,
        color: "#CE011F",
        fontWeight: "600"

    },
    cardContainer: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        gap: 10,
        marginBottom: 20
    },
    annoncePicture: {
        height: 200
    },

})

export default CardProperty;