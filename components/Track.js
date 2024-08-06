import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useYoutube } from '../Context/YoutubeContext'
import { GetArtists } from '../utils/GetArtists'

export default function Track({ track, currentSongId, handlePlay, type, images }) {
  const {searchYoutube} = useYoutube()
  
  const test = async () => {
     searchYoutube(track)
  }

  const getImage = () => {
    if(type === "playlist") {
        return track.album.images[track.album.images.length - 1].url
    }
    if(type === "album") {
        return images[images.length - 1].url
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => handlePlay(track)}>
        <View className="flex flex-row mx-4 mb-3.5">
            <View className="flex flex-row gap-3 items-center">
                <View>
                    <Image 
                        source={{ uri: getImage()}}
                        className="h-[50px] w-[50px] "
                    />
                </View>
                <View className="justify-center w-full max-w-[70%]">
                    <Text className={`font-medium ${currentSongId === track.id ? 'text-pink-600' : 'text-white'}`} numberOfLines={1} ellipsizeMode='tail'>{track.name}</Text>
                    <Text className="text-gray-400 text-sm " numberOfLines={1} ellipsizeMode='tail'>{GetArtists(track.artists)}</Text>
                </View>
                <AntDesign name='ellipsis1' size={20} color='white'/>
            </View>
        </View>
    </TouchableWithoutFeedback>
  )
}
