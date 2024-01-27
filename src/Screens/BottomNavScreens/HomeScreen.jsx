import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchLatestAnime, setPagesArray } from '../../Utils/Functions';
import ThemeColors from '../../Utils/ThemeColors';
import AnimeCard from '../../components/AnimeCard';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../Context/PaginationContext';

const color = ThemeColors.DARK;
export default function HomeScreen({ navigation }) {

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {myPage, setMyPage} = usePagination();

  // const [myPage, setMyPage] = useState({
  //   currentPage: 1,
  //   totalPage: 1,
  //   availPages: [],
  // });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnime(1);
    setMyPage(prev => ({
      ...prev,
      currentPage: 1,
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
    fetchAnime(1);
    setMyPage(prev => ({
      ...prev,
      currentPage: 1,
    }))
  }, [])

  if (isLoading && !refreshing) {
    content = <ActivityIndicator size="large" color={color.Orange} />
  } else {
    content = anime?.map((anim) => (
      <TouchableOpacity activeOpacity={0.7} key={anim.animeID}
        onPress={() => {
          navigation.navigate("Video", { anime: anim })
        }}>
        <AnimeCard anime={anim} />
      </TouchableOpacity>))
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.mcontainer}>
        {content}
      <Pagination fetchAnime={fetchAnime}/>
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
})
