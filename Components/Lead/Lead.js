
import { useEffect, useState } from 'react';
import { Button, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { getLeadProspect } from '../../services/LeadService';
import CardProperty from '../CardProperty/CardProperty';
import Status from '../CardLead/Status';
import Mail from '../../assets/mail.png'
import Sms from '../../assets/sms.png'
import Phone from '../../assets/phone.png'
import AddContact from '../../assets/addContact.png'
import * as Contacts from 'expo-contacts';

const Lead = ({ route }) => {

    const { lead } = route.params
    const fullname = lead?.fullname || ""
    const split = fullname.split(" ")
    const initiales = split[0] !== "" ? split[0][0] + (split[1] ? split[1][0] : "") : ""
    const [dataLead, setDataLead] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getLeadProspect(lead.status, lead.id).then((res) => {
            setIsLoading(false)
            setDataLead(res.data)
        })
    }, [])

    const handleAddContact = async () => {
        // Vérifiez si l'utilisateur a déjà accordé la permission d'accéder aux contacts
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée pour accéder aux contacts.');
            return;
        }
        if (status === 'granted') {
            let newContact = {
                [Contacts.Fields.FirstName]: lead.fullname,
                // [Contacts.Fields.LastName]: 'Doe',
                [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: lead.phone }],
            };
            if (lead?.email) {
                newContact = {
                    ...newContact,
                    [Contacts.Fields.Emails]: [{ label: 'KW Alyfe', email: lead.email }]
                };
            }

            try {
                // Ajoutez le contact
                await Contacts.addContactAsync(newContact);
                Alert.alert('Contact ajouté avec succès !');
            } catch (error) {
                Alert.alert('Erreur lors de l\'ajout du contact : ', error.message);
            }
        }

        // Créez le contact à ajouter

    };

    const handleCall = () => {
        const phoneNumberUrl = `tel:${lead?.phone}`;
        Linking.openURL(phoneNumberUrl);
    };
    const handleSendSMS = () => {
        const smsUrl = `sms:${lead?.phone}`;
        Linking.openURL(smsUrl);
    };
    const handleMail = () => {
        const email = `mailto:${lead?.email}`;
        Linking.openURL(email);
    };
    return (
        <ScrollView >
            <View style={styles.headerContainer}>
                <View style={styles.initialesContainer}>
                    <Text style={styles.initiales}>{initiales}</Text>
                </View>
                <View style={styles.infos}>
                    <Text selectable={true} style={styles.name}>{lead?.fullname}</Text>
                    {
                        lead?.phone &&
                        <Text selectable={true}>{lead?.phone}</Text>
                    }
                    {
                        lead?.email &&
                        <Text selectable={true}>{lead?.email}</Text>
                    }

                </View>
                <Status status={lead?.status} />
                <View style={styles.buttonContainer}>
                    {
                        lead?.phone &&
                        <>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleCall}
                            >
                                <View style={styles.pictoContainer}>
                                    <Image source={Phone} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.textButton}>
                                    Appel
                                </Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSendSMS}
                            >
                                <View style={styles.pictoContainer}>
                                    <Image source={Sms} style={styles.picto} resizeMode="contain" />
                                </View>
                                <Text style={styles.textButton}>
                                    Message
                                </Text>

                            </TouchableOpacity>
                        </>
                    }

                    {
                        lead?.email &&
                        < TouchableOpacity
                            style={styles.button}
                            onPress={handleMail}
                        >
                            <View style={styles.pictoContainer}>
                                <Image source={Mail} style={styles.picto} resizeMode="contain" />
                            </View>
                            <Text style={styles.textButton}>
                                E-mail
                            </Text>

                        </TouchableOpacity>
                    }


                </View>
                {
                    (lead?.phone && lead?.fullname) &&
                    <View style={styles.contactContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddContact}
                        >
                            <View style={styles.pictoContainer}>
                                <Image source={AddContact} style={styles.picto} resizeMode="contain" />
                            </View>
                            <Text style={styles.textButton}>
                                Ajouter à mes contacts
                            </Text>

                        </TouchableOpacity>
                    </View>
                }

            </View >


            {
                isLoading &&


                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#CE181F" />
                </View>
            }
            {
                (dataLead?.message && !isLoading) &&
                <View style={styles.messageContainer}>
                    <View style={styles.rowContainer}>


                        <View style={styles.initialesContainer}>
                            <Text style={styles.initiales}>{initiales}</Text>
                        </View>
                        <View style={styles.textContainer}>


                            <Text>
                                {
                                    dataLead?.message
                                }
                            </Text>

                        </View>
                    </View>
                    {
                        lead?.createdAt &&
                        <View style={styles.dateContainer}>
                            <Text style={styles.date}>{(new Date(lead.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }))}</Text>
                        </View>
                    }


                </View>
            }

            {
                (dataLead?.property && !isLoading) &&
                <View>
                    <CardProperty property={dataLead.property} />
                </View>
            }

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 20,
        gap: 10
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
    name: {
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        flex: 1,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderColor: "#009AA7",
        borderWidth: 1,
        flex: 1,


    },
    textButton: {
        color: "#009AA7",

    },
    infos: {
        alignItems: "center",
        gap: 2
    },
    messageContainer: {
        padding: 20,

    },
    rowContainer: {
        flexDirection: 'row',
        gap: 10
    },
    textContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        flex: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    date:
    {
        fontWeight: '400',
        fontSize: 12,
    },
    dateContainer:
    {
        marginTop: 10,
        alignItems: 'flex-end'
    },
    pictoContainer:
    {
        height: 18,
        width: 18
    },
    picto: {
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    contactContainer: {
        width: '100%',
        paddingHorizontal: 20,

    }
});

export default Lead;