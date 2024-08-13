import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Track from './Track'
import Header from './Header'
import { usePlayerContext } from '../Context/PlayerContext'
import { useYoutube } from '../Context/YoutubeContext'
import { BaseUrl } from '../shared'
import axios from 'react-native-axios'
import TrackPlayer from 'react-native-track-player'
import { usePlayTrack } from '../hooks/usePlayTrack'
import { GetArtists } from '../utils/GetArtists'
import { useQueue, useTracks } from '../store/queue'

export default function Content({ data, type }) {
  const playerContext = usePlayerContext()
  const [currentSongId, setCurrentSongId] = useState('')
  const { play } = usePlayTrack()
  const { addTrack, clearTracks } = useTracks()
  const {setActiveQueueId} = useQueue()

  useEffect(() => {
    if(playerContext.currentTrack) {
        setCurrentSongId(playerContext.currentTrack.id)
    }
  }, [playerContext.currentTrack?.id])

  useEffect(() => {
    clearTracks()
    data.tracks.items.forEach(element => {
        //console.log(element.track.name, " - ", element.track.id)
        let album
        if(type === 'album') {
            album = {
                id: element.id,
                name: element.name,
                artists: element.artists
            }
        } 
        else if(type === 'playlist') {
            album = {
                id: element.track.id,
                name: element.track.name,
                artists: element.track.artists
            }
        }
        const track = {
            id: element.track.id,
            url: BaseUrl + `musics/streaming/${element.track.id}`,
            title: element.track.name,
            artist: GetArtists(element.track.artists),
            artwork: element.track.album.images[0].url,
            duration: 0,
            duration_ms: element.track.duration_ms,
            artists: element.track.album.artists,
            album: album
        }
        console.log("album", track.title)
        addTrack(track)
    });
  }, [])

  const handlePlay = async ({ track, index }) => {
        play({ track:track, id:data.id}) //data.id is playlist id or album id
  }

  const renderContent = () => {
    if(type === "playlist") {
        return <>
            <View>
                <Header owner={data.owner} name={data.name} description={data.description} type={type}/>
            </View>
            <View className="mt-4">
                {data.tracks.items.map((item, key) => {
                    return (
                        <Track 
                            key={item.track.id} 
                            track={item.track} 
                            currentSongId={currentSongId} 
                            handlePlay={() => handlePlay({ track: item.track, index: key})}
                            type={type} 
                        />
                    );
                })}
            </View>
        </>
    } else if(type === "album") {
        return <>
            <View>
                <Header owner={GetArtists(data.artists)} name={data.name} type={type}/> 
            </View>
            <View className="mt-4">
                {data.tracks.items.map((item, key) => {
                    return (
                        <Track 
                            key={item.id} 
                            track={item} 
                            currentSongId={currentSongId} 
                            handlePlay={() => handlePlay(item)} 
                            type={type} 
                            images={data.images}
                        />
                    );
                })}
            </View>
        </>
    }
    return <Text className="text-white">Emty</Text>
  }

  return (
    <ScrollView>
        {renderContent()}
    </ScrollView>
  )
}
