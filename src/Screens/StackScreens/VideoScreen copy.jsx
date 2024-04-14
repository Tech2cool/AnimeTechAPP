import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, ToastAndroid, Share } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors';
import VideoPlayerr from '../../components/VideoPlayer';
import { fetchEpisodeDetailsFromKitsu, fetchEpisodes, fetchSources, getAsynStorageData, storeAsynStorageData, isValidData, buildLink, fetchAnimeInfo, generateDynamicLink } from '../../Utils/Functions';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useLanguage } from '../../Context/LanguageContext';
import EpisodeCard from '../../components/EpisodeCard';
import { zIndex } from '../../Utils/contstant';
import DownloadCard from '../../components/DownloadCard';
import { useInternet } from '../../Context/InternetContext';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
let watchCout = 1;
const { height: SCREEN_HIEGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HIEGHT + 50;

const VideoScreenOld = ({ route, navigation }) => {
  const { anime, oneEpisode, animeId } = route.params;
  const { isOnline } = useInternet()
  const [sources, setSources] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [animeData, setAnimeData] = useState({});
  const [episodeId, setEpisodeId] = useState(null);
  const [episodeNum, setEpisodeNum] = useState(null);
  const [selected, setSelected] = useState("");
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadCard, setShowDownloadCard] = useState(false);
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false);
  const { videoState } = useVideoPlayer();
  const { currentLang } = useLanguage();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [lastIndex, setLastIndex] = useState(-1);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const epItem = {
    id: episodeId,
    number: episodeNum,
  }
  if (!isOnline) {
    return navigation.navigate("Downloads")
  }
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

  let content;
  const AnimeTitle = useMemo(()=>{
    if (currentLang === "en") {
      if(isValidData(animeData?.animeTitle?.english)){
        return animeData?.animeTitle?.english
      }else if(isValidData(animeData?.animeTitle?.english_jp)){
        return animeData?.animeTitle?.english_jp
      }else if(isValidData(anime?.animeTitle?.english)){
        return anime?.animeTitle?.english
      }else if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }
    } else {
      if(isValidData(animeData?.animeTitle?.english_jp)){
        return animeData?.animeTitle?.english_jp
      }else if(isValidData(animeData?.animeTitle?.japanese)){
        return animeData?.animeTitle?.japanese
      }else if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }else if(isValidData(anime?.animeTitle?.japanese)){
        return anime?.animeTitle?.japanese
      }
    }
  
  },[anime,animeData, currentLang])

  const episodeTitle = useMemo(()=>{
    if (currentLang === "en") {
      if(isValidData(kistuEpDetails?.title?.english)){
        return " - " +kistuEpDetails?.title?.english
      }
      else if(isValidData(kistuEpDetails?.title?.english_jp)){
        return " - " +kistuEpDetails?.title?.english_jp
      }
    }
    else {
      if(isValidData(kistuEpDetails?.title?.english_jp)){
        return " - " +kistuEpDetails?.title?.english_jp
      }
      else if(isValidData(kistuEpDetails?.title?.japanese)){
        return " - " +kistuEpDetails?.title?.japanese
      }    
    }
  },[kistuEpDetails])

  // if (kistuEpDetails.season) season = `S${kistuEpDetails?.season} `;

  const myKey = `watchedList_${animeData?.animeID ? animeData?.animeID : animeId}`;

  useEffect(() => {
    let eid, eNum;
    if (isValidData(oneEpisode?.id)) {
      eid = oneEpisode?.id
    } else {
      eid = anime?.episodeId
    }

    if (isValidData(oneEpisode?.number)) {
      eNum = oneEpisode?.number
    } else {
      eNum = anime?.episodeNum
    }

    setEpisodeId(eid);
    setEpisodeNum(eNum);
    // console.log("useeffect setepnum + id")
  }, [animeData?.episodeId,anime?.episodeId, animeData?.episodeNum, oneEpisode])

  useEffect(() => {
    const fetchAnimeDetailss = async () => {
      const req = await fetchAnimeInfo(anime?.animeID);
      // console.log(req)
      setAnimeData(req);
    }
    if (isValidData(anime)) {
      // setAnimeData(anime);
      // console.log(anime)
      fetchAnimeDetailss();
      // console.log("animeId: "+ animeId)  
    }
  }, [anime])

  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("Downloads")
    } else {
      if (isValidData(animeId)) {
        const fetchAnimeDetailss = async () => {
          const req = await fetchAnimeInfo(animeId);
          // console.log(req)
          setAnimeData(req);
        }
        fetchAnimeDetailss();
        // console.log("animeId: "+ animeId)  
      }
    }

  }, [animeId])

  // useEffect(()=>{
  //   console.log(epAddtional[0])
  // },[epAddtional])

  const memoizedFetchSources = useMemo(() => async () => {
    try {
      setIsLoading(true);
      const req = await fetchSources(episodeId);
      setSources(req);
      const kitsuReq = await fetchEpisodeDetailsFromKitsu(animeData?.AdditionalInfo?.id, episodeNum);
      setKistuEpDetails(kitsuReq);
      setIsLoading(false);
      setIsLoadingAll(false)

    } catch (error) {
      setIsLoading(false);
      setIsLoadingAll(false)
      
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }, [episodeId, episodeNum, animeData]);

  // This effect will run when episodeId, episodeNum, or anime changes
  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("Downloads")
    } else {
      memoizedFetchSources();
    }
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
      setIsLoadingAll(false)

    } catch (error) {
      ToastAndroid.show("Error:" + error, ToastAndroid.SHORT)
      // console.log(error)
      setIsLoadingEpisode(false)
      setIsLoadingAll(false)

    }
  }, [animeData?.animeID, anime?.animeID, animeId]);

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


  const scrollToEpisode = useCallback((index) => {
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  }, [])
  const getItemLayout = useCallback((data, index) => ({
    length: 120,
    offset: 120 * index,
    index,
  }), [])

  useEffect(() => {

    const delay = setTimeout(() => {
      scrollToEpisode(currentIndex > 1 ? currentIndex - 2 : currentIndex);
    }, 500);
    return () => clearTimeout(delay);
  }, [currentIndex, episodeNum, !videoState.isFullscreen, !isLoading]);

  const handleEpisodeSwtich = useCallback((episode) => {
    setEpisodeId(episode?.id);
    setEpisodeNum(episode?.number)
  }, [])

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / 100) * 10; // Assuming a fixed item height
    // console.log("ind" + index)
    // console.log("offset" + offsetY)
    setCurrentScrollIndex(index);
  })
  const handleShare = async () => {
    try {
      const getLink = await generateDynamicLink(
        "video",
        isValidData(animeData?.animeID) ? animeData?.animeID : animeId,
        episodeId,
        episodeNum,
        animeData?.animeImg,
        `Episode ${episodeNum} - ${AnimeTitle}`,
        "")
      Share.share({
        message: getLink,
      })
    } catch (error) {
      // console.log("err: "+ error)
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const handleGoBack = () => {
    if (isValidData(animeId)) {
      navigation.navigate("HomeStack")
    } else {
      navigation.goBack()
    }
  }
  const handlePress = useCallback((episode) => {
    handleEpisodeSwtich(episode);
  }, [])

  // const memoizedRenderItem = useMemo(()=>(
  //   ({ item }) => (
  //     <TouchableOpacity onPress={() => handlePress(item)}>
  //       <EpisodeCard episode={item} anime={animeData} currentEpisode={episodeNum} />
  //     </TouchableOpacity>
  //   )
  // ),[episodeNum, episodeId,handlePress])
  const memoizedRenderItem = useCallback(({ item }) => {
      // console.log("V RenderItem Rerednderd2")
      return (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <EpisodeCard episode={item} anime={animeData} currentEpisode={episodeNum} />
        </TouchableOpacity>
      )
    },[handlePress, animeData, episodeNum, episodeId]);
  const memoizedFlatList = useMemo(() => {
    // console.log("V FlatList Rerednderd")
    return (
      <FlatList
        // key={`episodeCardVideoFlatList`}
        ref={flatListRef}
        data={episodes}
        keyExtractor={(item, index) => `${item?.id}-${index}`}
        renderItem={memoizedRenderItem}
        windowSize={5}
        initialNumToRender={5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        getItemLayout={getItemLayout}
        onScroll={handleScroll}
      />
    )
  }, [episodes, episodeId])

  const handleDownload = () => {
    setShowDownloadCard(!showDownloadCard)
  }
  const findCurrentSeason = ()=>{
    const resp = animeData?.relatedAddtional?.sequalOrPrequal?.findIndex((anim, i)=> anim?.animeID === animeData?.animeID)
    return resp
  }
  const changeSeason = async(selectedItem)=>{
    try {
      setIsLoadingAll(true)
      
      const episodes = await fetchEpisodes(selectedItem.animeID, selectedItem?.AdditionalInfo?.id)
      // console.log(episodes[0])
      navigation.navigate("Video", { animeId: selectedItem.animeID, oneEpisode: episodes[0]})
      // setIsLoadingAll(false)
      
    } catch (error) {
      // console.log(error)   
      setIsLoadingAll(false)
    }
  }
  const onSelectDropDown = useCallback((selectedItem, index) => {
    setSelected(selectedItem)
    changeSeason(selectedItem)
  }, [selected])
  const buttonTextAfterSelection = useCallback((selectedItem, index) => {
    if(currentLang === "en"){
      return selectedItem?.animeTitle?.english
    }else{
      return selectedItem?.animeTitle?.english_jp
    }
  }, [])
  const rowTextForSelection = useCallback((item, index) => {
    if(currentLang === "en"){
      return item?.animeTitle?.english
    }else{
      return item?.animeTitle?.english_jp
    }
  }, [])
  const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />, [])

    // if(isLoadingAll){
    //   return(<View style={[styles.container]}>
    //     <ActivityIndicator size="large" color={color.Orange} />
    //     </View>)
    // }

  if (isLoading) {
    content = <View style={{ minHeight: 180, justifyContent: "center", alignItems: "center", backgroundColor: color.Black, zIndex:zIndex.TOP+2 }}>
      <ActivityIndicator size="large" color={color.Orange} />
    </View>
  } else {
    content = sources && sources?.length > 0 ? (

      <VideoPlayerr
        vId={episodeId}
        pQualities={sources}
        // url={sources?.find(src => src?.quality === "default") ? sources?.find(src => src.quality === "default")?.url : sources[0]?.url}
        url={sources?.find(src => src?.quality === "default") ? sources?.find(src => src.quality === "default")?.url : sources[0]?.url}
        goback={handleGoBack}
      />
    ) : (
      <View style={{
        minHeight: 180, justifyContent: "center", alignItems: "center",
        backgroundColor: color.DarkBackGround
      }} >
      </View>
    )
  }
  
  const translateY = useSharedValue(0)
  const gesture = Gesture.Pan()
    .onStart(() => { })
    .onUpdate((e) => {
      translateY.value = e.translationY
      // console.log(e.translationY)
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HIEGHT / 2) {
        translateY.value = withTiming(-SCREEN_HIEGHT)
      }
    })
    .onTouchesDown(() => {
      // console.log("touchdown")
    })
  const rVideoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    }
  })
  useEffect(() => {
    translateY.value = 0
  }, [])
  // if (videoState.isFullscreen) {
  //   return (
  //     <View style={[{ flex: 1, position: "relative", backgroundColor: color.DarkBackGround }]}>
  //       {content}
  //     </View>
  //   )
  // }
  // else {
  return (
    <View style={[styles.container]}>
      {content}
      <View style={[styles.Info, { display: videoState.isFullscreen ? "none" : "flex" }]}>
        {/* anime Title */}
        <Text
          numberOfLines={4}
          style={styles.Title}
          onPress={() => navigation.navigate("AnimeInfo", { anime: animeData })}
        >{AnimeTitle}</Text>

        {/* episode Number and Title */}
        <View style={{ flexDirection: "row", paddingVertical: 5, paddingHorizontal: 5, }}>
          <Text style={{ color: color.White, fontFamily: font.InterMedium, fontSize: 16, }}>Episode {episodeNum}</Text>
          <Text style={{ color: color.White, fontFamily: font.PoppinsLight, fontSize: 14, flex: 1, paddingHorizontal: 5, }}>{episodeTitle}</Text>
        </View>
        {/* next/Prev/share Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, position: "relative", minHeight: 25 }}>
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            {

              episodeNum > 1 &&
              <TouchableOpacity style={styles.Mybtns} onPress={handlePrevEpisode}>
                <Text style={{ color: color.Orange, fontFamily: font.InterBlack }} >Previous</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={handleDownload}>
              <MCIcon name={"cloud-download"} size={30} color={color.Orange} />
              <Text style={{ color: color.Orange }}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={handleShare}>
              <MCIcon name={"share-all"} size={30} color={color.Orange} />
              <Text style={{ color: color.Orange }}>Share</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            {
              episodeNum < episodes.length &&
              <TouchableOpacity style={styles.Mybtns} onPress={handleNextEpisode}>
                <Text style={{ color: color.Orange, fontFamily: font.InterBlack }}>Next</Text>
              </TouchableOpacity>
            }
          </View>

        </View>
        {/* custom bottom border */}
        <View style={styles.customBottomBorder}></View>
        {
          isLoadingEpisode ? (<ActivityIndicator size="large" color={color.Orange} />)
            : (
              // <ScrollView>
              <View style={{ flex: 1, position: "relative", zIndex: zIndex.TOP }}>
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
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between",position:"relative" }}>
                  <Text style={{ color: color.White, fontFamily: font.OpenSansBold, paddingVertical: 10, fontSize:14 }}>Total Episodes: {episodes.length}</Text>
                  <SelectDropdown
                    data={animeData?.relatedAddtional?.sequalOrPrequal}
                    renderDropdownIcon={renderDropdownIcon}
                    buttonStyle={styles.buttonStyle}
                    buttonTextStyle={styles.buttonTextStyle}
                    dropdownStyle={styles.dropdownStyle}
                    rowTextStyle={styles.rowTextStyle}
                    rowStyle={styles.rowStyle}
                    selectedRowTextStyle={styles.selectedRowTextStyle}
                    selectedRowStyle={styles.selectedRowStyle}
                    // defaultValue={"1080P"}
                    defaultValueByIndex={findCurrentSeason()!= -1?findCurrentSeason():0}
                    onSelect={onSelectDropDown}
                    buttonTextAfterSelection={buttonTextAfterSelection}
                    rowTextForSelection={rowTextForSelection}
                  />
                </View>
                {memoizedFlatList}
              </View>
            )
        }
      </View>
      {
        showDownloadCard && (
          <View style={styles.showDownloadContainer}>
            <DownloadCard
              showDownloadCard={showDownloadCard}
              setShowDownloadCard={setShowDownloadCard}
              episodes={episodes}
              episodeId={episodeId}
              episodeNum={episodeNum}
              anime={animeData}
              sources={sources}
              item={epItem}
            />
          </View>
        )
      }
    </View>
  )
  // }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    position: "relative",
    zIndex: zIndex.CENTER,
  },
  showDownloadContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    width: "100%",
  },
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
    backgroundColor: color.DarkBackGround,
    // paddingBottom:160

  },
  Mybtns: {
    padding: 8,
    backgroundColor: color.DarkBackGround2,
    minWidth: 90,
    borderWidth: 1,
    borderColor: color.Orange,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  Title: {
    color: color.Orange,
    fontFamily: font.InterBlack,
    fontSize: 12,
  },
  customBottomBorder: {
    borderBottomColor: color.White,
    borderBottomWidth: 0.2,
    marginTop: 5,
  },

  selectedRowTextStyle: {
    color: color.White,
    fontSize: 12,
    fontFamily:font.OpenSansBold

    // textTransform: "uppercase",
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: color.DarkBackGround,
    elevation: 10,
    borderColor: color.LighterGray2,
    borderWidth: 0.2,
    flex:1
  },
  buttonTextStyle: {
    color: color.Orange,
    // textTransform: "uppercase",
    fontSize:14,
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    flex:1,
    // width: Dimensions.get("window").width,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent',
    // flex:1,
    // width:Dimensions.get("window").width,
  },
  rowTextStyle: {
    flex:1,
    fontSize: 12,
    color: color.White,
    fontFamily:font.OpenSansBold
    // textTransform: "uppercase",
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },

})

export default VideoScreenOld