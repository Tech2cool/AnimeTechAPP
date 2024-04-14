import { View, Text,ScrollView, RefreshControl, ToastAndroid, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeColors from '../../Utils/ThemeColors';
import WatchListCard from '../../components/WatchListCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isValidData } from '../../Utils/Functions';
import { dummy_image } from '../../Utils/contstant';
import { useInternet } from '../../Context/InternetContext';
import DownloadCardPageCard from '../../components/DownloadCardPageCard';

const myWatchListKey = "download_";
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const DownloadedAnime2 = ({ route, navigation }) => {
  // const { anime, episodeId, watchingEpisode, watchedTime, duration } = route.params;
  const [rawData, setRawData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => { 
        setRawData(res);
        // console.log(res);
      })
      .catch(err =>{ToastAndroid.show("Error:"+ err,ToastAndroid.SHORT)})

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const getAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));
      const watchedEpisodes = await AsyncStorage.multiGet(watchedEpisodeKeys);
      // console.log(watchedEpisodeKeys)
      const sortedWatchedEpisodes = watchedEpisodes
      .map(([key, value]) => ({ Id: key, value: JSON.parse(value) }))
      // .sort((a, b) => b.value.timestamp - a.value.timestamp);
      return sortedWatchedEpisodes
      // return watchedEpisodes.map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }));
    } catch (error) {
      // console.error('Error retrieving watched episodes:', error);
      return [];
    }
  };

  const DeleteAllWatchedEpisodes = async (myKey) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter keys that match the pattern
      const watchedEpisodeKeys = allKeys.filter(key => key.startsWith(myKey));

      // Retrieve the values for the filtered keys
      AsyncStorage.multiRemove(watchedEpisodeKeys,(error)=>{
        // console.log("deleted")
      })
      setRawData([])
      return {message:"deleted all Selected Data"}
    } catch (error) {
      ToastAndroid.show("Error:"+ error,ToastAndroid.SHORT)
      // console.error('Error retrieving watched episodes:', error);
      return [];
    }
  };

  useEffect(() => {
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => {
        // console.log(res)
        setRawData(res);
      })
      .catch(err =>{
        ToastAndroid.show("Error:"+ err,ToastAndroid.SHORT)
      })
  }, [navigation])

  const handleSingleDelete = async(itemId,AnimeTitle) => {
    setRawData((prevData) => prevData.filter((item) => item.mainId !== itemId));
    // console.log(itemId)
    await AsyncStorage.removeItem(itemId);
    ToastAndroid.show(`Deleted Succesfully ${AnimeTitle}`,ToastAndroid.SHORT)
  };
  

  const handleDeleteALL = ()=>{
    DeleteAllWatchedEpisodes(myWatchListKey)
    .then(res=> {
      // console.log(res)
      ToastAndroid.show(`WatchList Deleted Succesfully`,ToastAndroid.SHORT)

      setRawData([])
    })
    .catch(err=>{
      // console.log(err)
      ToastAndroid.show("Error:"+ err,ToastAndroid.SHORT)
    })
  }

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: color.DarkBackGround, 
      paddingHorizontal: 15, 
      paddingTop: 5,
      paddingBottom:20,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {
          rawData && rawData?.length > 0 ? (
          <>
          <View>
          <TouchableOpacity onPress={handleDeleteALL} style={{padding:10, justifyContent:"center", flexDirection:"row"}}>
            <Text style={{color:color.White}}>Delete ALL</Text>
          </TouchableOpacity>

          </View>
          {
            rawData?.map((data, i) => (
              <View key={i}>
                <DownloadCardPageCard data={data} handleSingleDelete={handleSingleDelete}/>
              </View>
            ))
          }
          </>
            ) : (
            <Text style={{color:color.LightGray, textAlign:"center", paddingVertical:10, fontFamily:font.InterMedium}}>Nothing to see here...</Text>
          )

        }
        {/* <Text style={{color:color.White}}>{rawData[0]?.value.anime.episodeId}</Text> */}
      </ScrollView>

    </View>
  )
}

export default DownloadedAnime2