import React, { createContext, useState, useContext, Children, useRef } from 'react';
import stringSimilarity from 'string-similarity';

const YoutubeContext = createContext()

const primaryApiKey = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI';
const backupApiKey = 'AIzaSyCyYIsDhA2IK2x-hs5bfIQd-v6tcbL2Vqo';
const THRESHOLD = 0.6;
const ALLOW_DIFFRENT = 2500; //2.5s

export const YoutubeProvider = ({ children }) => {
    const key = useRef(primaryApiKey)

    const fetchYoutubeResults = async (query) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${(query)}&type=video&maxResults=4&key=${key.current}`;
        console.log(url)
        const response = await fetch(url);
        if (!response.ok) {
            return
        }

        const data = await response.json();
        return data.items;
    };

    const searchYoutube = async (track) => {
        try {
            let possibleMatch = []
            const query = `${GetArtists(track.artists)} - ${track.name} Official Audio`;
            let items = await fetchYoutubeResults(query);

            if (!items) {
                console.log("Somthing wen't wrong in fetch data try to switch api key")
                key.current = backupApiKey
                items = await fetchYoutubeResults(query);
            }
            console.log("\n")
            for(item of items) {
                const result = await CheckVideoMatch(item.id.videoId, track.name, track.artists, track.duration_ms)
                if(result)
                   possibleMatch.push(result)
                console.log("\n")
            }
            console.log("result ", possibleMatch)
            //const duration = await GetVideoDuration(data.items[0].id.videoId, track.duration_ms)
            //const youtubeUrl = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
            //return { youtubeUrl, duration }
        } catch (error) {
            console.log("Error fetching youtube data ", error)
        }
    }

    const GetArtists = (artists) => {
        let Resultartists = ''
        artists.forEach(artist => {
            if (Resultartists.length > 0) {
                Resultartists += ', ';
            }
            Resultartists += `${artist.name}`
        })
        return Resultartists
    }

    function  isoDurationToMilliseconds(isoDuration) {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = regex.exec(isoDuration);
    
        const hours = matches[1] ? parseInt(matches[1]) : 0;
        const minutes = matches[2] ? parseInt(matches[2]) : 0;
        const seconds = matches[3] ? parseInt(matches[3]) : 0;
    
        const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
        return totalMilliseconds;
    }

    const CheckVideoMatch = async (videoId, trackName, artists, trackDuration) => {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${key.current}`;
        console.log(videosUrl)
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();
        const channelTitle = videosData.items[0].snippet.channelTitle
        const videoTitle = videosData.items[0].snippet.title
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
        console.log("\nVideo detail")
        console.log("channel tilte: " ,channelTitle)
        console.log(youtubeUrl)
    
        //if artist name is Various Artists i can skip this step
        let matchArtist = false
        artists.forEach(artist => {
            const similarity = stringSimilarity.compareTwoStrings(channelTitle.toLowerCase(), artist.name.toLowerCase())
            if(similarity >= THRESHOLD) {
                console.log("Channel match artis: " , artist.name)
                matchArtist = true
            }
        })
        if(!matchArtist)
            return null
    
        console.log("Video title: ", videoTitle)
        console.log("Track title: ", trackName)
    
        //const cleanedTitle = trackName.replace(/\(.*?\)/g, '').trim()
        //console.log("Cleaned Track Title: ", cleanedTitle)
        
        //console.log(videoTitle.toLowerCase())
        //console.log(cleanedTitle.toLowerCase())
        //if(!videoTitle.toLowerCase().includes(cleanedTitle.toLowerCase() || !cleanedTitle.toLowerCase().includes(cleanedTitle.toLowerCase())))
        //    return null
    
        
        const duration = isoDurationToMilliseconds(videosData.items[0].contentDetails.duration)
        console.log("Video duration: " , duration)
        console.log("Track duration: ", trackDuration)
        console.log("Duration diffent: ", duration-trackDuration)
        //allow diffrent 2.5s
        if(duration-trackDuration < ALLOW_DIFFRENT) {
            console.log("Possible match: ", youtubeUrl)
            return youtubeUrl
        }
        if (!videosData.items) {
            console.log('No video details found');
            return;
        }
    }
    return (
        <YoutubeContext.Provider value={{searchYoutube}}>
            {children}
        </YoutubeContext.Provider>
    )
}

export const useYoutube = () => {
    return useContext(YoutubeContext)
}