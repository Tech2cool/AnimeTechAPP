import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid, FlatList } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {fetchTopAiringAnime, setPagesArray } from '../../Utils/Functions';
import {ThemeColors, IIcon, MCIcon} from '../../Utils';
import {Pagination, AnimeCard} from '../../components';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import { filterListItem } from '../../Utils/contstant';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function TopAiringScreen({ navigation }) {
  const {setVideoState}=useVideoPlayer()
  const {isOnline} =useInternet()
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(filterListItem[0]);
  const [filterAnime, setFilterAnime] = useState([]);

  const [myPage, setMyPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages: [],
  });
  if(!isOnline){
    return navigation.navigate("Downloads")
  }
  useEffect(() => {
    if(!isOnline){
      navigation.navigate("Downloads")
    }else{
    memoizedAnimes(1);
    setMyPage(prev=>({
      ...prev,
      currentPage:1,
    }))
    setVideoState(prev=>({
      ...prev,
      isVideoScreen:false,
    }))
  }

  }, []);

  const memoizedAnimes = useMemo(() => async (page) => {
    try {
      setIsLoading(true);
      const req = await fetchTopAiringAnime(page);
      setAnime(req?.list);
      setMyPage(prev => ({
          ...prev,
          currentPage:page,
          totalPage: req?.totalPages,
          availPages: setPagesArray(myPage.currentPage, req?.totalPages)
        }));
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }, [myPage.currentPage]);

  const onRefresh = useCallback(() => {
    if(!isOnline) return
    setRefreshing(true);
    memoizedAnimes(1);

    setMyPage(prev => ({
        ...prev,
        currentPage: 1,
    }))
    setVideoState(prev=>({
      ...prev,
      isVideoScreen:false,
    }))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSorting = (selectedItem)=>{
    if(selected.value === selectedItem.value){
      setFilterAnime([])
      setSelected(filterListItem[0])
    }else{
      setSelected(selectedItem)
      switch(selectedItem?.value){
        case filterListItem[1].value:{
          //yearAsc
          console.log("yearAsc")
          setFilterAnime(anime.sort((a,b)=>(
            a?.year - b?.year||
            parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[2].value:{
          //yearDesc
          console.log("yearDesc")
          setFilterAnime(anime.sort((a,b)=>(
            b?.year - a?.year||
            parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[3].value:{
          //Ongoing
          console.log("Ongoing")
          setFilterAnime(anime.filter((an,i)=>(
            an?.status?.toLowerCase() === "current" || 
            an?.status?.toLowerCase() === "ongoing" || 
            an?.AdditionalInfo?.status?.toLowerCase() === "current" ||
            an?.AdditionalInfo?.status?.toLowerCase() === "ongoing"
          )))
          break;  
        }
        case filterListItem[4].value:{
          //completed
          // console.log("completed")
          setFilterAnime(anime.filter((an,i)=>(
            an?.status?.toLowerCase() === "finished" || 
            an?.status?.toLowerCase() === "completed"||
            an?.AdditionalInfo?.status?.toLowerCase() === "finished"||
            an?.AdditionalInfo?.status?.toLowerCase() === "completed"
          )))
          break;  
        }
        default: {
          setFilterAnime([])
          setSelected(filterListItem[0])
          // console.log("called default")
          break;
        }
      }
  
    }
  }

  const ListHeaderComponent = useMemo(() => {
    return(
      <ScrollView horizontal={true}>
        {/* <Text style={{ fontFamily:font.OpenSansBold, color:color.White }}>Filters:</Text> */}
        <View style={{gap:8, flexDirection:"row",paddingVertical:10,paddingHorizontal:5, alignItems:"center", justifyContent:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center",justifyContent:"center"}}>
          <Text style={{color:color.Orange, fontFamily:font.OpenSansBold}}>Filter:</Text>
          <MCIcon name={"chevron-right"} color={color.Orange} size={25} />
        </View>
        {
          filterListItem?.sort((a,b)=>{
            if (a.value === selected?.value) return -1; 
            return a.value
          })?.map((item,i)=>{       
            return(
              <TouchableOpacity
              onPress={()=>handleSorting(item)}
              style={[{
                backgroundColor:selected?.value === item?.value ?
                color.Orange:color.DarkBackGround, 
                },styles.filterBtn]} key={`${item?.name}-${i}`}>
                <Text style={{
                  color:color.White, 
                  fontFamily:font.OpenSansBold,
                  fontSize:14,
                  textTransform:"capitalize"}}>{item?.value}</Text>
              </TouchableOpacity>
              )
          })
        }
        </View>
      </ScrollView>
    )
  },[selected])
  
  const renderItem = useCallback(({ item, index }) =>{
    return(
      <TouchableOpacity activeOpacity={0.7}
        onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
        <AnimeCard anime={item} />
      </TouchableOpacity>)
  }, [selected, filterAnime, anime])

  const ListFooterComp = () => (<View style={{marginBottom:30}}>
    <Pagination myPage={myPage} setMyPage={setMyPage} fetchAnime={memoizedAnimes} />
  </View>)
  const memoizedFlatList = useMemo(() => {
    // console.log("flatListed pop")
    return (
      <FlatList
        data={filterAnime?.length > 0 ? filterAnime : anime}
        keyExtractor={(item, index) => `${item.animeID}-${index}-AiringScreenFlatlist`}
        renderItem={renderItem}
        ListFooterComponent={ListFooterComp}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />)
  }, [anime, filterAnime,selected])

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={color.Orange} />
      </View>
    )
  } 

  return (
      <View style={styles.container}>
        {/* {content} */}
        <View style={{ color: color.White, marginBottom:10 }}>
          <View style={{flexDirection:"row", gap:10, borderColor:color.LighterGray, borderBottomWidth:1, paddingVertical:5, alignItems:"center"}}>
            <IIcon name="arrow-back" size={25} color={color.White} onPress={()=> navigation.goBack()}/>
            <Text style={{color: color.White, fontSize:18, fontFamily:font.InterBlack,textAlign:"center", paddingBottom:5}}>Top Airing</Text>
          </View>
        </View>
        {ListHeaderComponent}
        {memoizedFlatList}
      </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // padding:10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  mcontainer: {
    marginBottom: 20,
  },
  filterBtn:{
    padding:10, 
    borderColor:color.LighterGray,
    borderWidth:1,
    borderRadius:10,
    minWidth:60,
    height:40,
    justifyContent:"center",
    alignItems:"center"
  }
})
