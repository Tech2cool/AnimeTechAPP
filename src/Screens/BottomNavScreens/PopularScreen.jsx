import { View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, ToastAndroid, Text, FlatList } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPopularAnime, setPagesArray } from '../../Utils/Functions';
import { MCIcon, ThemeColors } from '../../Utils';
import { Pagination, AnimeCard } from '../../components';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import { filterListItem } from '../../Utils/contstant';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

export default function PopularScreen({ navigation }) {
  const { setVideoState } = useVideoPlayer()
  const { isOnline } = useInternet()
  const [anime, setAnime] = useState([]);
  const [selected, setSelected] = useState(filterListItem[0]);
  const [filterAnime, setFilterAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [myPage, setMyPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages: [],
  });
  if (!isOnline) {
    return navigation.navigate("Downloads")
  }
  const onRefresh = useCallback(() => {
    if (!isOnline) return
    setRefreshing(true);
    fetchAnime(1);
    setMyPage(prev => ({
      ...prev,
      currentPage: 1,
    }))
    setVideoState(prev => ({
      ...prev,
      isVideoScreen: false,
    }))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchAnime = async (page) => {
    try {
      setIsLoading(true);
      // console.log("fetchPage: "+page, typeof(page))
      const req = await fetchPopularAnime(page);
      // console.log("req" + req.totalPages + typeof(req.totalPages))
      setAnime(req?.list);
      setMyPage(prev => (
        {
          ...prev,
          currentPage: page,
          totalPage: req?.totalPages,
          availPages: setPagesArray(myPage.currentPage, req?.totalPages)
        }
      ));
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("Downloads")
    } else {
      fetchAnime(1);
      setMyPage(prev => ({
        ...prev,
        currentPage: 1,
      }))
      setVideoState(prev => ({
        ...prev,
        isVideoScreen: false,
      }))
    }
    // console.log("called");
  }, [])
  const handleSorting = (selectedItem)=>{
    if(selected?.value === selectedItem?.value){
      setFilterAnime([])
      setSelected(filterListItem[0])
    }else{
      setSelected(selectedItem)
      switch(selectedItem?.value){
        case filterListItem[1]?.value:{
          //yearAsc
          // console.log("yearAsc")
          setFilterAnime(anime.sort((a,b)=>(
            a?.year - b?.year||
            parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[2]?.value:{
          //yearDesc
          // console.log("yearDesc")
          setFilterAnime(anime.sort((a,b)=>(
            b?.year - a?.year||
            parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])
          )))
          break;  
        }
        case filterListItem[3]?.value:{
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
        case filterListItem[4]?.value:{
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
          filterListItem?.map((item,i)=>{       
            return(
              <TouchableOpacity
              onPress={()=>handleSorting(item)}
              style={[{
                backgroundColor:selected?.value === item?.value ?
                color.Orange:color.DarkBackGround, 
                },styles.filterBtn]} key={`${item?.name}`}>
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

  const ListFooterComp = () => (<View style={{marginBottom:20}}>
    <Pagination myPage={myPage} setMyPage={setMyPage} fetchAnime={fetchAnime} />
  </View>)  
  const memoizedFlatList = useMemo(() => {
    // console.log("flatListed pop")
    return (
      <FlatList
        data={filterAnime?.length > 0 ? filterAnime : anime}
        keyExtractor={(item, index) => `${item.animeID}-${index}-PopularScreenFlatlist`}
        renderItem={renderItem}
        ListFooterComponent={ListFooterComp}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />)
  }, [anime, filterAnime,selected])

  if (isLoading && !refreshing) {
     return (
      <View style={styles.container}>
       <ActivityIndicator size="large" color={color.Orange} />
      </View>)
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
    flexDirection: "column"

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
    paddingVertical: 18,
    // width: 100,
    // height: 200,
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rowTextStyle: {
    fontSize: 16,
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
    fontFamily: font.NunitoBlack,
  },
  buttonStyle: {
    flex: 0,
    alignSelf:"flex-start",
    maxWidth: 180,
    // flex:1,
    backgroundColor: color.DarkBackGround,
    // borderColor:color.LighterGray,
    // borderWidth:1,
  },
  rowStyle: {
    borderColor: 'transparent'
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
  ListFooter: {
    marginBottom: 80,
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
