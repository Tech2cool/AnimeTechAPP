import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions, FlatList, Button, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors';
import { fetchAnimeInfo, fetchEpisodeDetailsFromKitsu, fetchEpisodes, filterNUE } from '../../Utils/Functions';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguage } from '../../Context/LanguageContext';
import EpisodeCard from '../../components/EpisodeCard';
import IIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyGenrecard from '../../components/MyGenrecard';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const clr_code = [color.AccentBlue, color.Orange, color.White, color.AccentGreen, color.Cyan, color.Red]
const LoadingArray = [<ActivityIndicator size="large" color={color.Orange} />]

const AnimeInfoScreen = ({ route, navigation }) => {
  const { anime } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [animeInfo, setAnimeInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);
  const [lastIndex, setLastIndex] = useState(-1);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const { currentLang } = useLanguage();
  const flatListRef = useRef(null);

  // console.log(anime?.AdditionalInfo?.startDate.split("-")[0])

  let content, AnimeTitle;
  if (currentLang === "en") {
    AnimeTitle = (anime?.animeTitle?.english) || (anime?.animeTitle?.english_jp)
  } else {
    AnimeTitle = (anime?.animeTitle?.english_jp) || (anime?.animeTitle?.japanese)
  }

  useEffect(() => {
    const fetchEPEtc = async () => {
      try {
        setIsLoadingEpisode(true)
        const ep_req = await fetchEpisodes(anime?.animeID, anime?.AdditionalInfo?.id)
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
    fetchEPEtc();
    fetchAINFO();
    // console.log(anime.animeID)
  }, [anime?.animeID])

  useEffect(() => {
    const lastIndex = episodes.length - 1;
    // console.log("last" + lastIndex)
    setLastIndex(lastIndex);
  }, [episodes]);

  const scrollToEpisode = (index) => {
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };
  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 120 * index,
    index,
  });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / 120); // Assuming a fixed item height
    setCurrentScrollIndex(index);
  };
  const [showMore, setShowMore] = useState(false);

  const handleEpisodeSwtich = (episode) => {
    navigation.navigate("Video", { anime: anime, oneEpisode: episode })
  }

  if (isLoading) {
    content = <ActivityIndicator size="large" color={color.Orange} />
  } else {
    content = (
      <>
        <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", columnGap: 2, rowGap: 5 }}>
          <MyGenrecard Title={`TotalEpisodes: ${animeInfo?.totalEpisodes}`} />
          <MyGenrecard Title={`Status: ${animeInfo?.status}`} />
          <MyGenrecard Title={`Year: ${filterNUE(anime?.year)?anime?.year:anime?.AdditionalInfo?.startDate?.split("-")[0]}`} />
          <MyGenrecard Title={`${anime?.AdditionalInfo?.ageRating + " " + anime?.AdditionalInfo?.ageRatingGuide}`} />
          <MyGenrecard Title={`${animeInfo?.type}`} />
        </View>
        <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", gap: 2 }}>
          {animeInfo?.genres?.map((genre, i) => (
            <MyGenrecard Title={genre} key={i} />
          ))}
        </View>
        {/* Description */}
        <View style={{ flex: 1, padding: 5 }}>
          <Text numberOfLines={showMore ? undefined : 4} style={{ color: color.LightGray }}>{filterNUE(animeInfo?.synopsis)?animeInfo?.synopsis:anime?.AdditionalInfo?.description}</Text>
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
      </>
    )
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                {
                  isLoadingEpisode ? <ActivityIndicator size="large" color={color.Orange} /> :
                    <TouchableOpacity onPress={() => handleEpisodeSwtich(item)}>
                      <EpisodeCard episode={item} anime={anime} />
                    </TouchableOpacity>
                }
              </View>
            )}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={30} //(in milliseconds)
            windowSize={5}
            getItemLayout={getItemLayout}
            onScroll={handleScroll}
            ListHeaderComponent={
              <>
                <View style={{ flex: 1, }}>
                  <Image
                    style={{ flex: 1, resizeMode: "cover", height: Dimensions.get("screen").height - 280 }}
                    source={{ uri: anime?.animeImg }} />
                </View>
                <Text style={{ color: color.White, fontFamily: font.InterBlack, fontSize: 18, marginVertical: 10, paddingHorizontal: 5 }}>{AnimeTitle}</Text>
                <View style={{ flex: 1, flexDirection: "column", gap: 5, flexWrap: "wrap" }}>
                  {content}
                </View>
                <View style={{ borderBottomColor: color.White, borderBottomWidth: 0.2, marginTop: 20, }}></View>
                <Text style={{ color: color.White, fontFamily: font.InterBlack, fontSize: 16, marginVertical: 5 }}>Episodes: </Text>
              </>
            }
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
})

export default AnimeInfoScreen