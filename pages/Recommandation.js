import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from "react-native-phone-number-input";
import { StorageContext } from '../Context/StorageContext';
import avatarM from '../assets/avatar-male.png'
import avatarF from '../assets/avatar-female.png'
import { createLead } from '../services/LeadGen.service';
import { showMessage, hideMessage } from "react-native-flash-message";





const Recommandation = ({ navigation }) => {
    const [value, setValue] = useState()
    const phoneInput = useRef(null);
    const [formattedValue, setFormattedValue] = useState("");
    const { data, sendGetTeamLeaders, sendGetLeads } = useContext(StorageContext)
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [filterValue, setFilterValue] = useState("")
    const [formData, setFormData] = useState()
    const [errors, setErrors] = useState({ phone: true, fullname: true, reco: true })
    const [displayError, setDisplayError] = useState(false)
    const [isLoading, setIsLoading] = useState()

    useEffect(() => {
        sendGetTeamLeaders()
    }, []);

    const handlePhoneInput = (text) => {
        setValue(text)
        const checkValid = phoneInput.current?.isValidNumber(text);
        if (checkValid)
            setErrors({ ...errors, phone: false })
        setFormattedValue(text);
    }

    const handleSubitForm = () => {

        setIsLoading(true)
        if (errors.phone || errors.fullname || errors.reco) {
            setIsLoading(false)
            setDisplayError(true)
            showMessage({
                message: "Lead non créé !",
                type: "danger",

            });
        }
        else {

            const lead =
                { ...formData?.lead, phone: formattedValue, origin: { type: { memberId: data.agent.id, marketId: formData?.lead.mcId }, name: 'recommandation', source: "appMobile" } }
            createLead(lead)
                .then(() => {
                    sendGetLeads(data.agent.id)
                    setIsLoading(false)
                    navigation.navigate('Growth')
                    showMessage({
                        message: "Lead créé !",
                        type: "success",
                        backgroundColor: '#009AA7'

                    });
                }
                )
                .catch((err) => {
                    setIsLoading(false)
                    showMessage({
                        message: "Lead non créé !",
                        type: "danger",

                    });
                    console.log("lead non créé", err)
                }

                )
        }

    }
    const handleTeamLeaderCard = (teamLeader) => {
        setIsSearchVisible(false)
        setErrors({ ...errors, reco: false })
        setFormData({ ...formData, teamLeader: { firstname: teamLeader.firstname, lastname: teamLeader.lastname }, lead: { ...formData?.lead, teamLeaderId: teamLeader.id, mcId: teamLeader?.marketCenter.id } })
    }
    const handleFullName = (text) => {

        if (text !== "")
            setErrors({ ...errors, fullname: false })
        else
            setErrors({ ...errors, fullname: true })
        setFormData({ ...formData, lead: { ...formData?.lead, fullname: text } })
    }
    const handleEmail = (text) => {
        setFormData({ ...formData, lead: { ...formData?.lead, email: text } })
    }
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <Text style={styles.heading}>Faire une recommandation</Text>
                <Text style={styles.subtitle}>Vous connaissez quelqu'un qui souhaite entreprendre en immobilier?</Text>

            </View>
            <View style={styles.inputsContainer}>

                <View style={[styles.input, (errors.fullname && displayError) && styles.errorInput]}>

                    <View>
                        <Text style={styles.label}>Prénom Nom*</Text>
                    </View>
                    <TextInput
                        placeholder="Gary Keller"
                        style={styles.inputText}
                        selectionColor="#009AA7"
                        placeholderTextColor="#CED4D9"
                        autoCapitalize="none"
                        onChangeText={(text) => {
                            handleFullName(text);
                        }}
                        onFocus={() => setDisplayError(false)}
                    />

                </View>

                <View style={styles.input}>
                    <View>
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <TextInput
                        keyboardType='email-address'
                        placeholder="gary.keller@kwfrance.com"
                        style={styles.inputText}
                        selectionColor="#009AA7"
                        placeholderTextColor="#CED4D9"
                        autoCapitalize="none"
                        onChangeText={(text) => {
                            handleEmail(text);
                        }}
                        onFocus={() => setDisplayError(false)}

                    />

                </View>


                <View style={[styles.input, (errors.phone && displayError) && styles.errorInput]}>
                    <View>
                        <Text style={styles.label}>Numéro de téléphone*</Text>
                    </View>
                    <PhoneInput
                        searchPlaceholder="Rechercher un pays"
                        containerStyle={styles.phoneInputContainer}
                        textContainerStyle={styles.phoneInput}
                        ref={phoneInput}
                        placeholder='612312312'
                        defaultValue={value}
                        defaultCode="FR"
                        onChangeText={(text) => {
                            setDisplayError(false)
                        }}
                        onChangeFormattedText={(text) => {
                            handlePhoneInput(text);
                        }}


                    />

                </View>

                <View style={[styles.input, (errors.reco && displayError) && styles.errorInput]}>
                    <View>
                        <Text style={styles.label}>Recommandé à*</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setIsSearchVisible(true)
                        setDisplayError(false)

                    }}>

                        <Text style={[styles.inputText, !formData?.teamLeader && { color: '#CED4D9' }]}>{formData?.teamLeader ? `${formData?.teamLeader?.firstname} ${formData?.teamLeader?.lastname}` : 'Rechercher un membre KW'}</Text>


                    </TouchableOpacity>

                </View>
                {isSearchVisible && (
                    <Modal>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchBarContainer}>
                                <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
                                    <View style={styles.closeButton}>
                                        <Text style={styles.close}>X</Text>
                                    </View>
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="Rechercher un membre KW"
                                    style={styles.inputSearch}
                                    selectionColor="#009AA7"
                                    placeholderTextColor="#CED4D9"
                                    autoCapitalize="none"
                                    value={filterValue}
                                    onChangeText={(text) => setFilterValue(text.toLocaleLowerCase())}
                                    selectTextOnFocus={false}
                                />
                            </View>


                            <ScrollView>

                                {
                                    data?.teamLeaders
                                        .filter((teamLeader) => (
                                            (teamLeader?.firstname + teamLeader?.lastname + teamLeader?.marketCenter?.name + teamLeader?.marketCenter?.city).toLocaleLowerCase().includes(filterValue) || filterValue === ""))
                                        .map((teamLeader) => (
                                            <View key={teamLeader.id}>
                                                <TouchableOpacity style={styles.searchCard} onPress={() => handleTeamLeaderCard(teamLeader)}>
                                                    <View style={styles.pictureContainer}>
                                                        <Image source={teamLeader.picture === null ? (teamLeader.genderId === "1" ? avatarM : avatarF) : { uri: teamLeader?.picture }} style={styles.picture} />
                                                    </View>
                                                    <View>
                                                        < Text > {teamLeader?.firstname} {teamLeader?.lastname}</Text>
                                                        < Text style={styles.market} > {teamLeader?.marketCenter?.name} | {teamLeader?.marketCenter?.city}</Text>
                                                        < Text  >{teamLeader?.roleName}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                        )

                                        )
                                }
                            </ScrollView>

                        </View>
                    </Modal>

                )}

                <View style={styles.submitContainer}>
                    {

                        isLoading ?


                            <ActivityIndicator size="large" color="#009AA7" />
                            :
                            <TouchableOpacity onPress={handleSubitForm}>
                                <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#2388A4', '#1C5BBD']}>
                                    <Text style={styles.submitText} >Envoyer la recommandation</Text>
                                </LinearGradient>
                            </TouchableOpacity>


                    }

                </View>
                {displayError &&
                    <Text style={styles.errorMessage}>*Champs manquants ou invalides</Text>
                }
            </View>
        </KeyboardAwareScrollView >

    );
};

