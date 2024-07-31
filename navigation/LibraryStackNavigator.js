import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Library from '../screens/Library'
import PlayList from '../screens/PlayList'

const Stack = createNativeStackNavigator()

export default function LibraryStackNavigation({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
            headerShown: false,
        }}
    >
      <Stack.Screen name="Library" component={Library}/>
      <Stack.Screen name="PlayList" component={PlayList}/>
    </Stack.Navigator>
  )
}
