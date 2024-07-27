import { View, Text, Button } from 'react-native'
import React from 'react'

export default function Library({ navigation}) {
  return (
    <View>
      <Text>Library</Text>
      <Button 
        title="Go to playlist"
        onPress={() => navigation.navigate('PlayList')}
      />
    </View>
  )
}
