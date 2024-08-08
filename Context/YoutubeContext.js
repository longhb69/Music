import React, { createContext, useState, useContext, Children, useRef } from 'react';
import stringSimilarity from 'string-similarity';

const YoutubeContext = createContext()

const primaryApiKey = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI';
const backupApiKey = 'AIzaSyCyYIsDhA2IK2x-hs5bfIQd-v6tcbL2Vqo';
const THRESHOLD = 0.6;
const ALLOW_DIFFRENT = 4500; //4.5s

export const YoutubeProvider = ({ children }) => {
    const key = useRef(primaryApiKey)

    const fetchYoutubeResults = async (query) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${(query)}&type=video&maxResults=5&key=${key.current}`;
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
            //"Guy For That (Feat. Luke Combs) best to remove (Feat. someone)";
            let newTrackName = track.name.replace(/\(Feat\. [^)]+\)/, "").trim();
            const query = `${track.artists[0].name} - ${newTrackName} Official Audio`;
            let items = await fetchYoutubeResults(query);

            if (!items) {
                console.log("Somthing wen't wrong in fetch data try to switch api key")
                key.current = backupApiKey
                items = await fetchYoutubeResults(query);
            }
            console.log("\n")
            for(item of items) {
                const result = await CheckVideoMatch(item.id.videoId, track)
                if(result)
                   possibleMatch.push(result)
                console.log("\n")
            }
            console.log("result ", possibleMatch)
            //const duration = await GetVideoDuration(data.items[0].id.videoId, track.duration_ms)
            //const youtubeUrl = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
            return possibleMatch[0] //frist match
        } catch (error) {
            console.log("Error fetching youtube data ", error)
        }
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

    const CheckVideoMatch = async (videoId, track) => {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${key.current}`;
        //console.log(videosUrl)
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();
        const channelTitle = videosData.items[0].snippet.channelTitle
        const videoTitle = videosData.items[0].snippet.title
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
        //console.log("\nVideo detail")
        //console.log("channel tilte: " ,channelTitle)
        //console.log(youtubeUrl)
    
        //if artist name is Various Artists i can skip check artist name this step
        let matchArtist = false
        if(track.album.artists[0].name === "Various Artists") {
            matchArtist = true
        } else {
            track.artists.forEach(artist => {
                console.log("Check artist", artist.name, " with video artist ", channelTitle)

                const removeTopicTitle = channelTitle.replace("- Topic", "")
                console.log("Remove topic word: ", removeTopicTitle)
                const similarity = stringSimilarity.compareTwoStrings(removeTopicTitle.toLowerCase(), artist.name.toLowerCase())
                if(similarity >= THRESHOLD) {
                    console.log("Channel match artis: " , artist.name)
                    matchArtist = true
                }
            })
        }
        if(!matchArtist)
            return null
    
        //console.log("Video title: ", videoTitle)
        //console.log("Track title: ", track.name)
        
        const duration = isoDurationToMilliseconds(videosData.items[0].contentDetails.duration)
        //console.log("Video duration: " , duration)
        //console.log("Track duration: ", track.duration_ms)
        //console.log("Duration diffent: ", duration-track.duration_ms)
        //allow diffrent 2.5s
        if(duration-track.duration_ms < ALLOW_DIFFRENT) {
            //console.log("Possible match: ", youtubeUrl)
            return {youtubeUrl, duration}
        }
        if (!videosData.items) {
            //console.log('No video details found');
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