import { cloneElement, useCallback, useRef } from "react"
import { BaseUrl } from "../shared"
import axios from "react-native-axios"
import { useYoutube } from "../Context/YoutubeContext"
import TrackPlayer from "react-native-track-player"
import { GetArtists } from "../utils/GetArtists"
import { useQueue, useTracks } from "../store/queue"
import { assertEasingIsWorklet } from "react-native-reanimated/lib/typescript/animation/util"
import { getQueue } from "react-native-track-player/lib/src/trackPlayer"
import { useCache } from "./useCache"

export const usePlayTrack = () => {
    const {searchYoutube} = useYoutube()
    const queueOffset = useRef(0)
    const { activeQueueId, setActiveQueueId } = useQueue()
    const {tracks, updateTrackDuration} = useTracks()
    const { dowloadAudioFile } = useCache()

    const PlayTrack = async (track, songData, id) => {
        console.log("Play ", track.name, track.id)
        const trackIndex = tracks.findIndex((item) => item.id === track.id)
        const isChangingQueue = id !== activeQueueId
        if(id) {
            if(isChangingQueue) {
                console.log("new queue")
                //add cache audio in background when complete cache update track.url in queue, 
                //a track that cahe still alvailbe even when user change queue 
                //so must search that track exist in cache or dowloaded before stream it
                //const cacheAudio = await dowloadAudioFile(BaseUrl + `musics/streaming/${track.id}`, `${track.id}`)
                const track_to_play = {
                    id: track.id,
                    url: BaseUrl + `musics/streaming/${track.id}`,//`file://${cacheAudio}`, //require('../access/Tear-Us-Apart.mp3'),
                    title: track.name,
                    artist: GetArtists(track.artists),
                    artwork: track.album.images[0].url,
                    duration: songData.durations_ms/1000
                }
                const beforeTracks = tracks.slice(0, trackIndex)
                const afterTracks = tracks.slice(trackIndex + 1)
                queueOffset.current = trackIndex
                setActiveQueueId(id)
                await TrackPlayer.reset()
                await TrackPlayer.add(track_to_play)
                await TrackPlayer.play()
                await addQueue(afterTracks)
                await addQueue(beforeTracks)
            } else {
                console.log("Play in the same queue")
                const nextTrackIndex = trackIndex - queueOffset.current < 0 
                    ? tracks.length + trackIndex - queueOffset.current
                    : trackIndex - queueOffset.current
                
                const queue = await getQueue()
                console.log(queue[nextTrackIndex])
                await TrackPlayer.skip(nextTrackIndex)
                await TrackPlayer.play()
            }
        }
    }

    const addQueue = async (tracks) => {
        //this functin try to dowload whole album or playlist, should have loading icon to show downloading process
        for(const track of tracks) {
            const result = await findSong(track.id)
            if(result.status === 200) {
                const track_update_duration = {
                    id: track.id,
                    url: track.url,
                    title: track.title,
                    artist: track.artist,
                    artwork: track.artwork,
                    duration: result.songData.durations_ms/1000
                }
                console.log("Add song ", track_update_duration.title, " with duration ", track_update_duration.duration, " to queue")
                await TrackPlayer.add(track_update_duration)
            } else if(result.status === 404) {
                console.log("Song not found to add queue", track.title)
                await TrackPlayer.add(track)
                console.log("begin dowload song: ---- ", track.title)
                //add track to server
            }
        }
    }

    const findSong = async (id) => {
        const url = BaseUrl + `musics/${id}`
        try {
            const response = await axios.get(url)
            if(response.status === 200) {
                return {
                    songData: response.data,
                    status: 200,
                }
            }
        } catch(error) {
            if (error.response && error.response.status === 404) {
                return {
                    data: null,
                    status: 404,
                };
            } else {
                console.log("Error searching track: ", error);
            }
        }
    }

    const play = useCallback(async (track, id = null) => { //id is playlist id or album id
            const result = await findSong(track.id);
            if (result.status === 200) {
                console.log('Track found:', track.name);
                PlayTrack(track, result.songData, id)
            } else if (result.status === 404) {
                console.log("Song not found", track.name);
                const { duration, youtubeUrl } = await searchYoutube(track);
                console.log("Get song from youtube");
                console.log(duration);
                console.log(youtubeUrl);
                await AddSongAndPlay(youtubeUrl, duration, track, id);
            }
    })
    
    const AddSongAndPlay = async (youtubeUrl, duration, track, id) => {
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
                PlayTrack(track, songData, id)
            }
        } catch(error) {
            console.log('Error add song', error.message);
        }
    }

    return { play }
}