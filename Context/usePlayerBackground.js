import { useEffect, useState } from "react"
import { cache, getColors } from "react-native-image-colors"
import { IOSImageColors } from "react-native-image-colors/build/types"
import { colors } from "../constants/tokens"

export const usePlayerBackground = (imageUrl) => {
    const [imageColors, setImageColors] = useState(null)

    useEffect(() => {
        colorGrabber.getColors(imageUrl, (err, res) => {
            console.log(res)
        })
    }, [imageUrl])

    return imageColors
}