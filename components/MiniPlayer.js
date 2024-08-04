import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { PanGestureHandler, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { usePlayerContext } from '../Context/PlayerContext'
import { useNavigation } from '@react-navigation/native'
import { MovingText } from './MovingText'
import { useActiveTrack } from 'react-native-track-player'
import { unkownTrackImageUri } from '../constants/images'
import { PlayPauseButton, SkipToNextButton } from './PlayerControls'
//Glassmorphism could be nice
export default function MiniPlayer() {
  const playerContext = usePlayerContext()
  const navigation = useNavigation()

  const activeTrack = useActiveTrack()
  
  const displayedTrack = activeTrack ?? null

  //if(!displayedTrack) return null

  const handlePress = () => {
    navigation.navigate('Player')
  }

  return (
    <View className="flex-row p-2 items-center justify-between rounded-lg bg-[#444444]">
        <View className="basis-[75%] overflow-hidden">
          <TouchableWithoutFeedback className="felx flex-row" onPress={handlePress}>
              <Image source={{ uri: displayedTrack?.artwork ?? unkownTrackImageUri}} className="h-[40px] w-[40px] rounded"/>
              <View className="overflow-hidden ml-2 w-full flex justify-center">
                  <MovingText 
                      className="text-white font-bold" 
                      text={displayedTrack?.title ?? 'Guy for that feat. Luke Combs aaaa'} 
                      animationThreshold={30}
                  />
              </View>
          </TouchableWithoutFeedback> 
        </View> 
        <View className="flex flex-row items-center mx-3 h-full basis-[20%]" style={styles.trackControlsContainer}>  
            <PlayPauseButton iconSize={24}/> 
            <SkipToNextButton iconSize={24}/>     
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  trackControlsContainer: {
    columnGap: 20,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 10
  },
  contentContainer: {
    flex: 1
  }
})