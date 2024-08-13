import { cloneElement, useCallback, useRef } from "react"
import { BaseUrl } from "../shared"
import axios from "react-native-axios"
import { useYoutube } from "../Context/YoutubeContext"
import TrackPlayer from "react-native-track-player"
import { GetArtists } from "../utils/GetArtists"
import { useQueue, useTracks } from "../store/queue"
import { getQueue } from "react-native-track-player/lib/src/trackPlayer"
import { useCache } from "./useCache"
//require('../access/Tear-Us-Apart.mp3')
export const usePlayTrack = () => {
    const {searchYoutube} = useYoutube()
    const queueOffset = useRef(0)
    const { activeQueueId, setActiveQueueId } = useQueue()
    const {tracks, updateTrackDuration} = useTracks()
    const { dowloadAudioFile, FindCached } = useCache()

    const PlayTrack = async (track, songData, id) => {
        console.log("Play ", track.name, track.id)
        const trackIndex = tracks.findIndex((item) => item.id === track.id)
        const isChangingQueue = id !== activeQueueId
        const { existsInCache, path } = await FindCached(track.id)
        if(!existsInCache) {
            console.log("track ", track.name, " not in cache begin cache ")
            dowloadAudioFile(BaseUrl + `musics/streaming/${track.id}`, `${track.id}`)
        } else {
            console.log("track ", track.name, "found in cache")
        }
        if(id) {  //handle if user play from playlist or album
            if(isChangingQueue) {
                console.log("new queue")
                //add cache audio in background when complete cache update track.url in queue, 
                //a track that cahe still alvailbe even when user change queue 
                //so must search that track exist in cache or dowloaded before stream it
                //const cacheAudio = await dowloadAudioFile(BaseUrl + `musics/streaming/${track.id}`, `${track.id}`)
                const track_to_play = {
                    id: track.id,
                    url: existsInCache ? `file://${path}` : BaseUrl + `musics/streaming/${track.id}`,
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
                if(existsInCache) {
                    await updateTrackPathInQueue(track.id, path)
                    console.log(queue[nextTrackIndex])
                } 
                await TrackPlayer.skip(nextTrackIndex)
                await TrackPlayer.play()
            }
        } else { //if use play single track like from search result

        }
    }

    const updateTrackPathInQueue = async (updateTrackId, path) => {
        const queue = await getQueue()
        const trackIndex = queue.findIndex(track => track.id === updateTrackId)
        if(trackIndex !== -1) {
            const originalTrack = queue[trackIndex];
            const updateTrack = {
                ...originalTrack,
                url: `file://${path}`,
            }
            await TrackPlayer.remove(trackIndex)
            await TrackPlayer.add(updateTrack, trackIndex)
        } else {
        }
    }

    const addQueue = async (tracks) => {
        //this functin try to dowload whole album or playlist, should have loading icon to show downloading process
        for(const track of tracks) {
            const result = await findSong(track.id)
            if(result.status === 200) {
                const track_update_duration = {
                    ...track,
                    duration: result.songData.durations_ms/1000
                }
                console.log("Add song ", track_update_duration.title, " with duration ", track_update_duration.duration, " to queue")
                await TrackPlayer.add(track_update_duration)
            } else if(result.status === 404) {
                console.log("Song not found to add queue", track.title)
                await TrackPlayer.add(track)
                console.log("begin dowload song: ---- ", track.title)
                //const {duration, youtubeUrl } = await searchYoutube(track)
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

    const play = useCallback(async ({ track, id = null }) => { //id is playlist id or album id
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

    const AddSong = async (youtubeUrl, duration, track)  => {
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
                return { status: response.status, songData: songData}
            }
        } catch(error) {
            console.log('Error add song', error.message);
        }
    }
    
    const AddSongAndPlay = async (youtubeUrl, duration, track, id) => {
        const {status, songData} = await AddSong(youtubeUrl, duration, track)
        if(status === 201)   
            PlayTrack(track, songData, id)
    }

    return { play }
}