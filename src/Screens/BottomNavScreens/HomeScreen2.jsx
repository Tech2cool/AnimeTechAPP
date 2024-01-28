import {
  View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, ToastAndroid, FlatList, Text, Image, Dimensions, ImageBackground
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAnimeInfo, fetchAnimeMovies, fetchLatestAnime, fetchPopularAnime, fetchTopAiringAnime, isValidData } from '../../Utils/Functions';
import { ThemeColors, IIcon } from '../../Utils';
import AnimecardVertical from '../../components/AnimeCardVertical';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

export default function HomeScreen2({ navigation }) {

  const [anime, setAnime] = useState([]);
  const [popular, setPopular] = useState([]);
  const [airing, setAiring] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndex2, setSelectedIndex2] = useState(0);
  const SliderRef = useRef(null)
  const SliderRef2 = useRef(null)

  const opacity = useSharedValue(1); // Initialize with 1 for initial fadeIn

  const fadeIn = () => {
    opacity.value = withTiming(1, { duration: 300 });
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, { duration: 300 });
  };
  const rView = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnime(1);
    fetchPopular(1);
    fetchAiringAnime(1);
    fetchMovies("",1);
    setSelectedIndex(0);
    setSelectedIndex2(0);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchAnime = async (pagee) => {
    try {
      setIsLoading(true);
      const req = await fetchLatestAnime(pagee);
      setAnime(req?.list);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const fetchPopular = async (page) => {
    try {
      setIsLoading1(true);
      const req = await fetchPopularAnime(page);
      // console.log(req?.list[0])
      setPopular(req?.list);
      setIsLoading1(false);
    } catch (error) {
      // console.log(error);
      setIsLoading1(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const fetchAiringAnime = async (page) => {
    try {
      setIsLoading2(true);
      const req = await fetchTopAiringAnime(page);
      setAiring(req?.list);
      setIsLoading2(false);
    } catch (error) {
      // console.log(error);
      setIsLoading2(false);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }
  const fetchMovies = async (aplha = "", page) => {
    try {
      const req = await fetchAnimeMovies(aplha, page);
      setMovies(req?.list);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    const sid = setTimeout(() => {
      // setit
      // fadeOut();
      setTimeout(() => {
        setSelectedIndex((prev) => (prev < airing.length - 1 ? prev + 1 : 0));
        setSelectedIndex2((prev) => (prev < popular.length - 1 ? prev + 1 : 0));
        SliderRef?.current?.scrollToIndex({ animated: true, index: selectedIndex });
        SliderRef2?.current?.scrollToIndex({ animated: true, index: selectedIndex2 });
        // fadeIn();
      });
    }, 8000);
    return () => clearTimeout(sid)
  }, [selectedIndex, airing,selectedIndex2,popular])

  useEffect(() => {
    fetchAnime(1);
    fetchPopular(1);
    fetchAiringAnime(1);
    fetchMovies("", 1);
    // slideTimer();

  }, [])
  if (isLoading || isLoading2) {
    if (refreshing) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={color.White} />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={color.Orange} />
        </View>
      )
    }
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Image SLider */}
      <View>
        <FlatList
          nestedScrollEnabled={true}
          data={airing}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          ref={SliderRef}
          renderItem={({ item, index }) => (
            <Animated.View
              style={[{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 16 / 16,
                position: "relative",
              }]}
              onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
              {/* <AnimecardVertical anime={item} /> */}
              <Animated.Image
                source={
                  isValidData(item?.AdditionalInfo?.posterImage?.original ||
                    item?.AdditionalInfo?.posterImage?.small ||
                    item?.AdditionalInfo?.posterImage?.tiny) === false ?
                    require("../../assets/images/no-poster.png") : {
                      uri: (isValidData(item?.AdditionalInfo?.posterImage?.original) && item?.AdditionalInfo?.posterImage?.original) ||
                        (isValidData(item?.AdditionalInfo?.posterImage?.small) && item?.AdditionalInfo?.posterImage?.small) ||
                        (isValidData(item?.AdditionalInfo?.posterImage?.tiny) && item?.AdditionalInfo?.posterImage?.tiny)
                    }}
                style={[{
                  width: "100%",
                  height: "100%",
                  // flex:1,
                }]}
                resizeMode='cover'
              />
              <View style={{
                bottom: 0,
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                flexDirection: "column",
                // flex:1,
                width: "100%",
                paddingHorizontal: 5,
                gap: 5,
              }}>
                <Text style={{ color: color.White, fontSize: 20, fontFamily: font.OpenSansBold }}>
                  {(isValidData(item?.animeTitle?.english) && item?.animeTitle?.english) || (item?.animeTitle?.english_jp)}</Text>
                <Text
                  numberOfLines={3}
                  style={{
                    color: color.White,
                    fontSize: 14,
                    fontFamily: font.OpenSansMedium,
                    // paddingRight:5
                  }}>
                  {(isValidData(item?.AdditionalInfo?.description) && item?.AdditionalInfo?.description)}</Text>

                <TouchableOpacity
                  style={{
                    gap: 5,
                    flex: 0,
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 2,
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    backgroundColor: color.Orange,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("AnimeInfo", { anime: item })}
                >
                  <IIcon name="play-sharp" size={25} color={color.White} />
                  <Text style={{
                    color: color.White,
                    fontFamily: font.OpenSansBold,
                    fontSize: 16,
                    textTransform: "uppercase",
                    fontWeight: "700"
                  }}>Watch Now</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          )}
        />

      </View>
      {/* Image SLider END */}

      <View style={styles.mcontainer}>
        {/* Recent */}
        {
          !isLoading && (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                <Text style={styles.Heading}>Recent</Text>
                <Text
                  style={styles.showMore}
                  onPress={() => navigation.navigate("Recent")}
                > Show More</Text>
                {/* <MCIcon name="dots-vertical" size={20} color="white"/> */}
              </View>
              <FlatList
                nestedScrollEnabled={true}
                data={anime}
                horizontal={true}
                keyExtractor={(item, index) => `${item?.animeID}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginHorizontal: 4 }}
                    onPress={() => navigation.navigate("Video", { anime: item })}>
                    <AnimecardVertical anime={item} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )
        }

        {/* Popular */}
        {
          !isLoading1 && (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.Heading}>Popular</Text>
                <Text
                  style={styles.showMore}
                  onPress={() => navigation.navigate("Popular")}
                > Show More</Text>
              </View>
              <FlatList
                nestedScrollEnabled={true}
                data={popular}
                horizontal={true}
                keyExtractor={(item, index) => `${item?.animeID}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginHorizontal: 4 }}
                    onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
                    <AnimecardVertical anime={item} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )
        }

        {/* Top Airing */}
        {
          !isLoading2 && (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.Heading}>Top Airing</Text>
                <Text
                  style={styles.showMore}
                  onPress={() => navigation.navigate("TopAring")}
                > Show More</Text>
              </View>
              <FlatList
                nestedScrollEnabled={true}
                data={airing}
                horizontal={true}
                keyExtractor={(item, index) => `${item?.animeID}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginHorizontal: 4 }}
                    onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
                    <AnimecardVertical anime={item} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )
        }

      {/* Image SLider */}
      <View style={{
        marginVertical:10,
      }}>
        <FlatList
          nestedScrollEnabled={true}
          data={popular}
          horizontal={true}
          keyExtractor={(item, index) => `${item?.animeID}-${index}-${Math.random()}`}
          ref={SliderRef2}
          renderItem={({ item }) => (
            <Animated.View
              style={[{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 4/ 16,
                position: "relative",
              }]}
              onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
              {/* <AnimecardVertical anime={item} /> */}
              <Animated.Image
                source={
                  isValidData(item?.AdditionalInfo?.coverImage?.original ||
                    item?.AdditionalInfo?.coverImage?.small ||
                    item?.AdditionalInfo?.coverImage?.tiny) === false ?
                    require("../../assets/images/no-poster.png") : {
                      uri: (isValidData(item?.AdditionalInfo?.coverImage?.original) && item?.AdditionalInfo?.coverImage?.original) ||
                        (isValidData(item?.AdditionalInfo?.coverImage?.small) && item?.AdditionalInfo?.coverImage?.small) ||
                        (isValidData(item?.AdditionalInfo?.coverImage?.tiny) && item?.AdditionalInfo?.coverImage?.tiny)
                    }}
                style={[{
                  width: "100%",
                  height: "100%",
                  // flex:1,
                }]}
                resizeMode='cover'
              />
              <View style={{
                bottom: 0,
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.4)",
                flexDirection: "column",
                justifyContent:"space-between",
                // flex:1,
                width: "100%",
                height:50,
                paddingHorizontal: 5,
                gap: 5,
              }}>
                <Text style={{ color: color.White, fontSize: 20, fontFamily: font.OpenSansBold }}>
                  {(isValidData(item?.animeTitle?.english) && item?.animeTitle?.english) || (item?.animeTitle?.english_jp)}</Text>
                <TouchableOpacity
                  style={{
                    gap: 5,
                    flex: 0,
                    marginTop:5,
                    // padding: 5,
                    // paddingTop:5,
                    borderRadius: 5,
                    // marginBottom: 2,
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    // backgroundColor: color.Orange,
                    justifyContent: "center",
                    alignItems: "center",
                    position:"absolute",
                    left:0,
                    bottom:0,
                  }}
                >
                  <IIcon name="play-sharp" size={25} color={color.White} />
                  <Text style={{
                    color: color.White,
                    fontFamily: font.OpenSansBold,
                    fontSize: 16,
                    textTransform: "uppercase",
                    fontWeight: "700"
                  }}
                  onPress={() => navigation.navigate("AnimeInfo", { anime: item })}
                  
                  >Watch Now</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          )}
        />

      </View>
      {/* Image SLider END */}

        {/* Movies */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.Heading}>Movies</Text>
            <Text
              style={styles.showMore}
              onPress={() => navigation.navigate("Movies")}
            > Show More</Text>
          </View>
          <FlatList
            nestedScrollEnabled={true}
            data={movies}
            horizontal={true}
            keyExtractor={(item, index) => `${item?.animeID}-${index}`}

            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginHorizontal: 4 }}
                onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
                <AnimecardVertical anime={item} />
              </TouchableOpacity>
            )}
          />
        </View>


      </View>
    </ScrollView>
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
    flexDirection: "column",
    gap: 5,
    marginBottom: 20,
  },
  Heading: {
    fontSize: 18,
    fontFamily: font.OpenSansMedium,
    fontWeight: "800",
    color: color.White,
    textTransform: "uppercase",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  showMore: {
    fontSize: 16,
    color: color.White,
    fontFamily: font.OpenSansMedium,
    fontWeight: "700",
  }
})
