import { View, Text, ScrollView, RefreshControl, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeColors from '../../Utils/ThemeColors';
import WatchListCard from '../../components/WatchListCard';
import {FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useInternet } from '../../Context/InternetContext';

const myWatchListKey = "watchedList_";
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const WatchListScreen = ({ route, navigation }) => {
  // const { anime, episodeId, watchingEpisode, watchedTime, duration } = route.params;
  const [rawData, setRawData] = useState([]);
  const { isOnline } = useInternet()
  const [refreshing, setRefreshing] = useState(false);
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
        .map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }))
        .sort((a, b) => b.value.timestamp - a.value.timestamp);
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
      AsyncStorage.multiRemove(watchedEpisodeKeys, (error) => {
        // console.log("deleted")
      })
      setRawData([])
      return { message: "deleted all Selected Data" }
    } catch (error) {
      ToastAndroid.show("Error:" + error, ToastAndroid.SHORT)
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
      .catch(err => {
        ToastAndroid.show("Error:" + err, ToastAndroid.SHORT)
      })
  }, [])
  const handleSingleDelete = async (itemId, AnimeTitle) => {
    setRawData((prevData) => prevData.filter((item) => item.mainId !== itemId));
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
  const renderItem = useCallback(({item, index}) =>(
    <View
        // key={i}
        style={{
          // backgroundColor: color.DarkBackGround2,
          flex: 1,

        }}>

        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => {
            navigation.navigate("Video",
              {
                anime: item?.value?.anime,
                oneEpisode: {
                  id: item?.value?.episodeId,
                  number: item?.value?.watchingEpisode,
                }
              })
          }}>
          <WatchListCard
            anime={item?.value?.anime}
            episodeId={item?.value?.episodeId}
            watchingEpisode={item?.value?.watchingEpisode}
            watchedTime={item?.value?.watchedTime}
            duration={item?.value?.duration}
            mainId={item?.mainId}
            handleSingleDelete={handleSingleDelete}
          />
        </TouchableOpacity>
      </View>
    
  ), [rawData, navigation])
  return (
    <View style={{ flex: 1, backgroundColor: color.DarkBackGround, paddingHorizontal: 10, paddingTop: 5 }}>
      <>
        <View>
          <TouchableOpacity onPress={handleDeleteALL} style={{ padding: 10, justifyContent: "center", flexDirection: "row" }}>
            <Text style={{ color: color.White }}>Delete ALL</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          nestedScrollEnabled={true}
          data={rawData}
          keyExtractor={(item, index)=> `${index}_watchListScreen`}
          renderItem={renderItem}
          ListEmptyComponent={()=>(
          <>
          <Text style={{ color: color.LightGray, textAlign: "center", paddingVertical: 10, fontFamily: font.InterMedium }}>Nothing to see here...</Text>
          </>)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </>
      {/* <Text style={{color:color.White}}>{rawData[0]?.value.anime.episodeId}</Text> */}
    </View>
  )
}

export default WatchListScreen