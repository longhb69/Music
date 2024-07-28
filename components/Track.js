import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import axios from 'react-native-axios'
import { BaseUrl } from '../shared'
import { usePlayerContext } from '../Context/PlayerContext'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function Track({ track, currentSongId }) {
  const aipKye = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI'
  const playerContext = usePlayerContext()

  //should add year the track realease
  // if rank the top 2 video count on duration, match track duration and channel name that need to match track arits name

  // add options to user so that they can correct youtube url
  const SearchYt = async () => {
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q="${GetArtists()} - ${track.name} Official Audio"&type=video&key=${aipKye}`
        const response = await fetch(url)
        //console.log(url)
        const data = await response.json()
        console.log("\n")
        // data.items.forEach(item => {
        //     console.log(item.snippet.title)
        //     console.log(`https://www.youtube.com/watch?v=${item.id.videoId}`)
        // })
        const duration = await GetVideoDuration(data.items[0].id.videoId)
        const youtubeUrl = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
        return { youtubeUrl, duration }
    } catch (error) {
        console.log("Error fetching youtube data ", error)
    }
  }

  const GetVideoDuration = async (videoId) => {
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${aipKye}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    if (!videosData.items) {
        console.log('No video details found');
        return;
    }
    return isoDurationToMilliseconds(videosData.items[0].contentDetails.duration)
}

function  isoDurationToMilliseconds(isoDuration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = regex.exec(isoDuration);

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;

    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    return totalMilliseconds;
}
  
const GetArtists = () => {
    let artists = ''
    track.artists.forEach(artist => {
        if (artists.length > 0) {
            artists += ', ';
        }
        artists += `${artist.name}`
    })
    return artists
}

  const handlePlay = async () => {
    const url = BaseUrl + `musics/${track.id}`
    try {
        console.log("Press play")
        const response = await axios.get(url)
        if(response.status === 200) {
            console.log("Play ", track.name)
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url,
                //duration: track.durations_ms/1000
            })
            
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            console.log("Song not found", track.id)
            const {youtubeUrl, duration} = await SearchYt()
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
        durations_ms: duration
    }
    try {
        const response = await axios.post(url, data)
        if(response.status === 201) {
            console.log("Add song complete")
            playerContext.play({
                id: track.id,
                url: BaseUrl + `musics/streaming/${track.id}`,
                title: track.name,
                artist: 'Track Artist',
                artwork: track.album.images[track.album.images.length - 1].url
            })
        }
    } catch(error) {
        console.log('Error add song', error.message);
    }

  }

  return (
    <TouchableWithoutFeedback onPress={handlePlay}>
        <View className="flex flex-row mx-4 mb-3.5">
            <View className="flex flex-row gap-3 items-center">
                <View>
                    <Image 
                        source={{ uri: track.album.images[track.album.images.length - 1].url}}
                        className="h-[50px] w-[50px] "
                    />
                </View>
                <View className="justify-center w-full max-w-[70%]">
                    <Text className={`font-medium ${currentSongId === track.id ? 'text-pink-600' : 'text-white'}`} numberOfLines={1} ellipsizeMode='tail'>{track.name}</Text>
                    <Text className="text-gray-400 text-sm " numberOfLines={1} ellipsizeMode='tail'>{GetArtists()}</Text>
                </View>
                <AntDesign name='ellipsis1' size={20} color='white'/>
            </View>
        </View>
    </TouchableWithoutFeedback>
  )
}
