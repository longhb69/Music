import RNFS, { exists } from 'react-native-fs'

const MAX_CACHE_FILES = 10

export const useCache = () => {
    const dowloadAudioFile = async (url, trackId) => {
        try {
            const path = `${RNFS.CachesDirectoryPath}/${trackId}.mp3`;
            const cacheDir = RNFS.CachesDirectoryPath;
            const files = await RNFS.readDir(cacheDir)
            if(files.length >= MAX_CACHE_FILES) {
                files.sort((a,b) => a.mtime - b.mtime)
                const oldestFile = files[0]
                await RNFS.unlink(oldestFile.path)
                console.log(`Deleted oldest cache file: ${oldestFile.name}`)
            }
            for(const file of files) {
                console.log(file)
            }
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

    const FindCached = async (id) => {
        const path = `${RNFS.CachesDirectoryPath}/${id}.mp3`;
        const fileExists = await RNFS.exists(path)
        return fileExists ? { existsInCache:fileExists, path:path } : { existsInCache:fileExists, path:null }
    }

    const deleteCache = async () => {
        try {
            const cacheDir = RNFS.CachesDirectoryPath;
            const files = await RNFS.readDir(cacheDir);

            for(const file of files) {
                if(file.isFile() && file.name.endsWith('.mp3')) {
                    await RNFS.unlink(file.path);
                }
            }
        } catch(error) {
            console.log('Error deleting cache files:', error)
        }
    }
    
    return { dowloadAudioFile, FindCached,  deleteCache }
}