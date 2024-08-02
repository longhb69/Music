import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { PanGestureHandler, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { usePlayerContext } from '../Context/PlayerContext'
import { useNavigation } from '@react-navigation/native'
//Glassmorphism could be nice
export default function MiniPlayer() {
  const playerContext = usePlayerContext()
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('Player')
  }

  const handlePause = () => {
    playerContext.pause()
  }

  useEffect(() => {
    console.log("player context change", playerContext)
  }, [playerContext.isPlaying])

  const handlePlay = () => {
    playerContext.play()
  }

  return (
    <View className="flex-row justify-between items-center h-full mx-2 pl-2 pr-4 rounded-lg bg-[#444444]">
      <TouchableWithoutFeedback 
        className="flex flex-row items-center gap-2 max-w-[70%]"
        onPress={handlePress}
      >
        <Image source={{ uri: playerContext.currentTrack?.artwork}} className="h-[40px] w-[40px] rounded"/>
        <Text numberOfLines={1} ellipsizeMode="tail" className=" text-white font-bold w-[90%]">{playerContext.currentTrack?.title}</Text>
      </TouchableWithoutFeedback>
      <View className="flex flex-row items-center gap-5">
        {playerContext.isPlaying && (
          <TouchableOpacity className="" onPress={handlePause}>
            <AntDesign name="pause" size={30} color="white"/>
          </TouchableOpacity>
        )}

        {(playerContext && !playerContext.isPlaying) && (
          <TouchableOpacity onPress={handlePlay}>
              <AntDesign name="caretright" size={24} color="white" />
          </TouchableOpacity>
        )}

        <AntDesign name="forward" size={24} color="white"/>
      </View>
    </View>
  )
}
