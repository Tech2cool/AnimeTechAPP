import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, ToastAndroid, Share } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors';
import VideoPlayerr from '../../components/VideoPlayer';
import { fetchEpisodeDetailsFromKitsu, fetchEpisodes, fetchSources, getAsynStorageData, storeAsynStorageData,isValidData, buildLink, fetchAnimeInfo, generateDynamicLink, generateDynamicLink2 } from '../../Utils/Functions';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useLanguage } from '../../Context/LanguageContext';
import EpisodeCard from '../../components/EpisodeCard';
import { zIndex } from '../../Utils/contstant';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
let watchCout = 1;
const {height:SCREEN_HIEGHT} = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HIEGHT + 50;

const VideoScreen = ({ route, navigation }) => {
  const { anime, oneEpisode, animeId } = route.params;
  const [sources, setSources] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [animeData, setAnimeData] = useState({});
  const [episodeId, setEpisodeId] = useState(null);
  const [episodeNum, setEpisodeNum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false);
  const { videoState } = useVideoPlayer();
  const { currentLang } = useLanguage();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [lastIndex, setLastIndex] = useState(-1);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

  const [kistuEpDetails, setKistuEpDetails] = useState({
    epId: "",
    epNum: null,
    season: null,
    thumbnail: "",
    createdAt: "",
    title: {
      english: null,
      english_jp: null,
      japanese: null
    },
    description: null,
  });

  let content, AnimeTitle, episodeTitle = "";
  if (currentLang === "en") {
    AnimeTitle = (animeData?.animeTitle?.english) || 
                 (animeData?.animeTitle?.english_jp)
  } else {
    AnimeTitle = (animeData?.animeTitle?.english_jp) || 
                 (animeData?.animeTitle?.japanese)
  }

  if (isValidData(kistuEpDetails?.title?.english)||
    isValidData(kistuEpDetails?.title?.english_jp)||
    isValidData(kistuEpDetails?.title?.japanese)) {
    if (currentLang === "en") {
      episodeTitle = " - " + ((kistuEpDetails?.title?.english) || (kistuEpDetails?.title?.english_jp))
    }
    else {
      episodeTitle = (kistuEpDetails?.title?.english_jp) || (kistuEpDetails?.title?.japanese)
    }
    // console.log("true")
  }
  // if (kistuEpDetails.season) season = `S${kistuEpDetails?.season} `;
  
  const myKey = `watchedList_${animeData?.animeID? animeData?.animeID:animeId}`;

  useEffect(() => {
    let eid, eNum;
    if (isValidData(oneEpisode?.id)) {
      eid = oneEpisode?.id
    } else {
      eid = animeData?.episodeId
    }

    if (isValidData(oneEpisode?.number)) {
      eNum = oneEpisode?.number
    } else {
      eNum = animeData?.episodeNum
    }

    setEpisodeId(eid);
    setEpisodeNum(eNum);
    // console.log("useeffect setepnum + id")
  }, [animeData?.episodeId, oneEpisode?.id, animeData?.episodeNum, oneEpisode?.number])

  useEffect(()=>{
    if(isValidData(anime)){
      setAnimeData(anime);
      // console.log(anime)
    }
  },[anime])

  useEffect(()=>{
    if(isValidData(animeId)){
      const fetchAnimeDetailss= async()=>{
        const req = await fetchAnimeInfo(animeId);
        // console.log(req)
        setAnimeData(req);
      }
      fetchAnimeDetailss();
      // console.log("animeId: "+ animeId)  
    }
  },[animeId])

  const memoizedFetchSources = useMemo(() => async () => {
    try {
      setIsLoading(true);
      const req = await fetchSources(episodeId);
      setSources(req);
      const kitsuReq = await fetchEpisodeDetailsFromKitsu(animeData?.AdditionalInfo?.id, episodeNum);
      setKistuEpDetails(kitsuReq);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }, [episodeId, episodeNum, animeData]);

  // This effect will run when episodeId, episodeNum, or anime changes
  useEffect(() => {
    memoizedFetchSources();
  }, [memoizedFetchSources]);

  const watchList = useMemo(() => {
    return {
      anime: animeData,
      episodeId: episodeId,
      watchingEpisode: episodeNum,
      watchedTime: videoState?.currentTime,
      duration: videoState?.duration,
      wannaDelete: false,
      timestamp: new Date().getTime(),
    }
  }, [animeData, episodeId, episodeNum, videoState?.currentTime, videoState?.duration])

  useEffect(() => {
    if (watchCout > 5) {
      if (videoState?.currentTime < 1) return
      // console.log(watchList)
      storeAsynStorageData(myKey, JSON.stringify(watchList));
      // console.log("interval");
      watchCout = 1;
    } else {
      watchCout++
    }
  }, [videoState?.currentTime])

  const memoizedFetchEpisodes = useMemo(() => async () => {
    try {
      setIsLoadingEpisode(true)
      // console.log(animeData?.animeID, animeData?.AdditionalInfo?.id);
      const ep_req = await fetchEpisodes(animeData?.animeID, animeData?.AdditionalInfo?.id)
      // console.log(ep_req);
      if (ep_req.length > 0) {
        setEpisodes(ep_req);
        // console.log("trigger episodLoad")
      } else setEpisodes([])
      setIsLoadingEpisode(false)
    } catch (error) {
      ToastAndroid.show("Error:"+ error,ToastAndroid.SHORT)
      // console.log(error)
      setIsLoadingEpisode(false)
    }
  }, [animeData?.animeID]);

  // useEffect(()=>{
  //   const fetchAnimeData = async()=>{
  //     const req = await fetchAnimeInfo(animeId)
  //     console.log(req)
  //     setAnimeData(req);
  //   }
  //   fetchAnimeData()
  // },[animeId])

  useEffect(() => {
    memoizedFetchEpisodes()
  }, [memoizedFetchEpisodes])


  useEffect(() => {
    const currentIndex = episodes?.findIndex((episode) => episode?.number === parseInt(episodeNum));
    const lastIndex = episodes?.length - 1;
    setCurrentIndex(currentIndex);
    // console.log(episodes[0])
    // console.log("last" + lastIndex)
    setLastIndex(lastIndex);
  }, [episodes, episodeNum]);

  const handleNextEpisode = () => {
    const currentIndex = episodes?.findIndex((episode) => episode?.number === parseInt(episodeNum));
    if (currentIndex !== -1 && currentIndex + 1 < episodes.length) {
      const nextEpisode = episodes[currentIndex + 1];
      setEpisodeId(nextEpisode?.id)
      setEpisodeNum(nextEpisode?.number)
      // console.log(nextEpisode);
    }
  }

  const handlePrevEpisode = () => {
    const currentIndex = episodes?.findIndex((episode) => episode?.number === parseInt(episodeNum));
    if (currentIndex !== -1 && currentIndex !== 0 && currentIndex - 1 < episodes.length) {
      const nextEpisode = episodes[currentIndex - 1];
      setEpisodeId(nextEpisode?.id)
      setEpisodeNum(nextEpisode?.number)
      // console.log(nextEpisode);
      // console.log("prev episode found");
    }
  }


  const scrollToEpisode = (index) => {
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };
  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 120 * index,
    index,
  });

  useEffect(() => {

    const delay = setTimeout(() => {
      scrollToEpisode(currentIndex >1?currentIndex-2:currentIndex);
    }, 500);
    return () => clearTimeout(delay);
  }, [currentIndex, episodeNum, !videoState.isFullscreen]);

  const handleEpisodeSwtich = (episode) => {
    setEpisodeId(episode?.id);
    setEpisodeNum(episode?.number)
  }

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / 100)*10; // Assuming a fixed item height
    // console.log("ind" + index)
    // console.log("offset" + offsetY)
    setCurrentScrollIndex(index);
  };
  const handleShare = async()=>{
    try {
      const getLink = await generateDynamicLink(
        "video",
        isValidData(animeData?.animeID)?animeData?.animeID:animeId, 
        episodeId, 
        episodeNum, 
        animeData?.animeImg, 
        `Episode ${episodeNum} - ${AnimeTitle}`, 
        "")
      Share.share({
        message:getLink,
      })
    } catch (error) {
        // console.log("err: "+ error)
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const handleGoBack = ()=>{
    if(isValidData(animeId)){
      navigation.navigate("HomeStack")
    }else{
      navigation.goBack()
    }
  }
  const handlePress = (episode) => {
    handleEpisodeSwtich(episode);
  };
  
  if (isLoading) {
    content = <View style={{ minHeight: 180, justifyContent: "center", alignItems: "center", backgroundColor: color.DarkBackGround }}>
      <ActivityIndicator size="large" color={color.Orange} />
    </View>
  } else {
    content = sources && sources.length > 0? (

      <VideoPlayerr
        vId={episodeId}
        pQualities={sources}
        // url={sources?.find(src => src?.quality === "default") ? sources?.find(src => src.quality === "default")?.url : sources[0]?.url}
        url={sources?.find(src => src?.quality === "default") ? sources?.find(src => src.quality === "default")?.url : sources[0]?.url}
        goback={handleGoBack}
        />
    ):(
      <View style={{ minHeight: 180, justifyContent: "center", alignItems: "center", 
          backgroundColor: color.DarkBackGround }} >
      </View>
    )
  }

  if (videoState.isFullscreen) {
    return (
      <View style={[{ flex: 1, position: "relative", backgroundColor: color.DarkBackGround}]}>
        {content}
      </View>
    )
  }
  else {
    return (
      <View style={[{ flex: 1, backgroundColor: color.DarkBackGround, position: "relative",zIndex:zIndex.CENTER }]}>
        {content}
        <View style={[styles.Info,{position:"relative"}]}>
          {/* anime Title */}
          <Text 
          numberOfLines={4} 
          style={{ color: color.Orange, fontFamily: font.InterBlack, fontSize: 12 }}
          onPress={() => navigation.navigate("AnimeInfo", { anime: animeData })}
          >{AnimeTitle}</Text>

          {/* episode Number and Title */}
          <View style={{ flexDirection: "row", paddingVertical: 5, paddingHorizontal: 5, }}>
            <Text style={{ color: color.White, fontFamily: font.InterMedium, fontSize: 16, }}>Episode {episodeNum}</Text>
            <Text style={{ color: color.White, fontFamily: font.PoppinsLight, fontSize: 14, flex: 1, paddingHorizontal: 5, }}>{episodeTitle}</Text>
          </View>
          {/* next/Prev/share Buttons */}
          <View style={{ flexDirection: "row", justifyContent:"space-between", marginTop: 5,position:"relative", minHeight:25}}>
            <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
            {
            
            episodeNum > 1 && 
              <TouchableOpacity style={styles.Mybtns} onPress={handlePrevEpisode}>
                <Text style={{ color: color.Orange, fontFamily: font.InterBlack}} >Previous</Text>
              </TouchableOpacity>
            }
            </View>
            <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
              <TouchableOpacity 
              onPress={handleShare}>
                <MCIcon name={"share"} size={30} color={"white"}/>
                <Text style={{color:color.White}}>Share</Text>
              </TouchableOpacity>
            </View>
            <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
            {
              episodeNum < episodes.length &&
              <TouchableOpacity style={styles.Mybtns} onPress={handleNextEpisode}>
                <Text style={{ color: color.Orange, fontFamily: font.InterBlack}}>Next</Text>
              </TouchableOpacity>
            }
            </View>

          </View>
          {/* custom bottom border */}
          <View style={{ borderBottomColor: color.White, borderBottomWidth: 0.2, marginTop: 5 }}></View>
          {
            isLoadingEpisode ? (<ActivityIndicator size="large" color={color.Orange} />)
              : (
                // <ScrollView>
                <View style={{ flex: 1, position: "relative" }}>
                  {
                    episodes.length > 12 && (
                      <View style={{ position: "absolute", right: 10, bottom: 20, zIndex: zIndex.TOP }}>
                        {
                          currentScrollIndex >= lastIndex - 2 && currentScrollIndex > 0 &&
                          <MCIcon name={"arrow-up-bold-circle-outline"} size={40} color={"white"}
                            onPress={() => scrollToEpisode(0)} />
                        }
                        {/* next/prev buttons */}
                        {
                          currentScrollIndex <= lastIndex - 10 && currentScrollIndex > 0 &&
                          <MCIcon name={"arrow-down-bold-circle-outline"} size={40} color={"white"}
                            onPress={() => scrollToEpisode(lastIndex)} />
                        }
                      </View>
                    )
                  }

                  <Text style={{ color: color.White, fontFamily: font.InterBlack, paddingVertical: 10, }}>Episodes:</Text>
                  <FlatList
                    ref={flatListRef}
                    data={episodes}
                    keyExtractor={(item, index) => `${item?.animeID}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handlePress(item)}>
                        <EpisodeCard episode={item} anime={animeData} currentEpisode={episodeNum} />
                      </TouchableOpacity>
                    )}
                    
                    windowSize={5}
                    initialNumToRender={10}
                    getItemLayout={getItemLayout}
                    onScroll={handleScroll}
                  />
                </View>
              )
          }
        </View>
      </View>

    )
  }
}
const styles = StyleSheet.create({
  backbtn: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: zIndex.CENTER,
    marginTop: 8,
    marginLeft: 8,
  },
  Info: {
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
    flex: 1,
    position: "relative",
    backgroundColor:color.DarkBackGround
    // paddingBottom:160
  },
  Mybtns: {
    padding: 8,
    backgroundColor: color.DarkBackGround2,
    minWidth: 100,
    borderWidth: 1,
    borderColor: color.Orange,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default VideoScreen