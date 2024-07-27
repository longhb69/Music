import { View, Text, Image, Button } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function RenderItem({ item, navigation })  {

    const Track = () => {
        return <View className="flex flex-row py-2 justify-between px-2">
            <View className="flex flex-row gap-1.5 w-[90%]">
                <View>
                    <Image 
                        source={{ uri : item.album.images[item.album.images.length-1]?.url }}
                        className="h-[50px] w-[50px] "
                    />
                </View>
                <View className="flex flex-col justify-center w-full gap-1">
                    <Text numberOfLines={1} ellipsizeMode="tail" className="text-white font-medium max-w-[80%]">{item.name}</Text>
                    <Text className="text-gray-400">{item.type}</Text>
                </View>
            </View>
        </View>
    }

    const Album = () => {
        return <TouchableWithoutFeedback onPress={() => navigation.navigate('')}>
            <View className="flex flex-row py-2 justify-between px-2">
                <View className="flex flex-row gap-1.5 w-[90%]">
                    <View>
                        <Image 
                            source={{ uri : item.images[item.images.length-1]?.url }}
                            className="h-[50px] w-[50px] "/>
                    </View>
                    <View className="flex flex-col justify-center w-full gap-1">
                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-white font-medium max-w-[80%]">{item.name}</Text>
                        <Text className="text-gray-400">{item.type}</Text>
                    </View>
                </View>
                <View className="flex-1 justify-center px-auto items-center">
                    <View>
                        <AntDesign name='right' size={18} color="white"/> 
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }

    const PlayList = () => {
        return <TouchableWithoutFeedback onPress={() => navigation.navigate('PlayList', { id: item.id })}>
            <View className="flex flex-row py-2 justify-between px-2">
                <View className="flex flex-row gap-1.5 w-[90%]">
                    <View>
                        <Image 
                            source={{ uri : item.images[0]?.url }}
                            className="h-[50px] w-[50px] "/>
                    </View>
                    <View className="flex flex-col justify-center w-full gap-1">
                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-white font-medium max-w-[80%]">{item.name}</Text>
                        <Text className="text-gray-400">{item.type}</Text>
                    </View>
                </View>
                <View className="flex-1 justify-center px-auto items-center">
                    <View>
                        <AntDesign name='right' size={18} color="white"/> 
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }

    const render = () => {
        switch(item.type) {
            case "album":
                return Album()
            case "track":
                return Track()
            case "playlist":
                return PlayList()
       }
    } 
    return (
       render()
    )
}
