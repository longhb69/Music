import { create } from "zustand"

type QueueStore = {
    activeQueueId: string | null
    setActiveQueueId: (id: string) => void
}

type Track = {
    id: string,
    url: string;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
}

type TrackStore = {
    tracks: Track[];
    addTrack: (track: Track) => void;
    updateTrackDuration: (id: string, newDuration: number) => void;
    clearTracks: () => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
    activeQueueId: null,
    setActiveQueueId: (id) => set({activeQueueId: id}),
}))

export const useTrackStore = create<TrackStore>((set) => ({
    tracks: [],
    addTrack: (track) => set( (state) => ({tracks: [...state.tracks, track]})),
    updateTrackDuration: (id, newDuration) => set((state) => ({
        tracks: state.tracks.map(track =>
            track.id === id ? { ...track, duration: newDuration } : track
        ),
    })),
    clearTracks: () => set({ tracks: []}),
}))

export const useQueue = () =>  useQueueStore((state) => state)
export const useTracks = () => useTrackStore((state) => state)