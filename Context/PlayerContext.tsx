import React, { PropsWithChildren, useEffect } from 'react';
import RNTrackPlayer, {State as TrackPlayerState ,Track, Event} from 'react-native-track-player'
import { seekTo } from 'react-native-track-player/lib/src/trackPlayer';

interface PlayerContextType {
    isPlaying: boolean;
    isPaused: boolean;
    isStopped: boolean;
    isEmpty: boolean;
    loading: boolean;
    buffering: boolean;
    ended: boolean;
    currentTrack: Track | null;
    play: (track?: Track) => void;
    pause: () => void;
}

export const PlayerContext = React.createContext<PlayerContextType>({
    isPlaying: false,
    isPaused: false,
    isStopped: false,
    isEmpty: false,
    loading: false,
    buffering: false,
    ended: false,
    currentTrack: null,
    play: () => null,
    pause: () => null,

})

export const PlayerContextProvider: React.FC = (props: PropsWithChildren<{}>) => {
    const [playerState, setPlayerSate] = React.useState<null | TrackPlayerState>(null);
    const [currentTrack, setCurrentTrack] = React.useState<null | Track>(null)

    React.useEffect(() => {
        const listener = RNTrackPlayer.addEventListener(
            Event.PlaybackState, 
            ({state}: {state: TrackPlayerState}) => {
                setPlayerSate(state)
            }
        )
        return () => {
            listener.remove()
        }
    }, [])

    const play = async (track?: Track) => {
        if(!track) {
            console.log("Don't have track try to play current track")
            RNTrackPlayer.play()
            return
        }
        const queue = await RNTrackPlayer.getQueue();
        //const existingTrack = queue.find(q => q.id === track.id)
        //queue.forEach(item => {
            //console.log("track current in queue", item)
        //})
        //if(existingTrack) {
        //    console.log("Fonnd this track in queue replay it from begin")
            //await RNTrackPlayer.skip(track.id)
        //    await RNTrackPlayer.seekTo(0)
        //    await RNTrackPlayer.play()
        //} else {
            RNTrackPlayer.reset()
            await RNTrackPlayer.add([track])
            setCurrentTrack(track)
            await RNTrackPlayer.play()
            await seekTo(120.2)
        //}
    }

    const pause = async () => {
        await RNTrackPlayer.pause()
    }

    const value: PlayerContextType = {
        isPlaying: playerState === TrackPlayerState.Playing,
        isPaused: playerState === TrackPlayerState.Paused,
        isStopped: playerState === TrackPlayerState.Stopped,
        isEmpty: playerState === null,
        loading: playerState === TrackPlayerState.Loading,
        buffering: playerState === TrackPlayerState.Buffering,
        ended: playerState === TrackPlayerState.Ended,
        currentTrack,
        play,
        pause
    }

    return (
        <PlayerContext.Provider value={value}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContext = () => React.useContext(PlayerContext)

