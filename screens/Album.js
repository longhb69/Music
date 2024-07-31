import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SpotifyAuthContext } from '../Context/SpotifyAuthContext'
import axios from 'react-native-axios'
import Content from '../components/Content'
import Cover from '../components/Cover'

export default function Album({ route, navigation }) {
  const [loading, setLoading] = useState(true)
  const accessToken = useContext(SpotifyAuthContext)
  const [data, setData] = useState({})

  useEffect(() => {
    const { id } = route.params
    const getALbumData = async () => {
      const url = `https://api.spotify.com/v1/albums/${id}`
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setData(response.data)
      } catch (error) {
        console.log("Error fetching album detail ", error)
      } finally {
        setLoading(false)
      }
    }
    getALbumData()
  }, [])

  return (
    <View className="flex-1 bg-black">
      {data.id ?
        <>
          <Cover images={data.images}/>
          <Content data={data} type="album"/>
        </>
      : null}
    </View>
  )
}
