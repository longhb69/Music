import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import TrackPlayer, { useIsPlaying } from "react-native-track-player"
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from "../constants/tokens"

export const PlayerControls = ({iconSize}) => {
    return (
        <View className="flex flex-row my-10 justify-evenly items-center">
            <SkipToPreviousButton/>
            <PlayPauseButton iconSize={iconSize}/>
            <SkipToNextButton iconSize={iconSize}/>
        </View>
    )
}

export const PlayPauseButton = ({iconSize}) => {
    const { playing } = useIsPlaying()

    return (
        <View>
            <TouchableOpacity activeOpacity={0.7}>
                <AntDesign name={playing ? 'pause' : 'caretright'} size={iconSize} color={colors.text}/>
            </TouchableOpacity>
        </View>
    )
}

export const SkipToNextButton = ({iconSize}) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToNext()}>
            <AntDesign name="forward" size={iconSize} color={colors.text}/>
        </TouchableOpacity>
    )
}

export const SkipToPreviousButton = () => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToPrevious()}>
            <AntDesign name="banckward" size={35} color={colors.text}/>
        </TouchableOpacity>
    )
}