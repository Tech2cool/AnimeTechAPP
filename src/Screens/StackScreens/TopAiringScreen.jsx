import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {fetchTopAiringAnime } from '../../Utils/Functions';
import ThemeColors from '../../Utils/ThemeColors';
import AnimeCard from '../../components/AnimeCard';
import IIcon from 'react-native-vector-icons/Ionicons';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function TopAiringScreen({ navigation }) {

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages: [],
  });
  const memoizedAnimes = useMemo(() => async (page) => {
    try {
      setIsLoading(true);
      // console.log("fetchPage: "+page, typeof(page))
      const req = await fetchTopAiringAnime(page);
      // console.log("req" + req.list)
      setAnime(req?.list);
      // console.log(req.totalPages)
      setPage(prev => (
        {
          ...prev,
          totalPage: req?.totalPages
        }
      ));
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }, [page.currentPage]);


  useEffect(() => {
    memoizedAnimes(1)
  }, [memoizedAnimes]);

  let content;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    memoizedAnimes(1);
    setPage(prev => (
      {
        ...prev,
        currentPage: 1
      }))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const avPages = [];
    for (let i = 1; i <= page.totalPage; i++) {
      avPages.push(i);
    }
    setPage(prev => ({
      ...prev,
      availPages: avPages,
    }))
    // console.log("avail:" + avPages)
  }, [page.totalPage])

  const handlePrevious = () => {
    if (page.currentPage <= 1) return;
    // console.log("prev")
    memoizedAnimes(page.currentPage - 1);
    setPage(prev => (
      {
        ...prev,
        currentPage: page.currentPage - 1,
      }
    ))
  }
  const handleNext = () => {
    if (page.currentPage >= page.totalPage) return;

    // console.log("Next")
    // console.log("Next: "+ page.currentPage + typeof(page.currentPage))
    memoizedAnimes(page.currentPage + 1)
    setPage(prev => (
      {
        ...prev,
        currentPage: page.currentPage + 1,
      }
    ))
  }

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
        <View style={styles.BtnContainer}>
            {
              page.totalPage > 1 && page.currentPage > 1 &&(
                <TouchableOpacity style={styles.myBtn} onPress={handlePrevious} >
                <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
              )
            }
          <View style={styles.currentPage}>
            <Text style={{ color: color.White, fontWeight: "600", fontSize: 20, }}>{page.currentPage}</Text>
          </View>
          {
            page.totalPage > 1 && page.currentPage < page.totalPage &&
            (<TouchableOpacity style={styles.myBtn} onPress={handleNext} >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>)
          }
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
})
