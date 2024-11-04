import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, ActivityIndicator } from 'react-native';
import logo from '../assets/kwlogo.png'
import alyfe from '../assets/alyfe-simple.png'
import epp from '../assets/epp-solo-black.png'
import { login } from '../services/AuthService';
import { setToken } from '../services/AsyncStorageService';
import { AuthContext } from '../Context/AuthContext';
import { StorageContext } from '../Context/StorageContext';


const Login = ({ navigation }) => {

    const { setIsLogged, setIsLoaded, setEmail } = useContext(AuthContext)
    const { setDataLoaded, currentVersion } = useContext(StorageContext)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = () => {
        setLoading(true);

        login({ email: username, password: password })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                setLoading(false);
                setError(err.response.data.error);
                console.log('Erreur login:', err);
            })
            .then((data) => {
                if (!data.error) {
                    setToken("token", data.token);
                    setToken("refreshToken", data.refreshToken);
                }

                if (data.error) {
                    setEmail(data.error)
                }
                setDataLoaded(false)
                setLoading(false);
                setIsLoaded(true);
                setIsLogged(true);
                navigation.replace('Tab');
            })
            .catch((err) => {
                console.log('Erreur non gérée:', err);
            });
    };


    const reset = () => {
        setError('')
    };

    const handleContainerPress = () => {
        Keyboard.dismiss();
    };

    const handleUsername = (text) => {
        setUsername(text.toLowerCase())

    }

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View style={styles.container}>

                <Image source={logo} style={styles.logo} />
                <View style={styles.imgContainer}>
                    <Image source={epp} style={styles.epp} resizeMode="contain" />
                </View>

                <TextInput
                    style={styles.input}
                    keyboardType='email-address'
                    placeholder="Adresse mail KW"
                    onChangeText={(text) => handleUsername(text)}
                    onFocus={reset}
                    selectionColor="#CE181F"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe myKW"
                    secureTextEntry
                    onChangeText={setPassword}
                    onFocus={reset}
                    selectionColor="#CE181F"
                    autoCapitalize="none"
                />
                <Text style={styles.error}>{error}</Text>
                {
                    loading ?
                        <ActivityIndicator size="large" color="#CE181F" />
                        :
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </TouchableOpacity>
                }
                <Text style={styles.version}>{currentVersion}</Text>
                <View style={styles.bottom}>
                    <Text style={styles.bottomText}>POWERED BY</Text>
                    <Image source={alyfe} style={styles.alyfe} resizeMode="contain" />
                </View>
            </View>

        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    error: {
        fontSize: 12,
        color: '#CE181F'
    },
    logo: {
        width: 60,
        height: 40,
    },
    imgContainer: {
        width: '60%',
        marginBottom: 20,
    },
    epp: {
        width: '100%',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#828282',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#CE181F',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '80%',
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 24,
    },
    version: {
        marginTop: 20,
        color: '#828282',
        fontWeight: '400',
    },
    bottom: {
        alignItems: 'center',
        gap: 10,
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20
    },
    bottomText: {
        color: '#828282',
        fontWeight: '300',
        letterSpacing: 2,
    },

    alyfe:
    {
        width: 82,
        height: 15
    }

});

export default Login;
