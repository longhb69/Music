import { useCallback } from "react"
import { BaseUrl } from "../shared"
import axios from "react-native-axios"
import { useYoutube } from "../Context/YoutubeContext"
import TrackPlayer from "react-native-track-player"
import { GetArtists } from "../utils/GetArtists"

export const usePlayTrack = () => {
    const {searchYoutube} = useYoutube()

    const play = useCallback(async (track) => {
        const url = BaseUrl + `musics/${track.id}`
        try {
            const response = await axios.get(url)
            const songData = response.data
            if(response.status === 200) {
                console.log("Play ", track.name, track.id)
                const track_to_play = {
                    id: track.id,
                    url: BaseUrl + `musics/streaming/${track.id}`, //require('../access/Tear-Us-Apart.mp3')
                    title: track.name,
                    artist: GetArtists(track.artists),
                    artwork: track.album.images[0].url,
                    duration: songData.durations_ms/1000
                }
                await TrackPlayer.reset()
                await TrackPlayer.add(track_to_play)
                await TrackPlayer.play()
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Song not found", track.id);
                const { duration, youtubeUrl } = await searchYoutube(track);
                console.log("Get song from youtube");
                console.log(duration);
                console.log(youtubeUrl);
                await AddSong(youtubeUrl, duration, track);
            } else {
                console.log("Error fetching track ", error);
            }
        }
    })
    
    const AddSong = async (youtubeUrl, duration, track) => {
        const url = BaseUrl + `musics?ytUrl=${youtubeUrl}&albumId=test`
        const data = {
            id: track.id,
            name: track.name,
            durations_ms: duration,
            YoutubeUrl: youtubeUrl,
        }
        try {
            const response = await axios.post(url, data)
            const songData = response.data
            if(response.status === 201) {
                console.log("Add song complete with duration ", songData.durations_ms)
                console.log("Play ", track.name)
                const track_to_play = {
                    id: track.id,
                    url: BaseUrl + `musics/streaming/${track.id}`, //require('../access/Tear-Us-Apart.mp3')
                    title: track.name,
                    artist: GetArtists(track.artists),
                    artwork: track.album.images[0].url,
                    duration: songData.durations_ms/1000
                }
                await TrackPlayer.reset()
                await TrackPlayer.add(track_to_play)
                await TrackPlayer.play()
            }
        } catch(error) {
            console.log('Error add song', error.message);
        }
    }
    return { play }
}