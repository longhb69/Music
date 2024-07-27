import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Search from '../screens/Search'
import PlayList from '../screens/PlayList'
import Song from '../screens/SongScreen'

const Stack = createNativeStackNavigator()

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="PlayList" component={PlayList} />
        <Stack.Screen name="SongScreen" component={Song} />
    </Stack.Navigator>
  )
}

