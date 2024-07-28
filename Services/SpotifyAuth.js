import axios from "react-native-axios"

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CLINET_DI = 'bbf61e9a5db2412180a926c9b029de4b'
const CLINET_SCREET = '9f6051ceae004a27911d30aa167c35a3'

export const GetSpotifyToken = async () => {
    try {
        console.log("Try get token")
        const response = await axios.post(
            SPOTIFY_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLINET_DI,
                client_secret: CLINET_SCREET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        const { access_token } = response.data
        console.log("Get token success", access_token)
        return access_token

    } catch (error) {
        console.long('Fail to get Token', error)
    }
}