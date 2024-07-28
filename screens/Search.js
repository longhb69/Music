import { View, Text, Button, Animated, Keyboard } from 'react-native'
import FilterResult from "../components/FilterResult";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { SpotifyAuthContext } from "../Context/SpotifyAuthContext";
import axios from "react-native-axios";
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign'


export default function Search({ navigation }) {
    const accessToken = useContext(SpotifyAuthContext)
    const [query, setQuery] = useState('Twisters+official+playlist')
    const [text, setText] = useState('')
    const [results, setResults] = useState({})
    const [isFocused, setIsFocused] = useState(false)
    const SEARCH_DELAY = 500
    const translateY = useRef(new Animated.Value(0)).current
    const searchBarWidth = useRef(new Animated.Value(0)).current

    const handleFocus = () => {
        setIsFocused(true)
        Animated.timing(translateY, {
            toValue: -5,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const handleBlur = () => {
        setIsFocused(false)
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start()
        Keyboard.dismiss()
        setResults([])
        setQuery('')
        setText('')
    }

    function debounce(callback, delay = SEARCH_DELAY) {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                callback(...args)
            }, delay)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        console.log("token for search ", accessToken)
        const encodedQuery = query.replace(/ /g, '+');
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album%2Ctrack%2Cplaylist&limit=10`
        try {
            console.log("Search ", query, url)
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            setResults(response.data)
        } catch (error) {
            console.log("Error fetching search", error)
        }
    }

    const processInput = useCallback(
        debounce((inputText) => {
            if(inputText.trim() !== '') {
                console.log("Query change", inputText)
                setQuery(inputText)
            } else {
                setResults({})
            }
        }),[] 
    );

    const handleInputChange = (inputText) => {
        setText(inputText); // Update the text state immediately
        processInput(inputText); // Call the debounced function
    };

    useEffect(() => {
        console.log("Query change: ", query)
        getData()
    }, [query])


    return (
        <View className="bg-[#000]">
            <Animated.View style={{transform: [{ translateY }] }}>
                {isFocused ? null : <Text className="text-white text-xl mx-2">Search</Text> }
                <View className="flex flex-row items-center">
                    <Animated.View className="bg-[#2A2A2A] flex flex-row mx-2 my-2 px-2 py-1 rounded-lg items-center w-[80%]">
                        <AntDesign name="search1" size={15} color='#fff'/> 
                        <TextInput 
                            className="text-white ml-2 w-full"
                            placeholderTextColor="white"
                            placeholder='Search something...' 
                            clearButtonMode='always' 
                            autoCorrect={false} 
                            onFocus={handleFocus}
                            onChangeText={handleInputChange}
                            value={text}
                        />
                    </Animated.View>
                    {isFocused ? 
                    <View className="w-[20%]">
                        <TouchableWithoutFeedback onPress={handleBlur}>
                            <Text className="text-white">Cancel</Text>
                        </TouchableWithoutFeedback> 
                    </View>
                    : null }
                </View>
                {Object.keys(results).length > 0 ?
                    <FilterResult items={results} keyword={query} navigation={navigation}/>
                : (
                    <Text className="text-white">No result</Text>
                )}
            </Animated.View>
        </View>
    );
}