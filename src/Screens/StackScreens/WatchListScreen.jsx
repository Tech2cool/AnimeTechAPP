import { View, Text,ScrollView, RefreshControl, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeColors from '../../Utils/ThemeColors';
import WatchListCard from '../../components/WatchListCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const myWatchListKey = "watchedList_";
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const WatchListScreen = ({ route, navigation }) => {
  // const { anime, episodeId, watchingEpisode, watchedTime, duration } = route.params;
  const [rawData, setRawData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllWatchedEpisodes(myWatchListKey)
      .then(res => { setRawData(res); })
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

      const sortedWatchedEpisodes = watchedEpisodes
      .map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }))
      .sort((a, b) => b.value.timestamp - a.value.timestamp);
      return sortedWatchedEpisodes
      // return watchedEpisodes.map(([key, value]) => ({ mainId: key, value: JSON.parse(value) }));
    } catch (error) {
      console.error('Error retrieving watched episodes:', error);
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
      console.error('Error retrieving watched episodes:', error);
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
  }, [])


  const handleDeleteALL = ()=>{
    DeleteAllWatchedEpisodes(myWatchListKey)
    .then(res=> {
      // console.log(res)
      setRawData([])
    })
    .catch(err=> console.log(err))
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.DarkBackGround, paddingHorizontal: 10, paddingTop: 5 }}>
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
              <View
                key={i}
                style={{
                  backgroundColor: color.DarkBackGround2,
                  shadowColor: color.White,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 2,
                  elevation: 2,
                  marginVertical: 5,
                  borderRadius: 10,
                  overflow: "hidden",
                  position: "relative",
                }}>

                <TouchableOpacity
                  style={{ width: "95%" }}
                  onPress={() => {
                    navigation.navigate("Video",
                    {
                      anime: data?.value?.anime,
                      oneEpisode: {
                        id: data?.value?.episodeId,
                        number: data?.value?.watchingEpisode,
                      }})
                  }}>
                  <WatchListCard
                    anime={data?.value?.anime}
                    episodeId={data?.value?.episodeId}
                    watchingEpisode={data?.value?.watchingEpisode}
                    watchedTime={data?.value?.watchedTime}
                    duration={data?.value?.duration}
                  />
                </TouchableOpacity>
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

export default WatchListScreen