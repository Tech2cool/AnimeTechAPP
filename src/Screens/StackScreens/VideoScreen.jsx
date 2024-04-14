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
let lastAnimeId="";
const VideoScreen = ({ route, navigation }) => {
  console.log("rerender")
  const {episodeId, animeId, episodeNum } = route.params;
  const { isOnline } = useInternet()
  const { videoState } = useVideoPlayer();
  const { currentLang } = useLanguage();
  const flatListRef = useRef(null);
  const currentEpIndex = episodes?.findIndex((ep)=> ep?.id === episodeId)
  const lastEpIndex = episodes?.length -1;
  const [sources, setSources] = useState([]);
  const [anime, setAnime] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selected, setSelected] = useState("");
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [testing, setTesting] = useState(false);
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
  if (!isOnline) {
    return navigation.navigate("Downloads")
  }
  const myKey = `watchedList_${anime?.animeID ? anime?.animeID : animeId}`;
  const fetchAnime = async()=>{
    try {
      setIsLoadingInfo(true)
      const response = await fetchAnimeInfo(animeId)
      // console.log(response)
      setAnime(response)
    } catch (error) {
      setIsLoadingInfo(false)
      ToastAndroid.show(error.message, ToastAndroid.SHORT)
    }
  }

  const fetchEpisode = async()=>{
    try {
      setIsLoadingEpisode(true)
      const response = await fetchEpisodes(animeId)
      // console.log(response)
      setEpisodes(response)
      setIsLoadingEpisode(false)
    } catch (error) {
      setIsLoadingEpisode(false)
      ToastAndroid.show(error.message, ToastAndroid.SHORT)
    }
  }

  const fetchSource = async()=>{
    try {
      const response = await fetchSources(episodeId)
      // console.log(response)
      setSources(response)
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT)
    }
  }

  const fetchEpKitsuInfo = async(kid,epNumber)=>{
    try {
      setIsLoadingInfo(true)
      const response = await fetchEpisodeDetailsFromKitsu(kid,epNumber)
      // console.log(response)
      setKistuEpDetails(response)
      setIsLoadingInfo(false)
      setTesting(false)

    } catch (error) {
      setIsLoadingInfo(false)
      ToastAndroid.show(error.message, ToastAndroid.SHORT)
    }
  }

  useEffect(()=>{
    if (animeId !== lastAnimeId && anime.length ===0) {
      fetchAnime(); // Fetch anime details only if animeId is provided
      fetchEpisode();
      lastAnimeId= animeId
    }
  },[animeId])

  useEffect(()=>{
    if(episodeId){
      fetchSource()
    }
  },[episodeId])

  useEffect(()=>{
    fetchEpKitsuInfo(anime?.AdditionalInfo?.id,episodeNum)
    if(episodes?.length>0){
      const findCurrentEpIndex = episodes?.findIndex((ep)=> ep?.id === episodeId)
      scrollToEpisode(findCurrentEpIndex > 1 ? findCurrentEpIndex - 2 : findCurrentEpIndex||0)
    }
    setTesting(true)
  },[episodes, episodeId,isLoadingEpisode])

  useEffect(()=>{
    console.log("currentScrollIndex: "+ currentScrollIndex)
  },[currentScrollIndex])
  const getItemLayout =(data, index) => ({
    length: 130,
    offset: 130 * index,
    index,
  })

  const scrollToEpisode = (index) => {
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  }
  const handlePrevEpisode = () => {
    const currentIndex = episodes?.findIndex((episode) => episode?.id === episodeId);
    if (currentIndex !== -1 && currentIndex !== 0 && currentIndex - 1 < episodes.length) {
      const nextEpisode = episodes[currentIndex - 1]
      scrollToEpisode(currentIndex - 1)
      navigation.navigate("Video", { 
        animeId: anime?.animeID, 
        episodeId: nextEpisode?.id, 
        episodeNum: nextEpisode?.number,
      })
    }
  }
  const handleNextEpisode = () => {
    const currentIndex = episodes?.findIndex((episode) => episode?.id === episodeId);
    if (currentIndex !== -1 && currentIndex + 1 < episodes.length) {
      const nextEpisode = episodes[currentIndex + 1]
      scrollToEpisode(currentIndex + 1)
      navigation.navigate("Video", { 
        animeId: anime?.animeID, 
        episodeId: nextEpisode?.id, 
        episodeNum: nextEpisode?.number,
      })
    }
  }

  const handleShare = async () => {
    try {
      const getLink = await generateDynamicLink(
        "video",
        isValidData(anime?.animeID) ? anime?.animeID : animeId,
        episodeId,
        episodeNum,
        anime?.animeImg,
        `Episode ${episodeNum} - ${memoizedAnimeTitle}`,
        "")
      Share.share({
        message: getLink,
      })
    } catch (error) {
      // console.log("err: "+ error)
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const memoizedVideoPlayer = useMemo(()=>{
      // console.log(typeof(sources))
      // console.log(sources?.length)
      const foundURL= sources?.find(src => src?.quality === "default") ? 
      sources?.find(src => src?.quality === "default")?.url : sources[0]?.url
      return(
        <VideoPlayerr 
        vId={episodeId}
        pQualities={sources}
        url={foundURL}
        // url={sources[0]?.url}
        goback={()=>navigation.goBack()}
      />
      )
  },[sources,episodeId])

  const memoizedAnimeTitle= useMemo(()=>{
    if(currentLang === "en"){
      if(isValidData(anime?.animeTitle?.english)){
        return anime?.animeTitle?.english
      }
      else if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }
    }else{
      if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }
      else if(isValidData(anime?.animeTitle?.japanese)){
        return anime?.animeTitle?.japanese
      }
    }
  },[anime.animeTitle, currentLang])
  
  const memoizedEpisodeNumber = useMemo(()=>{
    return "Episode " +episodeNum
  },[episodeNum])

  let memoizedEpKistuInfo = useMemo(()=>{
    console.log("change kitsu")
    if(currentLang==="en"){
      if(isValidData(kistuEpDetails?.title?.english)){
        return kistuEpDetails?.title?.english
      }
      else if(isValidData(kistuEpDetails?.title?.english_jp)){
        return kistuEpDetails?.title?.english_jp
      }
    }else{
      if(isValidData(kistuEpDetails?.title?.english_jp)){
        return kistuEpDetails?.title?.english_jp
      }
      else if(isValidData(kistuEpDetails?.title?.japanese)){
        return kistuEpDetails?.title?.japanese
      }
    }
  },[kistuEpDetails, currentLang])

  const renderItem = useCallback(({item,index})=>{
    return(
      <TouchableOpacity onPress={()=>{
        navigation.navigate("Video", { 
          animeId: anime?.animeID, 
          episodeId: item?.id, 
          episodeNum: item?.number,
        })
        scrollToEpisode(index > 1 ? index - 2 : index)
      }}>
        <EpisodeCard episode={item} anime={anime} currentEpisode={parseInt(episodeNum)}/>
      </TouchableOpacity>
    )
  },[episodeId, episodeNum, currentLang, anime,episodes])

  const memoizedFlatList = useMemo(()=>{
    // console.log("flatList Rendered")
    return(
      <FlatList
      ref={flatListRef}
      data={episodes}
      keyExtractor={(item, index) => `${item?.id}-${index}`}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      windowSize={10}
      initialNumToRender={10}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      onScroll={handleScroll}
    />)
  },[episodes,episodeId,episodeNum, anime])

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / 130) * 10; // Assuming a fixed item height
    // console.log("ind" + index)
    // console.log("offset" + offsetY)
    setCurrentScrollIndex(index);
  }

  const findCurrentSeason = ()=>{
    const resp = anime?.relatedAddtional?.sequalOrPrequal?.findIndex((anim, i)=> anim?.animeID === anime?.animeID)
    return resp
  }
  const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />, [])
  const changeSeason = async(selectedItem)=>{
    try {
      const episodes = await fetchEpisodes(selectedItem.animeID, selectedItem?.AdditionalInfo?.id)
      console.log(episodes)
      if(episodes?.length <=0){
        navigation.navigate("AnimeInfo", { anime: anime })
      }else{
        navigation.navigate("Video", { 
          animeId: selectedItem?.animeID, 
          episodeId: episodes[0]?.id,
          episodeNum: episodes[0]?.number,
        })
    }

    } catch (error) {
      console.log(error)   
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
  }, [currentLang])
  const rowTextForSelection = useCallback((item, index) => {
    if(currentLang === "en"){
      if(isValidData(item?.animeTitle?.english)){
        return item?.animeTitle?.english
      }
      else if(isValidData(item?.animeTitle?.english_jp)){
        return item?.animeTitle?.english_jp
      }
    }else{
      if(isValidData(item?.animeTitle?.english_jp)){
        return item?.animeTitle?.english_jp
      }
      else if(isValidData(item?.animeTitle?.japanese)){
        return item?.animeTitle?.japanese
      }
    }
  }, [currentLang])
  
  return(
    <View style={[styles.container]}>
      {memoizedVideoPlayer}
          <View style={[styles.InfoContainer,{display:videoState.isFullscreen?"none":"flex"}]}>
          {/* episodeNumber and Title Container Start*/}
          <View style={styles.titleAndEpisodeInfoContainer}>
            <TouchableOpacity>
              <Text numberOfLines={2} style={styles.TitleText} onPress={()=> navigation.navigate("AnimeInfo", { anime: anime })}>{memoizedAnimeTitle}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:"row", gap:10}}>
              <Text style={styles.EpisodeNumberText}>{memoizedEpisodeNumber}</Text>
              <Text numberOfLines={2} style={styles.EpisodeKitsuText}>{memoizedEpKistuInfo}</Text>
            </View>
            {/* next / prev / download/ share BtnsContainer start */}
            <View style={styles.BtnsContainer}>
              <TouchableOpacity style={styles.nextPrevBtn} onPress={handlePrevEpisode}>
                <Text style={{color:color.White, fontFamily:font.OpenSansBold}}>Prev</Text>
              </TouchableOpacity>
              <View style={{flexDirection:"row", gap:15,}}>
                <TouchableOpacity style={{alignItems:"center", justifyContent:"center"}}>
                  <MCIcon name={"cloud-download"} size={25} color={color.Orange} />
                  <Text style={{ color: color.Orange }}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:"center", justifyContent:"center"}} onPress={handleShare}>
                  <MCIcon name={"share-all"} size={25} color={color.Orange} />
                  <Text style={{ color: color.Orange }}>Share</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.nextPrevBtn} onPress={handleNextEpisode}>
                <Text style={{color:color.White, fontFamily:font.OpenSansBold}}>Next</Text>
              </TouchableOpacity>
            </View>
            {/* next / prev / download/ share BtnsContainer end */}
            <View style={{borderWidth:0.5, borderColor:color.LighterGray}}></View>
            {/* Total Episode and season change dropDownn start */}
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
              <Text style={{color:color.White}}>Total Episodes: {episodes?.length}</Text>
              <SelectDropdown
                data={anime?.relatedAddtional?.sequalOrPrequal}
                renderDropdownIcon={renderDropdownIcon}
                buttonStyle={styles.buttonStyle}
                buttonTextStyle={styles.buttonTextStyle}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.rowTextStyle}
                rowStyle={styles.rowStyle}
                selectedRowTextStyle={styles.selectedRowTextStyle}
                selectedRowStyle={styles.selectedRowStyle}
                defaultValueByIndex={findCurrentSeason()!= -1?findCurrentSeason():0}
                onSelect={onSelectDropDown}
                buttonTextAfterSelection={buttonTextAfterSelection}
                rowTextForSelection={rowTextForSelection}
              />
            </View>
            {/* Total Episode and season change dropDownn end */}
          </View>
          {/* episodeNumber and Title Container END*/}
          {
            isLoadingEpisode ? (<ActivityIndicator size={30}/>):(
              <View style={{flex:1, position:"relative"}}>
                {memoizedFlatList}
                <View style={{
                  position:"absolute",
                  right:0,
                  bottom:15,
                  zIndex:zIndex.CENTER,
                  flexDirection:"column",
                  gap:10
                }}>
                <TouchableOpacity onPress={() => scrollToEpisode(0)}>
                  <MCIcon 
                  name={"arrow-up-bold-circle-outline"} 
                  size={40} color={color.White}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => scrollToEpisode(episodes?.length - 1)} >
                  <MCIcon 
                  name={"arrow-down-bold-circle-outline"} 
                  size={40} color={color.White}/>
                </TouchableOpacity>

                </View>
              </View>)
          }
            </View>


    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
    position: "relative",
  },
  InfoContainer:{
    flex:1,
    paddingVertical:10,
    paddingHorizontal:10
  },
  titleAndEpisodeInfoContainer:{
    // flex:1,
    gap:5,
    // backgroundColor:"red"
  },
  TitleText:{
    color:color.Orange,
    fontFamily:font.OpenSansBold,
    fontSize:12,
    // flex:1,
  },
  EpisodeNumberText:{
    color:color.White,
    fontFamily:font.OpenSansBold,
    fontSize:14,
  },
  EpisodeKitsuText:{
    color:color.White,
    fontFamily:font.OpenSansMedium,
    fontSize:14,
    flex:1
  },
  BtnsContainer:{
    marginTop:10,
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:2
  },
  nextPrevBtn:{
    borderColor:color.Orange, 
    borderWidth:1,
    paddingVertical:8, 
    paddingHorizontal:20, 
    borderRadius:5,
    flex:0,
    alignSelf:"flex-start"
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

export default VideoScreen