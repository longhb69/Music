import { StyleSheet, View, Text, Image, Dimensions, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign"
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BounceIn } from "react-native-reanimated";
import { colors } from "../constants/tokens";
import { MovingText } from "./MovingText";
import PlayerProgressBar from "./PlayerProgressbar";
import { usePlayerBackground } from "../Context/usePlayerBackground";
import { PlayerControls } from "./PlayerControls";
import { useActiveTrack } from "react-native-track-player";
import { unkownTrackImageUri } from "../constants/images";

const width = Dimensions.get("window")

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    linearGradient: {
        ...StyleSheet.absoluteFill,
        opacity: 0.7
    },
    imageShadow: {
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 11.0,
    }
})

export default function Player() {
    //usePlayerBackground('https://i.scdn.co/image/ab67616d00001e0240f1c739f1afe06578b62515')
    const activeTrack = useActiveTrack()
    return (
        <SafeAreaView className="flex-1">
            <LinearGradient
                colors={['#DFEBF2', '#225C73']}
                style={styles.linearGradient}
            />
            <View className="mx-5 flex">
                <View className="mx-auto">
                    <AntDesign name="minus" size={60} color="#444444"/>
                </View>
                <View className="w-full h-[40%] my-10 rounded-md" style={styles.imageShadow}>
                    <Image 
                        source={{ uri: activeTrack?.artwork ?? unkownTrackImageUri}}
                        className="w-full h-full"
                    />
                </View>
                <View className="flex flex-row items-center justify-between mt-5">
                    <View className="overflow-hidden basis-9/12 ">
                        <MovingText 
                            text={activeTrack?.title ?? ''}
                            className="text-white text-2xl" 
                            animationThreshold={26}
                        />
                        {activeTrack?.artist && (
                            <Text numberOfLines={1} className="text-white opacity-[0.8] text-lg">
                                {activeTrack.artist}
                            </Text>
                        )}
                    </View>
                    <View className="flex flex-row gap-x-4 items-center basis-3/12">
                        <AntDesign 
                            name="heart" 
                            size={24} 
                            color={colors.icon}/>
                        <View className="bg-slate-400 p-1 rounded-full">
                            <AntDesign name="ellipsis1" size={24} color={colors.icon}/>
                        </View>
                    </View>
                </View>
                <PlayerProgressBar/> 
                <PlayerControls iconSize={40}/>
            </View>
        </SafeAreaView>
    )
}