import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { PanGestureHandler, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { usePlayerContext } from '../Context/PlayerContext'

//Glassmorphism could be nice

export default function MiniPlayer() {

  const playerContext = usePlayerContext()

  const handlePause = () => {
    console.log("press pause")
    playerContext.pause()
  }

  useEffect(() => {
    console.log("player context change")
  }, [playerContext])

  const handlePlay = () => {
    console.log("press play")
    playerContext.play(
      {
        id: 'trackId',
        url: 'https://m5pswj9mo177.share.zrok.io/musics/get4',
        title: 'Track Title',
        artist: 'Track Artist',
      }
    )
  }

  return (
    <>
        <View className="flex-row justify-between items-center h-full mx-2 pl-2 pr-4 rounded-lg bg-[#444444]">
            <View className="flex flex-row items-center gap-2">
              <Image source={{ uri: playerContext.currentTrack.artwork}} className="h-[40px] w-[40px] rounded"/>
              <Text className=" text-white font-bold">{playerContext.currentTrack.title}</Text>
            </View>
            <View className="flex flex-row items-center gap-5">

              {playerContext.isPlaying && (
                <TouchableOpacity className="" onPress={handlePause}>
                  <AntDesign name="pause" size={30} color="white"/>
                </TouchableOpacity>
              )}

              {(playerContext.isPaused || playerContext.isEmpty) && (
                <TouchableOpacity onPress={handlePlay}>
                  <AntDesign name="caretright" size={24} color="white"/>  
                </TouchableOpacity>
              )}
              <AntDesign name="forward" size={24} color="white"/>
            </View>
        </View>
    </>
  )
}
