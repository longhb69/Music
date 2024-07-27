import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import axios from 'react-native-axios'
import { BaseUrl } from '../shared'
import { usePlayerContext } from '../Context/PlayerContext'

export default function Track({ track }) {
  const apiKey = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI'
  const playerContext = usePlayerContext()

  
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
    const url = BaseUrl + `musics/get4`
    console.log(url)
    try {
        console.log("Press play")
        const response = await axios.get(url)
        if(response.status === 200) {
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/get4`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url
            })
            
        }
    } catch(error) {
        if(error.response.status === 404) {
            console.log("Song not found")
        } else {
            console.log("Error fetching track ", error)
        }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePlay}>
        <View className="flex flex-row mx-4 mb-3.5">
            <View className="flex flex-row gap-3">
                <View>
                    <Image 
                        source={{ uri: track.album.images[track.album.images.length - 1].url}}
                        className="h-[50px] w-[50px] "
                    />
                </View>
                <View className="justify-center w-full max-w-[70%]">
                    <Text className="text-white font-medium" numberOfLines={1} ellipsizeMode='tail'>{track.name}</Text>
                    <Text className="text-gray-400 text-sm " numberOfLines={1} ellipsizeMode='tail'>{GetArtists()}</Text>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
  )
}
