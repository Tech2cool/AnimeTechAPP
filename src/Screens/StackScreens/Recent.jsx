import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid, FlatList, Text } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLatestAnime, setPagesArray } from '../../Utils/Functions';
import ThemeColors from '../../Utils/ThemeColors';
import AnimeCard from '../../components/AnimeCard';
import Pagination from '../../components/Pagination';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import { filterListItem } from '../../Utils/contstant';
import { MCIcon } from '../../Utils';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function Recent({ navigation }) {
  const {isOnline} =useInternet()

  const {setVideoState}=useVideoPlayer()
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
  const onRefresh = useCallback(() => {
    if(!isOnline) return
    setRefreshing(true);
    fetchAnime(1);
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

  let content;
  const fetchAnime = async (pagee) => {
    try {
      setIsLoading(true);
      const req = await fetchLatestAnime(pagee);
      setAnime(req?.list);
      setMyPage(prev => ({
          ...prev,
          currentPage: pagee,
          totalPage: req?.totalPages,
          availPages: setPagesArray(myPage.currentPage, req?.totalPages)
        }));
      setIsLoading(false);
    } catch (error) {
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(!isOnline){
      navigation.navigate("Downloads")
    }else{

    fetchAnime(1);
    setMyPage(prev => ({
      ...prev,
      currentPage: 1,
    }))
    setVideoState(prev=>({
      ...prev,
      isVideoScreen:false,
    }))
  }

  }, [])
  const handleSorting = (selectedItem)=>{
    setSelected(selectedItem)
    if(selected.value === selectedItem.value){
      setFilterAnime([])
      setSelected(filterListItem[0])
    }else{
      switch(selectedItem?.value){
        case filterListItem[1].value:{
          //yearAsc
          // console.log("yearAsc")
          setFilterAnime(anime.sort((a,b)=>(
            a?.year - b?.year||
            parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[2].value:{
          //yearDesc
          // console.log("yearDesc")
          setFilterAnime(anime.sort((a,b)=>(
            b?.year - a?.year||
            parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[3].value:{
          //Ongoing
          // console.log("Ongoing")
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
    <Pagination myPage={myPage} setMyPage={setMyPage} fetchAnime={fetchAnime} />
  </View>)
  const memoizedFlatList = useMemo(() => {
    // console.log("flatListed pop")
    return (
      <FlatList
        data={filterAnime?.length > 0 ? filterAnime : anime}
        keyExtractor={(item, index) => `${item.animeID}-${index}-RecentScreenFlatlist`}
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
        {ListHeaderComponent}
        {memoizedFlatList}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // padding:10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  mcontainer: {
    marginBottom: 20,
  },
  BtnContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  currentPage: {
    borderRadius: 99,
    backgroundColor: color.DarkBackGround,
    borderWidth: 5,
    borderColor: color.White,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  myBtn: {
    paddingVertical: 5,
    // flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myBtn2: {
    // paddingVertical: 5,
    // padding: 5,
    // flex: 1,
    // paddingHorizontal: 5,
    backgroundColor: '#3498db',
    // borderRadius: 8,
    // gap:5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
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
