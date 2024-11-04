import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Reset from '../assets/reset.png'

const HonoTool = () => {
    const [honoType, setHonoType] = useState('prix')
    const [calculEtat, setCalculEtat] = useState(false)
    const [calculEtatRevenant, setCalculEtatRevenant] = useState(false)
    const [prix, setPrix] = useState("")
    const [percent, setPercent] = useState("")
    const [revenant, setRevenant] = useState("")

    const switchHono = (value) => {
        setHonoType(value)
    }
    const calcul = (setter) => {
        Keyboard.dismiss();
        setter(true)
    }
    const reset = (setter) => {
        setter(false)
        setPercent("")
    }
    const change = (text, setter) => {
        let d = ""
        if (text[text.length - 1] === ".") {
            text.slice(0, -1);
            const f = textReplaceToNumber(text)
            d = f.toLocaleString() + "."
        }
        else {
            const f = textReplaceToNumber(text)
            if (f > 0)
                d = f.toLocaleString()
        }
        setter(d)
    }
    const textReplaceToNumber = (text) => {
        const test = text.replace(/\u202F/g, '').replace(',', '.')
        const toto = Math.round(parseFloat(test) * 100) / 100

        if (toto > 0)
            return toto
        return 0

    }
    const handleContainerPress = () => {
        Keyboard.dismiss();
    }

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <ScrollView>
                <View style={styles.container}>

                    {/* Title */}
                    <Text style={styles.heading}>Honoraires</Text>
                    <Text style={styles.subtitle}>Calculez vos honnoraires : prix affiché et somme vendeur.</Text>

                    {/* Select */}

                    <View style={styles.elementsContainer}>
                        <TouchableOpacity style={styles.button}>
                            <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#2388A4', '#1C5BBD']}>
                                <Text style={styles.buttonText}>VENDEUR</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.select}>
                            <TouchableOpacity style={styles.buttonSelect} onPress={() => switchHono('prix')}>
                                <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={honoType === 'prix' ? ['#2388A4', '#1C5BBD'] : ['#FFFFFF', '#FFFFFF']}>
                                    <Text style={[styles.buttonSelectText, { color: honoType === 'prix' ? '#FFFFFF' : '#8F9294' }]}>Prix affiché</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSelect} onPress={() => switchHono('somme')}>
                                <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={honoType === 'somme' ? ['#2388A4', '#1C5BBD'] : ['#FFFFFF', '#FFFFFF']}>
                                    <Text style={[styles.buttonSelectText, { color: honoType === 'somme' ? '#FFFFFF' : '#8F9294' }]}>Somme vendeur</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* inputs */}
                    <View style={styles.elementsContainer}>

                        <Text style={styles.inputTitle}>
                            {
                                honoType === "prix" ?
                                    "Prix affiché"
                                    :
                                    "Somme restante au vendeur"
                            }

                        </Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                placeholder="0"
                                selectionColor="#1C5BBD"
                                keyboardType="numeric"
                                style={styles.inputText}
                                value={
                                    honoType === "prix" ?
                                        prix :
                                        revenant
                                }
                                onChangeText={(text) => change(text,
                                    honoType === "prix" ?
                                        setPrix
                                        :
                                        setRevenant
                                )}

                            />
                            <Text>€</Text>
                        </View>
                        <Text style={styles.inputTitle}>

                            Honoraires vendeur:


                        </Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="0"
                                selectionColor="#1C5BBD"
                                keyboardType="numeric"
                                value={percent}
                                onChangeText={(text) => change(text,
                                    setPercent
                                )}
                            />

                            <Text>%</Text>
                        </View>
                    </View>


                    {/* Calcul button*/}
                    {

                        honoType === "prix" &&
                        <>
                            <View style={styles.submitContainer}>

                                {
                                    !calculEtat ?
                                        <TouchableOpacity onPress={() => calcul(setCalculEtat)}>
                                            <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#2388A4', '#1C5BBD']}>
                                                <Text style={[styles.buttonSubmit, { color: '#FFFFFF' }]}>Calculer</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        :
                                        <TouchableOpacity style={styles.buttonReset} onPress={() => { setPrix(""); reset(setCalculEtat) }}>
                                            <Image source={Reset} style={styles.pictoReset} resizeMode="contain" />
                                        </TouchableOpacity>

                                }
                            </View>
                            {/* Calcul resultat*/}
                            {

                                calculEtat &&
                                <View style={styles.elementsContainer}>
                                    <View style={styles.inputBox}>

                                        <Text style={styles.inputTitle}>Prix affiché</Text>
                                        <View style={styles.priceBox}>
                                            <Text>{textReplaceToNumber(prix).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>
                                    </View>
                                    <View style={styles.inputBox}>
                                        <Text style={styles.inputTitle}>Somme restante au vendeur</Text>
                                        <View style={styles.priceBox}>
                                            <Text>{(Math.round((textReplaceToNumber(prix) * (100 - textReplaceToNumber(percent)) / 100) * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>
                                    </View>

                                    <View style={styles.inputBox}>
                                        <Text style={styles.inputTitle}>Montant honoraires vendeur</Text>
                                        <View style={styles.priceBox}>
                                            <Text>{(Math.round((textReplaceToNumber(prix) * textReplaceToNumber(percent) / 100) * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>
                                    </View>
                                </View>
                            }

                        </>


                    }

                    {
                        honoType !== "prix" &&
                        <>
                            <View style={styles.submitContainer}>

                                {
                                    !calculEtatRevenant ?
                                        <TouchableOpacity onPress={() => calcul(setCalculEtatRevenant)}>
                                            <LinearGradient style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#2388A4', '#1C5BBD']}>
                                                <Text style={[styles.buttonSubmit, { color: '#FFFFFF' }]}>Calculer</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        :
                                        <TouchableOpacity style={styles.buttonReset} onPress={() => { reset(setCalculEtatRevenant); setRevenant("") }}>
                                            <Image source={Reset} style={styles.pictoReset} resizeMode="contain" />
                                        </TouchableOpacity>

                                }
                            </View>
                            {/* Calcul resultat*/}
                            {

                                calculEtatRevenant &&
                                <View style={styles.elementsContainer}>
                                    <View style={styles.inputBox}>
                                        <Text style={styles.inputTitle}>Prix affiché</Text>
                                        <View style={styles.priceBox}>
                                            <Text>{(Math.round((textReplaceToNumber(revenant) / (1 - textReplaceToNumber(percent) / 100)) * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>
                                    </View>
                                    <View style={styles.inputBox}>
                                        <Text style={styles.inputTitle}>Somme restante au vendeur</Text>

                                        <View style={styles.priceBox}>
                                            <Text>{textReplaceToNumber(revenant).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>

                                    </View>
                                    <View style={styles.inputBox}>
                                        <Text style={styles.inputTitle}>Montant honoraires vendeur</Text>
                                        <View style={styles.priceBox}>
                                            <Text>{(Math.round((textReplaceToNumber(revenant) * ((textReplaceToNumber(percent) / 100) / (1 - textReplaceToNumber(percent) / 100))) * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                            <Text> €</Text>
                                        </View>
                                    </View>

                                </View>
                            }
                        </>
                    }


                </View >
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        flex: 1,
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
    elementsContainer:
    {
        marginBottom: 40,
        gap: 20
    },
    gradient:
    {
        height: 34,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    select: {
        backgroundColor: '#FFFFFF',
        height: 34,
        borderRadius: 4,
        flexDirection: 'row',
    },
    buttonSelect:
    {
        flexBasis: '50%'
    },
    buttonSelectText: {
        fontWeight: '400',
    },
    inputBox:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.25,
        borderBottomColor: '#8F9294'
    },
    inputTitle: { color: '#8F9294' },
    inputText: {
        flex: 1,
    },
    submitContainer:
    {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 50,
    },
    buttonSubmit:
    {
        paddingRight: 30,
        paddingLeft: 30,
    },
    buttonReset:
    {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#8F9294',
        backgroundColor: '#FFFFFF',
        height: 34,
        width: 34,
        borderWidth: 0.5,
        borderColor: '#8F9294',
        borderRadius: 4,
    },
    pictoReset:
    {
        width: '60%'
    },
    priceBox:
    {
        flexDirection: 'row'
    }
});

export default HonoTool;