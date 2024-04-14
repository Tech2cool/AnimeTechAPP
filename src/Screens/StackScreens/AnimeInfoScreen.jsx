import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions, FlatList, Button, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchAnimeInfo, fetchEpisodes, isValidData } from '../../Utils/Functions';
import {ThemeColors, IIcon, MCIcon} from '../../Utils';
import { useLanguage } from '../../Context/LanguageContext';
import {EpisodeCard, MyGenrecard} from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummy_image } from '../../Utils/contstant';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import SelectDropdown from 'react-native-select-dropdown';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const LoadingArray = [<ActivityIndicator size="large" color={color.Orange} />]
const testing = [{
  name:"season",
  nameBig:"seasons",
  value:"sequalOrPrequal"
},{
  name:"movies",
  nameBig:"movies",
  value:"movies"
}, {
  name:"ova",
  nameBig:"ova's",
  value:"ova"
},{
  name:"ona",
  nameBig:"ona's",
  value:"ona"
}]
const AnimeInfoScreen = ({ route, navigation }) => {
  const { anime } = route.params;
  const {isOnline} =useInternet()

  const {setVideoState}=useVideoPlayer()
  const [episodes, setEpisodes] = useState([]);
  const [animeInfo, setAnimeInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState({
    name:"season",
    value:"sequalOrPrequal",
    nameBig:"seasons",
  });
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);
  const [lastIndex, setLastIndex] = useState(-1);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const { currentLang } = useLanguage();
  const flatListRef = useRef(null);
  if(!isOnline){
    return navigation.navigate("Downloads")
  }
  // console.log("animeINFO Rendred")
  // console.log(anime?.AdditionalInfo?.startDate.split("-")[0])

  let content;
  const AnimeTitle = useMemo(()=>{
    if (currentLang === "en") {
      if(isValidData(anime?.animeTitle?.english)){
        return anime?.animeTitle?.english
      }else if(isValidData(animeInfo?.animeTitle?.english)){
        return animeInfo?.animeTitle?.english
      }
      else if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }
      else if(isValidData(animeInfo?.animeTitle?.english_jp)){
        return animeInfo?.animeTitle?.english_jp
      }
    } else {
      if(isValidData(anime?.animeTitle?.english_jp)){
        return anime?.animeTitle?.english_jp
      }else if(isValidData(animeInfo?.animeTitle?.english_jp)){
        return animeInfo?.animeTitle?.english_jp
      }
      else if(isValidData(anime?.animeTitle?.japanese)){
        return anime?.animeTitle?.japanese
      }
      else if(isValidData(animeInfo?.animeTitle?.japanese)){
        return animeInfo?.animeTitle?.japanese
      }
    }
  
  },[currentLang,anime?.animeTitle,animeInfo?.animeTitle])
  useEffect(() => {
    const fetchEPEtc = async () => {
      try {
        setIsLoadingEpisode(true)
        const ep_req = await fetchEpisodes(anime?.animeID, anime?.AdditionalInfo?.id)
        // console.log(anime)
        // console.log(anime?.AdditionalInfo?.id)
        setEpisodes(ep_req);
        setIsLoadingEpisode(false)
      } catch (error) {
        // console.log(error)
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
        setIsLoadingEpisode(false)
        setIsLoading(false)
      }
    }
    const fetchAINFO = async () => {
      try {
        setIsLoading(true)
        const animeInfo_req = await fetchAnimeInfo(anime?.animeID)
        // console.log(animeInfo_req)
        setAnimeInfo(animeInfo_req)
        setIsLoading(false)
      } catch (error) {
        // console.log(error)
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
        setIsLoading(false)
      }
    }
    if(!isOnline){
      navigation.navigate("Downloads")
    }else{

      fetchEPEtc();
      fetchAINFO();
      setVideoState(prev=>({
        ...prev,
        isVideoScreen:false,
      }))
    }
    // console.log(anime.animeID)
    // console.log("called anime.animeID")

  }, [anime])

  // useEffect(()=>{
  //   const fetchEPEtc = async () => {
  //     try {
  //       setIsLoadingEpisode(true)
  //       const ep_req = await fetchEpisodes(animeInfo?.animeID, animeInfo?.AdditionalInfo?.id)
  //       // console.log(anime)
  //       // console.log(ep_req)
  //       setEpisodes(ep_req);
  //       setIsLoadingEpisode(false)
  //     } catch (error) {
  //       // console.log(error)
  //       ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
  //       setIsLoadingEpisode(false)
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchEPEtc()
  //   console.log("called animeinfo")
  // },[animeInfo])
  useEffect(() => {
    const lastIndex = episodes.length - 1;
    // console.log("last" + lastIndex)
    setLastIndex(lastIndex);
    // console.log(episodes.length)
  }, [episodes]);

  const scrollToEpisode = (index) => {
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };
  const getItemLayout = useCallback((data, index) => ({
    length: 120,
    offset: 120 * index,
    index,
  }),[])

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / 120); // Assuming a fixed item height
    setCurrentScrollIndex(index);
  };
  const [showMore, setShowMore] = useState(false);

  const handleEpisodeSwtich = useCallback((episode) => {
    navigation.navigate("Video", { 
      animeId: anime?.animeID, 
      episodeId: episode?.id, 
      episodeNum: episode?.number,
    })
    // console.log(anime?.animeID)
    // console.log(episode?.id)
    // console.log(episode?.number)
    // navigation.navigate("Video", { anime: anime, oneEpisode: episode })
  },[])

  const isValid = useCallback((data)=>{
    isValidData(data)
  },[])
  const ListFooterComponent = ()=>(
    <View style={{marginVertical:10}}>
      <Text style={{color:color.White, paddingVertical:10, textAlign:"center", fontFamily:font.NunitoBlack}}>End</Text>
    </View>
  )
  const onSelectDropDown = useCallback((selectedItem, index) => {
    // Update selected state with the new selected item
    setSelected(selectedItem);
  }, []);
    const buttonTextAfterSelection = useCallback((selectedItem, index) => (
    selectedItem.name
  ), [])
  const rowTextForSelection = useCallback((item, index) => (
    item.name
  ), [])
  const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />, [])
  // console.log("rernder")
  // console.log(typeof(animeInfo?.relatedAddtional))
  const memoizedImage = useMemo(()=>{
    if(isValidData(anime?.animeImg)){
      return anime?.animeImg
    }
    else if(isValidData(animeInfo?.animeImg)){
      return anime?.animeImg
    }
    else if(isValidData(anime?.AdditionalInfo?.coverImage?.original)){
      return anime?.AdditionalInfo?.coverImage?.original
    }
    else if(isValidData(anime?.AdditionalInfo?.coverImage?.large)){
      return anime?.AdditionalInfo?.coverImage?.large
    }
    else if(isValidData(anime?.AdditionalInfo?.coverImage?.small)){
      return anime?.AdditionalInfo?.coverImage?.small
    }
    else if(isValidData(anime?.AdditionalInfo?.coverImage?.tiny)){
      return anime?.AdditionalInfo?.coverImage?.tiny
    }
    else if(isValidData(animeInfo?.AdditionalInfo?.coverImage?.original)){
      return animeInfo?.AdditionalInfo?.coverImage?.original
    }
    else if(isValidData(animeInfo?.AdditionalInfo?.coverImage?.large)){
      return animeInfo?.AdditionalInfo?.coverImage?.large
    }
    else if(isValidData(animeInfo?.AdditionalInfo?.coverImage?.small)){
      return animeInfo?.AdditionalInfo?.coverImage?.small
    }
    else if(isValidData(animeInfo?.AdditionalInfo?.coverImage?.tiny)){
      return animeInfo?.AdditionalInfo?.coverImage?.tiny
    }
    else {
      return dummy_image
    }
  },[anime?.animeImg,anime?.AdditionalInfo?.coverImage, anime?.AdditionalInfo?.coverImage,animeInfo?.AdditionalInfo?.coverImage])
  const loader= (<ActivityIndicator size="large" color={color.Orange} />)
  // console.log(animeInfo.type)
  
  const ListHeaderComponent = useMemo(()=>{
    return(
      <>
      <View style={{ flex: 1, }}>
        <Image
          style={{ flex: 1, resizeMode: "cover", height: Dimensions.get("screen").height - 280 }}
          source={{ uri: memoizedImage}} />
      </View>
      <Text style={{ color: color.White, fontFamily: font.InterBlack, fontSize: 18, marginVertical: 10, paddingHorizontal: 5 }}>{AnimeTitle}</Text>
      {
        isLoading?loader:
      <View style={{ flex: 1, flexDirection: "column", gap: 5, flexWrap: "wrap" }}>
      <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", columnGap: 2, rowGap: 5 }}>
        <MyGenrecard Title={`TotalEpisodes: ${animeInfo?.totalEpisodes|| episodes?.length}`} />
        <MyGenrecard Title={`Status: ${animeInfo?.status||anime?.AdditionalInfo?.status}`} />
        {/* <MyGenrecard Title={`Year: ${animeInfo?.releasedDate}`} /> */}
        <MyGenrecard Title={`Year: ${animeInfo?.releasedDate !== 0?animeInfo?.releasedDate:anime?.AdditionalInfo?.startDate?.split("-")[0]}`} />
        <MyGenrecard Title={`${anime?.AdditionalInfo?.ageRating + " " + anime?.AdditionalInfo?.ageRatingGuide}`} />
        <MyGenrecard Title={`${animeInfo?.type || anime?.type}`} />
      </View>
      <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", gap: 2 }}>
        {animeInfo?.genres?.map((genre, i) => (
          <MyGenrecard Title={genre} key={i} />
        ))}
      </View>
      {/* Description */}
      <View style={{ flex: 1, padding: 5 }}>
        <Text numberOfLines={showMore ? undefined : 4} style={{ color: color.LightGray }}>{isValid(animeInfo?.synopsis)?animeInfo?.synopsis:anime?.AdditionalInfo?.description}</Text>
        <TouchableOpacity style={{
          flex: 0, alignSelf: "center", color: color.White,
          backgroundColor: color.White,
          borderRadius: 10,
          borderColor: color.AccentBlue, borderWidth: 2, marginVertical: 5,
        }} onPress={() => setShowMore(!showMore)}>
          <Text style={{
            color: color.AccentBlue, textAlign: "center", paddingVertical: 8,
            paddingHorizontal: 10, fontWeight: "600"
          }}>{showMore ? 'Show Less' : 'Show More'}</Text>
        </TouchableOpacity>
      </View>
  
      </View>
      }

      <View>
        <View style={{flex:1, flexDirection:"column",gap:10}}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:5}}>
            <Text style={{fontSize:16, fontWeight:"600", color:color.White, textTransform:"capitalize"}}>{selected?.nameBig}</Text>
            <SelectDropdown
              data={testing}
              renderDropdownIcon={renderDropdownIcon}
              buttonStyle={styles.buttonStyle}
              buttonTextStyle={styles.buttonTextStyle}
              dropdownStyle={styles.dropdownStyle}
              rowTextStyle={styles.rowTextStyle}
              rowStyle={styles.rowStyle}
              selectedRowTextStyle={styles.selectedRowTextStyle}
              selectedRowStyle={styles.selectedRowStyle}
              // defaultValue={"1080P"}
              defaultValueByIndex={0}
              onSelect={onSelectDropDown}
              buttonTextAfterSelection={buttonTextAfterSelection}
              rowTextForSelection={rowTextForSelection}
            />
  
          </View>
  
          <FlatList 
            data={animeInfo?.relatedAddtional && animeInfo?.relatedAddtional[selected?.value]}
            horizontal
            ListEmptyComponent={()=>(<><Text>No Related {selected.nameBig} found</Text></>)}
            renderItem={({item,index})=>{
              return(
                <TouchableOpacity onPress={()=> navigation.navigate("AnimeInfo", { anime: item })}>
                <View style={{
                  marginHorizontal:10, 
                  borderColor:color.LighterGray, 
                  borderWidth:1, 
                  borderRadius:10, 
                  backgroundColor:animeInfo?.animeID === item?.animeID?color.AccentBlue:color.DarkBackGround,
                  alignItems:"center",
                  width:130,
                  Height:200,
                  overflow:"hidden"}}>
                  <Image source={{uri:item?.animeImg}} style={{width:130, height:140, resizeMode:"cover"}} />
                  <Text numberOfLines={2} style={{flex:1, color:color.White, fontFamily:font.OpenSansMedium}}>{item?.animeTitle?.english||item?.animeTitle?.english_jp}</Text>
                  {
                    item?.AdditionalInfo?.subtype === animeInfo?.AdditionalInfo?.subtype ? (
                      <Text style={{color:item?.isSequal?color.AccentGreen:color.Yellow, fontFamily:font.OpenSansBold}}>{item?.animeID === anime?.animeID?"Currently on":(item?.isSequal?"Sequel":"Prequel")}</Text>
                      ):(
                      <Text style={{color:item?.isSequal?color.AccentGreen:color.Red, fontFamily:font.OpenSansBold, textTransform:"capitalize"}}>{item?.AdditionalInfo?.subtype}</Text>
                    )
                  }
                </View>
                </TouchableOpacity>
              )
            }}
          />
            
          </View>
  
      </View>
      <View style={{ borderBottomColor: color.White, borderBottomWidth: 0.2, marginTop: 20, }}></View>
      <Text style={{ color: color.White, fontFamily: font.InterBlack, fontSize: 16, marginVertical: 5 }}>Episodes: </Text>
    </>
    )
  },[selected,memoizedImage,animeInfo,anime,showMore,isLoading])
    
  if (isLoading) {
    content = <ActivityIndicator size="large" color={color.Orange} />
  } 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1, width: "100%", position: "absolute", top: 0, zIndex: 20,
        backgroundColor: 'rgba(45, 45, 45, 0.4)', padding: 5
      }}>
        <IIcon name={"arrow-back"} size={25} color={color.White} onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.Info}>
        {
          episodes.length > 12 && (
            <View style={{ position: "absolute", right: 10, bottom: 20, zIndex: 20 }}>
              {
                currentScrollIndex >= 20 && currentScrollIndex > 0 &&
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

        {
      <FlatList
      ref={flatListRef}
      data={isLoadingEpisode ? LoadingArray : episodes}
      keyExtractor={(item, index) => `${item.animeID}_${index}`}
      renderItem={({ item, index }) => (
        <View>
          {
            isLoadingEpisode ? <ActivityIndicator size="large" color={color.Orange} /> :
              <TouchableOpacity onPress={() => handleEpisodeSwtich(item)}>
                <EpisodeCard episode={item} anime={animeInfo} />
              </TouchableOpacity>
          }
        </View>
      )}
      maxToRenderPerBatch={10}
      // updateCellsBatchingPeriod={30} //(in milliseconds)
      windowSize={5}
      getItemLayout={getItemLayout}
      onScroll={handleScroll}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
    />
        }
      </View>
    </SafeAreaView>
  )
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
    // paddingTop:20, 
    paddingHorizontal: 5,
    flexDirection: "column",
    flex: 1,
    backgroundColor: color.DarkBackGround,
    position: "relative",
  },
  rowTextStyle: {
    fontSize: 14,
    color: color.White,
    textTransform: "uppercase",
  },
  selectedRowTextStyle: {
    fontSize: 16,
    color: color.White,
    textTransform: "uppercase",
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: color.DarkBackGround,
    elevation: 10,
    borderColor: color.LighterGray2,
    borderWidth: 0.2,
  },
  buttonTextStyle: {
    color: color.Orange,
    textTransform: "uppercase",
    fontSize:14,
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    width: 120,
    backgroundColor: color.DarkBackGround,
  },
  rowStyle: {
    borderColor: 'transparent'
  },
  selectedRowStyle: {
    backgroundColor: color.Orange
  },

})

export default AnimeInfoScreen