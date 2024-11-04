import React, { createContext, useEffect, useState } from 'react';
import { getToken } from '../services/AsyncStorageService';
import { checkToken } from '../services/AuthService';

export const AuthContext = createContext()
export const LogProvider = ({ children }) => {

    const [isLogged, setIsLogged] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [email, setEmail] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        getToken("token")
            .then((token) => {
                console.log(token);
                if (token) {
                    checkToken().then((res) => {
                        setIsLogged(true);
                        setIsLoaded(true)
                        setUser(res.data)
                        setEmail(res.data.email)

                    }).catch((err) => {
                        setIsLoaded(true)
                        console.log('error checktoken', err);
                    }
                    )
                }
                else {
                    setIsLoaded(true)
                }

            }
            ).catch((err) => {
                setIsLoaded(true)
                console.log('error getToken', err);
            })
    }, [isLogged])

    return (
        <AuthContext.Provider value={{ isLogged, isLoaded, email, user, setIsLogged, setIsLoaded, setEmail, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}