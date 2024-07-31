import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import PlayList from '../screens/PlayList'

const Stack = createNativeStackNavigator()

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="PlayList" component={PlayList}/>
    </Stack.Navigator>
  )
}
