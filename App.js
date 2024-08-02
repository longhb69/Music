/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import { SpotifyAuthProvider } from './Context/SpotifyAuthContext';
import { PlayerContextProvider } from './Context/PlayerContext';
import { YoutubeProvider } from './Context/YoutubeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Player from './components/Player';

function App() {
  const [isReady, setIsReady] = useState(false)
  const Stack = createNativeStackNavigator()
  const start = async () => {
    await TrackPlayer.setupPlayer().then(() => {
      console.log('player is setup')
      setIsReady(true)
    })
    return () => {
      TrackPlayer.destroy()
    }
  }

  useEffect(() => {
    start()
  }, [])

  return (
    <GestureHandlerRootView>
      <SpotifyAuthProvider>
        <PlayerContextProvider>
          <YoutubeProvider>
            {isReady ? (
              <NavigationContainer>
                <SafeAreaView className="flex-1 bg-black">
                  <Stack.Navigator>
                    <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false}}/>
                    <Stack.Screen name="Player" 
                        options={{
                            presentation: 'card',
                            gestureEnabled: true,
                            gestureDirection: 'vertical',
                            animationDuration: 400,
                            headerShown: false,
                            cardStyle: {
                              borderTopLeftRadius: 100,
                              borderTopRightRadius: 100,
                              overflow: 'hidden', // Ensure content doesn't overflow
                          },
                        }}
                        component={Player}
                    />
                  </Stack.Navigator>
                </SafeAreaView>
              </NavigationContainer>
            ) : (
              <Text>Player not yet load</Text>
            )}
          </YoutubeProvider>
        </PlayerContextProvider>
      </SpotifyAuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;

//npx react-native run-ios --simulator='Iphone 12 mini'
//bundle exec pod install 
//bundle install 