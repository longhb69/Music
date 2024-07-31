import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Track from './Track'
import Header from './Header'
import { usePlayerContext } from '../Context/PlayerContext'
import { useYoutube } from '../Context/YoutubeContext'
import { BaseUrl } from '../shared'
import axios from 'react-native-axios'

export default function Content({ data, type }) {
  const playerContext = usePlayerContext()
  const {searchYoutube} = useYoutube()
  const [currentSongId, setCurrentSongId] = useState('')

  useEffect(() => {
    if(playerContext.currentTrack) {
        setCurrentSongId(playerContext.currentTrack.id)
    }
  }, [playerContext])

  useEffect(() => {
    console.log("Queue End ", playerContext.ended)
    if(playerContext.ended) {
        const index = data.tracks.items.findIndex(item => item.track.id === playerContext.currentTrack.id)
        if(index !== -1 && index < data.tracks.items.length - 1) {
            handlePlay(data.tracks.items[index+1].track)
        } else {
            return null
        }
    }
  }, [playerContext.ended])

  const handlePlay = async (track) => {
    const url = BaseUrl + `musics/${track.id}`
    try {
        console.log("Press play")
        const response = await axios.get(url)
        const songData = response.data
        if(response.status === 200) {
            console.log("Play ", track.id, track.name)
            console.log("Song that have duation of ", songData.durations_ms)
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                duration: songData.durations_ms/1000
            })
            
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            console.log("Song not found", track.id)
            const {duration, youtubeUrl} = await searchYoutube(track)
            console.log("Get song from youtube")
            console.log(duration)
            console.log(youtubeUrl)
            AddSong(youtubeUrl, duration)

        } else {
            console.log("Error fetching track ", error)
        }
    }
  }

  const AddSong = async (youtubeUrl, duration) => {
    const url = BaseUrl + `musics?ytUrl=${youtubeUrl}&albumId=test`
    const data = {
        id: track.id,
        name: track.name,
        durations_ms: duration,
        YoutubeUrl: youtubeUrl,
    }
    try {
        const response = await axios.post(url, data)
        const songData = response.data
        if(response.status === 201) {
            console.log("Add song complete with duration ", songData.durations_ms)
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                duration: songData.durations_ms/1000
            })
        }
    } catch(error) {
        console.log('Error add song', error.message);
    }
  }

  const GetArtists = (artists) => {
    let Resultartists = ''
    artists.forEach(artist => {
        if (Resultartists.length > 0) {
            Resultartists += ', ';
        }
        Resultartists += `${artist.name}`
    })
    return Resultartists
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
                            handlePlay={() => handlePlay(item.track)}
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
