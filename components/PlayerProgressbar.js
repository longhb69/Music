import { View, Text } from "react-native"
import { Slider } from "react-native-awesome-slider"
import { useSharedValue } from "react-native-reanimated"
import TrackPlayer, { useActiveTrack, useProgress } from "react-native-track-player"
import { formatSecondsToMinutes } from "../utils/miscellaneous"
import { colors } from "../constants/tokens"

export default function PlayerProgressBar() {
    const { buffered ,position } = useProgress()
    const duration = useActiveTrack()?.duration
    const isSliding = useSharedValue(false)
    const progress = useSharedValue(0)
    const min = useSharedValue(0)
    const max = useSharedValue(1)

    const trackElapsedTime = formatSecondsToMinutes(position)
    const trackRemainingTime = formatSecondsToMinutes(duration-position)

    if(!isSliding.value) {
        progress.value = duration > 0 ? position / duration : 0
    }

    return <View className="mt-4">
        <Slider
            progress={progress}
            minimumValue={min}
            maximumValue={max}
            thumbWidth={0}
            renderBubble={() => null}
            theme={{
                minimumTrackTintColor: colors.minimumTrackTintColor,
                maximumTrackTintColor: colors.maximumTrackTintColor
            }} 
            onSlidingStart={() => (isSliding.value = true)}
            onValueChange={async(value) => {
                await TrackPlayer.seekTo(value * duration)
            }}
            onSlidingComplete={async(value) => {
                if(!isSliding.value) return

                isSliding.value = false
                
                await TrackPlayer.seekTo(value*duration)
            }}
        />
        <View className="flex flex-row justify-between items-baseline mt-3">
            <Text className="text-white text-xs">{trackElapsedTime}</Text>
            <Text className="text-white text-xs">{trackRemainingTime}</Text>
        </View>
        <View>
            <Text>Track progress: {position} seconds out of {duration} total</Text>
            <Text>Buffered progress: {buffered} seconds out of {duration} total</Text>
        </View>
    </View>
}