import RNFS from 'react-native-fs'

export const useCache = () => {
    const dowloadAudioFile = async (url, filename) => {
        try {
            const path = `${RNFS.CachesDirectoryPath}/${filename}.mp3`;
            const fileExists = await RNFS.exists(path)
            if(fileExists) {
                console.log('File is already cached', path)
                return path;
            }
    
            const dowmloadOptions = {
                fromUrl: url,
                toFile: path,
                background: true, //continue dowload when the app goes into the background
                //backgroundTimeout: 600000, // 10 minutes
            }
    
            const downloadResult = await RNFS.downloadFile(dowmloadOptions).promise;
    
            if(downloadResult.statusCode === 200) {
                console.log("File dowload successfully: ", path)
                return path
            }
            else {
                console.log("Download failed with status: ", downloadResult.statusCode)
                return null
            }
        } catch(error) {
            console.log('Error downloading file', error)
            return null;
        }
    }

    return { dowloadAudioFile }
}