import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import axios from 'react-native-axios'
import { BaseUrl } from '../shared'
import { usePlayerContext } from '../Context/PlayerContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { searchYoutube } from '../utils/searchYoutube'
import { useYoutube } from '../Context/YoutubeContext'

export default function Track({ track, currentSongId }) {
  const playerContext = usePlayerContext()
  const {searchYoutube} = useYoutube()
  
  const test = async () => {
    searchYoutube(track)
    //const {youtubeUrl, duration} = await searchYoutube(track)
    //console.log("\n Final result")
    //console.log(duration)
    //console.log(youtubeUrl)
  }

const GetArtists = () => {
    let artists = ''
    track.artists.forEach(artist => {
        if (artists.length > 0) {
            artists += ', ';
        }
        artists += `${artist.name}`
    })
    return artists
}

  const handlePlay = async () => {
    const url = BaseUrl + `musics/${track.id}`
    try {
        console.log("Press play")
        const response = await axios.get(url)
        if(response.status === 200) {
            console.log("Play ", track.name)
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                //duration: track.durations_ms/1000
            })
            
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            console.log("Song not found", track.id)
            const {youtubeUrl, duration} = await SearchYt()
            console.log("Get song from youtube")
            console.log(duration)
            console.log(youtubeUrl)
            AddSong(youtubeUrl, duration)

        } else {
            console.log("Error fetching track ", error)
        }
    }
  }

  const AddSong = async (youtubeUrl, duration) => {
    const url = BaseUrl + `musics?ytUrl=${youtubeUrl}&albumId=test`
    const data = {
        id: track.id,
        name: track.name,
        durations_ms: duration
    }
    try {
        const response = await axios.post(url, data)
        if(response.status === 201) {
            console.log("Add song complete")
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url
            })
        }
    } catch(error) {
        console.log('Error add song', error.message);
    }

  }

  return (
    <TouchableWithoutFeedback onPress={test}>
        <View className="flex flex-row mx-4 mb-3.5">
            <View className="flex flex-row gap-3 items-center">
                <View>
                    <Image 
                        source={{ uri: track.album.images[track.album.images.length - 1].url}}
                        className="h-[50px] w-[50px] "
                    />
                </View>
                <View className="justify-center w-full max-w-[70%]">
                    <Text className={`font-medium ${currentSongId === track.id ? 'text-pink-600' : 'text-white'}`} numberOfLines={1} ellipsizeMode='tail'>{track.name}</Text>
                    <Text className="text-gray-400 text-sm " numberOfLines={1} ellipsizeMode='tail'>{GetArtists()}</Text>
                </View>
                <AntDesign name='ellipsis1' size={20} color='white'/>
            </View>
        </View>
    </TouchableWithoutFeedback>
  )
}
