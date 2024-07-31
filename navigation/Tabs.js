import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator.js";
import SearchStackNavigator from "./SearchStackNavigator.js";
import LibraryStackNavigation from "./LibraryStackNavigator.js";
import MiniPlayer from "../components/MiniPlayer.js";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const MINIMIZED_PLAYER_HEIGHT = 55;

const styles = StyleSheet.create({
    playerSheet: {
        overlayContainer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "cyan"
        }
    }
})

const MyTabs = (props) => {
    return (
        <>
            <PanGestureHandler>
                <View className="" style={[styles.playerSheet]}>
                    <View
                        pointerEvents="none"
                        style={{
                        
                        ...StyleSheet.absoluteFillObject
                        }}
                    />
                    <View style={{ height: MINIMIZED_PLAYER_HEIGHT }}>
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
