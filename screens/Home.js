import { useContext, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useState } from "react";
import { SpotifyAuthContext } from "../Context/SpotifyAuthContext";
import { FlatList } from "react-native-gesture-handler";
import FilterResult from "../components/FilterResult";

export default function Home({ navigation }) {

    return (
        <View className="bg-black flex-1">
            <Text className="text-red-400">Home</Text>
        </View>
    );
} 