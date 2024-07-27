import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Track from './Track'
import Header from './Header'

export default function Content({ data }) {
  return (
    <ScrollView>
        <View>
            <Header owner={data.owner} name={data.name} description={data.description}/>
        </View>
        <View className="mt-4">
            {
                data.tracks.items.map((item, key) => {
                    return (
                        <Track key={item.track.id} track={item.track}/>
                    )
                })
            }
        </View>
    </ScrollView>
  )
}
