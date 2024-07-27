import { View, Text, Button } from 'react-native'
import React from 'react'

export default function SongScreen({ navigation }) {
  return (
    <View>
      <Text>Song</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack() }/>
    </View>
  )
}
