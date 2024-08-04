import {Image} from 'react-native'
import unknownTrackImage from '../access/unknown_track.png'
import unknownArtistImage from '../access/unknown_artist.png'

export const unknownArtistImageUri = Image.resolveAssetSource(unknownArtistImage).uri
export const unkownTrackImageUri = Image.resolveAssetSource(unknownTrackImage).uri