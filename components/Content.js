import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Track from './Track'
import Header from './Header'
import { usePlayerContext } from '../Context/PlayerContext'

export default function Content({ data }) {
  const playerContext = usePlayerContext()
  const [currentSongId, setCurrentSongId] = useState('')

  useEffect(() => {
    if(playerContext.currentTrack) {
        console.log(playerContext.currentTrack.id)
        setCurrentSongId(playerContext.currentTrack.id)
    }
  }, [playerContext])

  useEffect(() => {
    console.log("Queue End ", playerContext.ended)
  }, [playerContext.ended])

  return (
    <ScrollView>
        <View>
            <Header owner={data.owner} name={data.name} description={data.description}/>
        </View>
        <View className="mt-4">
            {
                data.tracks.items.map((item, key) => {
                    return (
                        <Track key={item.track.id} track={item.track} currentSongId={currentSongId}/>
                    )
                })
            }
        </View>
    </ScrollView>
  )
}
