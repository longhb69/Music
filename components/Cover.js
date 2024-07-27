import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'

export default function Cover({ images }) {
  return (
    <View className="flex items-center p-6">
      <Image className="h-[200px] w-[200px]" source={{ uri: images[0]?.url }}/>
    </View>
  )
}
