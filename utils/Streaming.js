import { BaseUrl } from '../shared'
import axios from 'react-native-axios'

export const handlePlay = async (track, playerContext, searchYoutube) => {
    const url = BaseUrl + `musics/${track.id}`
    try {
        console.log("Press play")
        const response = await axios.get(url)
        const songData = response.data
        if(response.status === 200) {
            console.log("Play ", track.id, track.name)
            console.log("Song that have duation of ", songData.durations_ms)
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                duration: songData.durations_ms/1000
            })
            
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            console.log("Song not found", track.id)
            const {duration, youtubeUrl} = await searchYoutube(track)
            console.log("Get song from youtube")
            console.log(duration)
            console.log(youtubeUrl)
            AddSong(youtubeUrl, duration, track, playerContext)

        } else {
            console.log("Error fetching track ", error)
        }
    }
  }

const AddSong = async (youtubeUrl, duration, track, playerContext) => {
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
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                duration: songData.durations_ms/1000
            })
        }
    } catch(error) {
        console.log('Error add song', error.message);
    }
  }