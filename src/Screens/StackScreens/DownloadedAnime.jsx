import { View, Text, ScrollView, RefreshControl, ToastAndroid, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeColors from '../../Utils/ThemeColors';
import WatchListCard from '../../components/WatchListCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useInternet } from '../../Context/InternetContext';
import DownloadCardPageCard from '../../components/DownloadCardPageCard';
import { getAsynStorageData } from '../../Utils/Functions';
import { FFmpegKit } from 'ffmpeg-kit-react-native';

const myWatchListKey = "download_";
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const DownloadedAnime = ({ route, navigation }) => {
  // const { anime, episodeId, watchingEpisode, watchedTime, duration } = route.params;
  const [rawData, setRawData] = useState([]);
  const { isOnline } = useInternet()
  const [refreshing, setRefreshing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => { setRawData(res); })
      .catch(err => { ToastAndroid.show("Error:" + err, ToastAndroid.SHORT) })

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  if (!isOnline) {
    return navigation.navigate("Downloads")
  }
  const getAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));
      const watchedEpisodes = await AsyncStorage.multiGet(watchedEpisodeKeys);
      const sortedWatchedEpisodes = watchedEpisodes
        .map(([key, value]) => ({ Id: key, value: JSON.parse(value) }))
      return sortedWatchedEpisodes
    } catch (error) {
      return [];
    }
  };

  const DeleteAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));

      AsyncStorage.multiRemove(watchedEpisodeKeys, (error) => { })
      setRawData([])
      return { message: "deleted all Selected Data" }
    } catch (error) {
      ToastAndroid.show("Error:" + error, ToastAndroid.SHORT)
      // console.error('Error retrieving watched episodes:', error);
      return [];
    }
  };
  const fetchData= ()=>{
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => {
        // console.log(res)
        setRawData(res);
      })
      .catch(err => {
        ToastAndroid.show("Error:" + err, ToastAndroid.SHORT)
      })

  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleSingleDelete = async (itemId, AnimeTitle) => {
    setRawData((prevData) => prevData.filter((item) => item?.mainId !== itemId));
    // console.log(itemId)
    await AsyncStorage.removeItem(itemId);
    ToastAndroid.show(`Deleted Succesfully ${AnimeTitle}`, ToastAndroid.SHORT)
  };


  const handleDeleteALL = () => {
    DeleteAllWatchedEpisodes(myWatchListKey)
      .then(res => {
        // console.log(res)
        ToastAndroid.show(`WatchList Deleted Succesfully`, ToastAndroid.SHORT)

        setRawData([])
      })
      .catch(err => {
        // console.log(err)
        ToastAndroid.show("Error:" + err, ToastAndroid.SHORT)
      })
  }
  const handleNaviVideo = useCallback((item)=>{
    navigation.navigate("OfflineVideo",{
      url:item?.value?.url, 
      episode:item?.value?.item, 
      quality:item?.value?.quality, 
      anime:item?.value?.anime,
      status:item?.value?.status,
      // id:item?.Id, 
    })
  })
  const renderItem = useCallback(({ item, index }) => (
    
    <TouchableOpacity style={{ flex: 1 }} onPress={()=>handleNaviVideo(item)}>
      <DownloadCardPageCard data={item} handleSingleDelete={handleSingleDelete} 
      setDownloaded={setDownloaded} fetchData={fetchData}/>
    </TouchableOpacity>
  ), [rawData, navigation])
  let content
  const ListEmptyComp=()=>(
  <Text style={styles.nothingText}>Nothing to see here...</Text>)
  const ListHeaderComp = useMemo(()=>{
    if(rawData?.length >0){
      return(
        <>
        <TouchableOpacity onPress={handleDeleteALL} style={styles.deleteBtn}>
          <Text style={{ color: color.White }}>Delete ALL</Text>
        </TouchableOpacity>
        </>)
    }
  })
  
  const memoizedFlatList = useMemo(()=>{
    return(<FlatList
      nestedScrollEnabled={true}
      data={rawData}
      keyExtractor={(item, index) => `${index}_DownloadedAnime`}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComp}
      ListHeaderComponent={ListHeaderComp}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />)
  })
  

  return (
    <View style={styles.container}>
      {/* {ListHeaderComp} */}
      {memoizedFlatList}
    </View>
  )
}

export default DownloadedAnime
const styles = StyleSheet.create({
  container:{
    flex: 1, 
    backgroundColor: color.DarkBackGround, 
    paddingHorizontal: 10, 
    paddingTop: 5,
  },
  nothingText:{
    color: color.LightGray, 
    textAlign: "center", 
    paddingVertical: 10, 
    fontFamily: font.InterMedium
  },
  deleteBtn:{
    padding: 10, 
    justifyContent: "center", 
    flexDirection: "row",
  }
})