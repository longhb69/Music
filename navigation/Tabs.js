import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator.js";
import SearchStackNavigator from "./SearchStackNavigator.js";
import LibraryStackNavigation from "./LibraryStackNavigator.js";
import MiniPlayer from "../components/MiniPlayer.js";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useState, useRef } from "react";
import Animated, { useSharedValue } from "react-native-reanimated"
import Player from "../components/Player.js";

const Tab = createBottomTabNavigator();

const MINIMIZED_PLAYER_HEIGHT = 55;

const styles = StyleSheet.create({
    playerSheet: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "cyan",
        height: 100
    }
})

const MyTabs = (props) => {
    //const translationY = useSharedValue(0)
    const [up, setUp] = useState(false)
    return (
        <>
            <PanGestureHandler >
                <View className="bg-black">
                    <View style={{ 
                        height: MINIMIZED_PLAYER_HEIGHT,
                        opacity: 1,
                    }}>
                        <MiniPlayer/>
                    </View>
                </View>
            </PanGestureHandler>
            <BottomTabBar {...props}/>
        </>
    )
}

export default function Tabs() {
    return (
        <Tab.Navigator
            tabBar={props => <MyTabs {...props}/>}
            screenOptions={{
                tabBarShowLabel: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                }
            }}
        >
            <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
            <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
            <Tab.Screen name="LibraryTab" component={LibraryStackNavigation} /> 
        </Tab.Navigator>
    )
}
