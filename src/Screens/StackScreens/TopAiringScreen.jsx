import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {fetchTopAiringAnime, setPagesArray } from '../../Utils/Functions';
import ThemeColors from '../../Utils/ThemeColors';
import AnimeCard from '../../components/AnimeCard';
import IIcon from 'react-native-vector-icons/Ionicons';
import { usePagination } from '../../Context/PaginationContext';
import Pagination from '../../components/Pagination';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function TopAiringScreen({ navigation }) {

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { myPage, setMyPage } = usePagination();
  let content;
  useEffect(() => {
    memoizedAnimes(1);
    setMyPage(prev=>({
      ...prev,
      currentPage:1,
    }))

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
    setRefreshing(true);
    memoizedAnimes(1);

    setMyPage(prev => ({
        ...prev,
        currentPage: 1,
    }))

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  if (isLoading && !refreshing) {
    content = <ActivityIndicator size="large" color={color.Orange} />
  } else {
    content = anime?.map((anim) => (
      <TouchableOpacity activeOpacity={0.7} key={anim.animeID} onPress={() => navigation.navigate("AnimeInfo", { anime: anim })}>
        <AnimeCard anime={anim} />
      </TouchableOpacity>))
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.mcontainer}>
        {/* {content} */}
        <View style={{ color: color.White, marginBottom:10 }}>
          <View style={{flexDirection:"row", gap:10, borderColor:color.LighterGray, borderBottomWidth:1, paddingVertical:5, alignItems:"center"}}>
            <IIcon name="arrow-back" size={25} color={color.White} onPress={()=> navigation.goBack()}/>
            <Text style={{color: color.White, fontSize:18, fontFamily:font.InterBlack,textAlign:"center", paddingBottom:5}}>Top Airing</Text>
          </View>
        </View>
        {content}
        <Pagination
          fetchAnime={memoizedAnimes}
        />
      </View>
    </ScrollView>
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
})
