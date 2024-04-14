import { View, StyleSheet, ScrollView, ActivityIndicator,RefreshControl, ToastAndroid, Text} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAnimeMovies, fetchLatestAnime, fetchPopularAnime, fetchTopAiringAnime } from '../../Utils/Functions';
import { ThemeColors } from '../../Utils';
import RecentList from '../StackScreens/smallComponent/RecentList';
import AiringList from '../StackScreens/smallComponent/AiringList';
import PopularList from '../StackScreens/smallComponent/PopularList';
import MovieList from '../StackScreens/smallComponent/MovieList';
import ImageSliderBig from '../StackScreens/smallComponent/ImageSliderBig';
import ImageSliderSmallWide from '../StackScreens/smallComponent/ImageSliderSmallWide';
import TodaySchdeule from './SmallComponents/TodaySchdeule';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { HomeTopbar } from '../../components';
import { useInternet } from '../../Context/InternetContext';

const color = ThemeColors.DARK;
export default function HomeScreen2({ navigation }) {
  // console.log("homescreen2 Rendered")
  const {setVideoState}=useVideoPlayer()
  const {isOnline} =useInternet()
  if(!isOnline){
    return navigation.navigate("Downloads")
  }
  const [anime, setAnime] = useState([]);
  const [popular, setPopular] = useState([]);
  const [airing, setAiring] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnime = useCallback(async (pagee) => {
    try {
      setIsLoading(true);
      const req = await fetchLatestAnime(pagee);
      if(JSON.stringify(req?.list) !== JSON.stringify(anime)){
        setAnime(req?.list);
        setVideoState(prev=>({
          ...prev,
          isVideoScreen:false,
        }))
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  },[])

  const fetchPopular = useCallback(async (page) => {
    try {
      setIsLoading1(true);
      const req = await fetchPopularAnime(page);
      // console.log(req?.list[0])
      if(JSON.stringify(req?.list) !== JSON.stringify(popular)){
        setPopular(req?.list);
      }
      setIsLoading1(false);
    } catch (error) {
      // console.log(error);
      setIsLoading1(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  },[])

  const fetchAiringAnime = useCallback(async (page) => {
    try {
      setIsLoading2(true);
      const req = await fetchTopAiringAnime(page);
      if(JSON.stringify(req?.list) !== JSON.stringify(airing)){
        setAiring(req?.list);
      }
      setIsLoading2(false);
    } catch (error) {
      // console.log(error);
      setIsLoading2(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  },[])

  const fetchMovies = useCallback(async (aplha = "", page) => {
    try {
      const req = await fetchAnimeMovies(aplha, page);
      if(JSON.stringify(req?.list) !== JSON.stringify(movies)){
        setMovies(req?.list);
      }
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  },[])

  const onRefresh = useCallback(() => {
    if(!isOnline)return
    setRefreshing(true);
    fetchAnime(1);
    fetchPopular(1);
    fetchAiringAnime(1);
    fetchMovies("", 1);
    setVideoState(prev=>({
      ...prev,
      isVideoScreen:false,
    }))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  useEffect(() => {
    if(!isOnline){
      navigation.navigate("Downloads")
    }else{
    fetchAnime(1);
    fetchPopular(1);
    fetchAiringAnime(1);
    fetchMovies("", 1);
    setVideoState(prev=>({
      ...prev,
      isVideoScreen:false,
    }))
  }
    // console.log("idk")
  }, [])

  const memoizedBigSlider = useMemo(()=>(
  <ImageSliderBig myAnime={airing}/>
  ),[airing])

  const memoizedRecentList = useMemo(()=>(<RecentList myAnime={anime}/>),[anime])
  const memoizedPopularList = useMemo(()=>(<PopularList myAnime={popular}/>),[popular])
  const memoizedAiringList = useMemo(()=>(<AiringList myAnime={airing}/>),[airing])
  const memoizedMoviesList = useMemo(()=>(<MovieList myAnime={movies}/>),[movies])
  const memoizedHomeTopbar = useMemo(()=>(<HomeTopbar />),[])
  
  const handlePopularChange =()=>{
    console.log("changed Popular")
    const idk = {
      animeID:"afafafaf",
      animeImg:"https://pixlr.com/images/index/ai-image-generator-two.webp",
      animeTitle:{
        english:"foxy",
        english_jp:"no idea",
        japanese:null,
      },
      status:"testing"
    }
    setPopular([])
  }

  if (isLoading || isLoading2) {
    if (refreshing) {
      return (
        <View style={styles.container}>
          <HomeTopbar />
          <ActivityIndicator size="large" color={color.White} />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <HomeTopbar />
          <ActivityIndicator size="large" color={color.Orange} />
        </View>
      )
    }
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Home Topbar */}
      {memoizedHomeTopbar}

      {/* Image SLider */}
      {memoizedBigSlider}
      
      <View style={styles.mcontainer}>

        {/* Recent */}
        {!isLoading && memoizedRecentList}

        {/* Schedule SLider */} 
        {<TodaySchdeule />}

        {/* Popular */}
        {!isLoading1 && memoizedPopularList}
        {/* <Text style={{fontSize:30, color:color.White}} onPress={handlePopularChange}>Change Popular</Text> */}
        {/* Top Airing */}
        {!isLoading2 && memoizedAiringList}

        {/* Image SLider Small */}
        <ImageSliderSmallWide myAnime={airing}/>

        {/* Movies */}
        {memoizedMoviesList}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding:10,
    // paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  mcontainer: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 20,
  },
})
