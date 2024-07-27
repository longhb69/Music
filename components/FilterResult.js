import { View, Text, FlatList } from 'react-native'
import Song from './Track'
import React, { useEffect, useState } from 'react'
import RenderItem from './RenderItem';

export default function FilterResult({ items, keyword, navigation }) {
  //Playlist have advantage compare to album if they have same point (personal choice)
  const stringSimilarity = require('string-similarity')
  const THRESHOLD = 0.4;
  const MAX_THRESHOLD = 0.85
  const SPOTIFY_COUNT = 2;
  const TOP_ITEMS = 5;
  const SECOND_ITEMS = 3;
  const THIRD_ITEMS = 2;  
  const [filteredResult, setFilteredResult] = useState([])

  const AddFilteredItems = (element) => {
    setFilteredResult(prevItems => [...prevItems, element])
  }

  useEffect(() => {
    setFilteredResult([])
    const points = {
      albumPoint: 0,
      tracksPoint: 0,
      playlistPoint: 0
    }

    items.playlists.items.forEach(item => {      
      if(item.owner.id === 'spotify') {
         //console.log("\nFind spotify play list", item.name)
         points.playlistPoint += SPOTIFY_COUNT
      }
      if(stringSimilarity.compareTwoStrings(keyword.toLowerCase(), item.name.toLowerCase()) > THRESHOLD) {
        //console.log("play list Match: ", item.name)
             points.playlistPoint += 1
      }
    })

    items.albums.items.forEach(item => {
      const similarity = stringSimilarity.compareTwoStrings(keyword.toLowerCase(), item.name.toLowerCase())
      if(similarity > THRESHOLD) {
        if(similarity >= MAX_THRESHOLD) {
          points.albumPoint += 10
        } else {
          //console.log("Album Match: ", item.name)
          points.albumPoint += 1
        }
      }
    })
    
    items.tracks.items.forEach(item => {
      if(stringSimilarity.compareTwoStrings(keyword.toLowerCase(), item.name.toLowerCase()) > THRESHOLD) {
        if(item.popularity > 50) {
          points.tracksPoint += 5
        }
        //console.log("tracks Match: ", item.name)
        points.tracksPoint += 1
      }
    })

    //console.log("Playlist points: ",points.playlistPoint)
    //console.log("Album points: ",points.albumPoint)
    //console.log("tracks points: ",points.tracksPoint)

    const entries = Object.entries(points);
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

    // Step 3: Extract the top three entries
    const maxEntry = sortedEntries[0] || [null, null];
    const secondMaxEntry = sortedEntries[1] || [null, null];
    const thirdMaxEntry = sortedEntries[2] || [null, null];

    //Print the results
    //console.log(`Max: ${maxEntry[0]} with value ${maxEntry[1]}`);
    //console.log(`Second Max: ${secondMaxEntry[0]} with value ${secondMaxEntry[1]}`);
    //console.log(`Third Max: ${thirdMaxEntry[0]} with value ${thirdMaxEntry[1]}`);

    switch(maxEntry[0]) {
      case "playlistPoint":
        //console.log("Add playlist to top stack")
        for(let i = 0; i < TOP_ITEMS; i++) {
          AddFilteredItems(items.playlists.items[i])
        }
        for(let i = 0; i < SECOND_ITEMS; i++) {
          AddFilteredItems(items.albums.items[i])
        }
        for(let i = 0; i < THIRD_ITEMS; i++) {
          AddFilteredItems(items.tracks.items[i])
        }
        items.playlists.items.slice(TOP_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.albums.items.slice(SECOND_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.tracks.items.slice(THIRD_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        
        break
      case "tracksPoint":
        //console.log("Add tracks to top stack")
        for(let i = 0; i < TOP_ITEMS; i++) {
          const item = items.tracks.items[i]
          if(stringSimilarity.compareTwoStrings(keyword.toLowerCase(), item.name.toLowerCase()) > THRESHOLD - 0.09)
            AddFilteredItems(item)
        }
        for(let i = 0; i < SECOND_ITEMS; i++) {
          AddFilteredItems(items.albums.items[i])
        }
        for(let i = 0; i < THIRD_ITEMS; i++) {
          AddFilteredItems(items.playlists.items[i])
        }
        items.albums.items.slice(SECOND_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.tracks.items.slice(TOP_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.playlists.items.slice(THIRD_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })

        break
      case "albumPoint":
        //console.log("Add album to top stack")
        for(let i = 0; i < TOP_ITEMS; i++) {
          AddFilteredItems(items.albums.items[i])
        }
        for(let i = 0; i < SECOND_ITEMS; i++) {
          AddFilteredItems(items.playlists.items[i])
        }
        if(points.tracksPoint != 0) {
          for(let i = 0; i < THIRD_ITEMS; i++) {
            AddFilteredItems(items.tracks.items[i])
          }
        }
        items.playlists.items.slice(SECOND_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.tracks.items.slice(THIRD_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })
        items.albums.items.slice(TOP_ITEMS).forEach(item => {
          AddFilteredItems(item)
        })

        break
    }
  }, [items])
  
  return (
    <FlatList
        data={filteredResult}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <RenderItem item={item} navigation={navigation}/>
        )}
    />
  )
}
