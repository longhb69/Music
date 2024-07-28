/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer from 'react-native-track-player';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import { SpotifyAuthProvider } from './Context/SpotifyAuthContext';
import { PlayerContextProvider } from './Context/PlayerContext';



function App() {
  const [isReady, setIsReady] = useState(false)

  const start = async () => {
    await TrackPlayer.setupPlayer().then(() => {
      console.log('player is setup')
      setIsReady(true)
    })
    // await TrackPlayer.add({
    //   id: 'trackId',
    //   url: require('./access/track.mp3'),
    //   title: 'Track Title',
    //   artist: 'Track Artist',
    // })
    // await TrackPlayer.play();
    //await TrackPlayer.pause()
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
          {isReady ? (
            <NavigationContainer>
              <SafeAreaView className='flex-1 bg-black'>
                <Tabs/>
              </SafeAreaView>
            </NavigationContainer>
          ): (
          <Text>Player not yet load</Text>
          )}
        </PlayerContextProvider>
      </SpotifyAuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;

//npx react-native run-ios --simulator='Iphone 12 mini'
//bundle exec pod install 
//bundle install 