const styles = StyleSheet.create({


    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        justifyContent: "space-between",
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 20,
        fontWeight: '400',
    },
    inputsContainer:
    {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40,
        paddingVertical: 30,
        flexGrow: 1,
        gap: 30
    },
    label:
    {
        position: 'absolute',
        top: 0,
        backgroundColor: '#FFFFFF',
        transform: [{ translateY: -14 }, { translateX: 10 }],
        paddingHorizontal: 8,
        color: '#8F9294'
    },
    input:
    {
        position: 'relative',
        borderColor: '#8F9294',
        borderWidth: 1,
        borderRadius: 2,
    },
    inputText:
    {
        padding: 15,
        color: '#000000',
    },
    phoneInputContainer:
    {
        backgroundColor: 'transparent',
    },
    phoneInput: {
        backgroundColor: 'transparent',
    },
    submitContainer:
    {
        alignItems: 'center'
    },
    gradient:
    {
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',

    },
    submitText:
    {
        paddingHorizontal: 20,
        color: '#FFFFFF',
        fontWeight: '500'
    },
    searchContainer:
    {
        paddingTop: 40,
        paddingHorizontal: 30,
        paddingBottom: 150
    },
    picture: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    pictureContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 154, 167,0.15)',
    },

    searchCard:
    {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderBottomWidth: 0.25,
        borderBottomColor: '#8F9294',

    },
    market:
    {
        fontWeight: '500'
    },
    inputSearch:
    {
        borderColor: '#CED4D9',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingLeft: 10,
        flexGrow: 1,
    },
    searchBarContainer:
    {
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10

    },
    closeButton:
    {
        borderColor: '#CED4D9',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    close: {
        fontSize: 14,
        lineHeight: 14,


    },
    errorMessage: {
        color: 'red'
    },
    errorInput:
    {
        borderColor: 'red'
    }
})

export default Recommandation;