import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, ToastAndroid } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors';
import VideoPlayerr from '../../components/VideoPlayer';
import { fetchEpisodeDetailsFromKitsu, fetchEpisodes, fetchSources, getAsynStorageData, storeAsynStorageData,filterNUE } from '../../Utils/Functions';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useLanguage } from '../../Context/LanguageContext';
import EpisodeCard from '../../components/EpisodeCard';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
let watchCout = 1;

const VideoScreen = ({ route, navigation }) => {
  const { anime, oneEpisode } = route.params;
  const [sources, setSources] = useState([]);
  const [episodes, setEpisodes] = useState([]);
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
    AnimeTitle = (anime?.animeTitle?.english) || 
                 (anime?.animeTitle?.english_jp)
  } else {
    AnimeTitle = (anime?.animeTitle?.english_jp) || 
                 (anime?.animeTitle?.japanese)
  }

  if (filterNUE(kistuEpDetails?.title?.english)||
    filterNUE(kistuEpDetails?.title?.english_jp)||
    filterNUE(kistuEpDetails?.title?.japanese)) {
    if (currentLang === "en") {
      episodeTitle = " - " + ((kistuEpDetails?.title?.english) || (kistuEpDetails?.title?.english_jp))
    }
    else {
      episodeTitle = (kistuEpDetails?.title?.english_jp) || (kistuEpDetails?.title?.japanese)
    }
    // console.log("true")
  }
  // if (kistuEpDetails.season) season = `S${kistuEpDetails?.season} `;
  
  const myKey = `watchedList_${anime.animeID}`;

  useEffect(() => {
    let eid, eNum;
    if (oneEpisode?.id !== undefined) {
      eid = oneEpisode?.id
    } else {
      eid = anime?.episodeId
    }

    if (oneEpisode?.number !== undefined) {
      eNum = oneEpisode?.number
    } else {
      eNum = anime?.episodeNum
    }

    setEpisodeId(eid);
    setEpisodeNum(eNum);
    // console.log("useeffect setepnum + id")
  }, [anime?.episodeId, oneEpisode?.id, anime?.episodeNum, oneEpisode?.number])


  const memoizedFetchSources = useMemo(() => async () => {
    try {
      setIsLoading(true);
      const req = await fetchSources(episodeId);
      setSources(req);
      const kitsuReq = await fetchEpisodeDetailsFromKitsu(anime?.AdditionalInfo?.id, episodeNum);
      setKistuEpDetails(kitsuReq);
    } catch (error) {
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  }, [episodeId, episodeNum, anime]);

  // This effect will run when episodeId, episodeNum, or anime changes
  useEffect(() => {
    memoizedFetchSources();
  }, [memoizedFetchSources]);

  const watchList = useMemo(() => {
    return {
      anime: anime,
      episodeId: episodeId,
      watchingEpisode: episodeNum,
      watchedTime: videoState?.currentTime,
      duration: videoState?.duration,
      wannaDelete: false,
      timestamp: new Date().getTime(),
    }
  }, [anime, episodeId, episodeNum, videoState?.currentTime, videoState?.duration])

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
      // console.log(anime?.animeID, anime?.AdditionalInfo?.id);
      const ep_req = await fetchEpisodes(anime?.animeID, anime?.AdditionalInfo?.id)
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
  }, [anime.animeID]);

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
        />
    ):(
      <View style={{ minHeight: 180, justifyContent: "center", alignItems: "center", 
          backgroundColor: color.DarkBackGround }} >
      </View>
    )
  }

  if (videoState.isFullscreen) {
    return (
      <View style={{ flex: 1, position: "relative", backgroundColor: color.DarkBackGround}}>
        {content}
      </View>
    )
  }
  else {
    return (
      <View style={{ flex: 1, backgroundColor: color.DarkBackGround, position: "relative" }}>
        {/* <View style={{ minHeight: 180, backgroundColor: color.DarkBackGround }}> */}
          {content}
        {/* </View> */}
        <View style={styles.Info}>
          <Text numberOfLines={4} style={{ color: color.Orange, fontFamily: font.InterBlack, fontSize: 12 }}>{AnimeTitle}</Text>

          <View style={{ flexDirection: "row", paddingVertical: 5, paddingHorizontal: 5, }}>
            <Text style={{ color: color.White, fontFamily: font.InterMedium, fontSize: 16, }}>Episode {episodeNum}</Text>
            <Text style={{ color: color.White, fontFamily: font.PoppinsLight, fontSize: 14, flex: 1, paddingHorizontal: 5, }}>{episodeTitle}</Text>
          </View>

          {/* <View style={{ borderBottomColor: color.White, borderBottomWidth: 0.2, marginTop: 20 }}></View> */}
          <View style={{ flexDirection: "row", justifyContent:episodeNum >1?"space-between": "flex-end", marginTop: 5 }}>
            {
              episodeNum > 1 && 
              <TouchableOpacity style={styles.Mybtns}>
                <Text style={{ color: color.Orange, fontFamily: font.InterBlack }} onPress={handlePrevEpisode}>Previous</Text>
              </TouchableOpacity>
            }
            {
              episodeNum < episodes.length &&
              <TouchableOpacity style={styles.Mybtns} onPress={handleNextEpisode}>
              <Text style={{ color: color.Orange, fontFamily: font.InterBlack }}>Next</Text>
              </TouchableOpacity>
            }

          </View>
          <View style={{ borderBottomColor: color.White, borderBottomWidth: 0.2, marginTop: 5 }}></View>

          {
            isLoadingEpisode ? (<ActivityIndicator size="large" color={color.Orange} />)
              : (
                // <ScrollView>
                <View style={{ flex: 1, position: "relative" }}>
                  {
                    episodes.length > 12 && (
                      <View style={{ position: "absolute", right: 10, bottom: 20, zIndex: 50 }}>
                        {
                          currentScrollIndex >= lastIndex - 2 && currentScrollIndex > 0 &&
                          <MCIcon name={"arrow-up-bold-circle-outline"} size={40} color={"white"}
                            onPress={() => scrollToEpisode(0)} />
                        }
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
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => handleEpisodeSwtich(item)}>
                        <EpisodeCard episode={item} anime={anime} currentEpisode={episodeNum} />
                      </TouchableOpacity>
                    )}
                    windowSize={5} // Adjust this value
                    initialNumToRender={10} // Adjust this value    
                    getItemLayout={getItemLayout}
                    onScroll={handleScroll}

                  />
                  {/* <Text style={{ color: color.White, textAlign: "center", fontWeight: "bold" }}>...End...</Text> */}
                </View>
                // </ScrollView>
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
    zIndex: 20,
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