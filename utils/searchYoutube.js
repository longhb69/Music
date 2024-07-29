import { useState } from 'react';

const aipKye = 'AIzaSyA_e8fP1BotG4eRszVpfUfN4arDM9gWlxI'
const backupaipKye = 'AIzaSyCyYIsDhA2IK2x-hs5bfIQd-v6tcbL2Vqo'
const stringSimilarity = require('string-similarity')
const THRESHOLD = 0.6;
//should add year the track realease
// if rank the top 2 video count on duration, match track duration and channel name that need to match track arits name

// add options to user so that they can correct youtube url
export const searchYoutube = async (track) => {
    //const [key, setKey] = useState(aipKye)
    try {
        let possibleMatch = []
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q="${GetArtists(track.artists)} - ${track.name} Official Audio"&type=video&maxResults=4&key=${aipKye}`
        console.log(url)
        const response = await fetch(url)
        const data = await response.json()
        console.log("\n")
        for(item of data.items) {
            const result = await GetVideoDuration(item.id.videoId, track.name, track.artists, track.duration_ms)
            if(result)
               possibleMatch.push(result)
            console.log("\n")
        }
        console.log("result ", possibleMatch)
        //const duration = await GetVideoDuration(data.items[0].id.videoId, track.duration_ms)
        //const youtubeUrl = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
        //return { youtubeUrl, duration }
    } catch (error) {
        if(error.response && error.response.status === 403) {
            console.log("key use up")
        }
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

const GetVideoDuration = async (videoId, trackName, artists, trackDuration) => {
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${key}`;
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
    if(duration-trackDuration < 2500) {
        console.log("Possible match: ", youtubeUrl)
        return youtubeUrl
    }
    if (!videosData.items) {
        console.log('No video details found');
        return;
    }
}