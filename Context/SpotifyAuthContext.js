import React, { createContext, useState, useEffect } from 'react'
import { GetSpotifyToken } from '../Services/SpotifyAuth'

export const SpotifyAuthContext = createContext()

export const SpotifyAuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {
        const initializeToken   = async () => {
            try {
                const token = await GetSpotifyToken();
                //SecureStore.setItem('spotifyToken', token)
                setAccessToken(token)
                console.log("SET TOKEN", token)
            } catch(error) {
                console.log("Error getting token", error)
            }
        }

        initializeToken()
    }, [])

    return (
        <SpotifyAuthContext.Provider value={accessToken}>
            {children}
        </SpotifyAuthContext.Provider>
    )
}
