import { useEffect, useState } from "react"
import { colors } from "../constants/tokens"
import {getPalette} from "react-native-color-lens"
import colorGrabber from 'react-native-color-grabber'


export const usePlayerBackground = (imageUrl) => {
    const [imageColors, setImageColors] = useState(null)
  

    return imageColors
}