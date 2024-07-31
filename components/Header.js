import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

export default function Header({ owner, name, description, type })  {
  useEffect(() => {
    //console.log(owner)
  }, [])
  return (
    <View>
      <View className="px-4 gap-2">
        <Text className="text-white text-2xl max-w-[80%]">{name}</Text>
        {type === "playlist" && (
          <>
            <Text numberOfLines={3} className="text-gray-400">{description}</Text>
            <Text className="text-[#fff] text-xs font-bold">{owner.display_name}</Text>
          </>
        )}
        {type === "album" && (
          <>
            <Text className="pl-2 text-[#fff] text-xs font-bold">{owner}</Text>
          </>
        )}
      </View>
    </View>
  )
}
