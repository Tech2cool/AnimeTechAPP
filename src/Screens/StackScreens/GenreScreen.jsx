import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAnimeByGenre, setPagesArray } from '../../Utils/Functions';
import SelectDropdown from 'react-native-select-dropdown'
import {Pagination, AnimeCard} from '../../components';
import {ThemeColors, IIcon} from '../../Utils';
import { Genres } from "../../Utils/contstant"

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function GenreScreen({ navigation }) {

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = React.useState("isekai");
  const [refreshing, setRefreshing] = useState(false);
  // const { myPage, setMyPage } = usePagination();
  const [myPage, setMyPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages: [],
  });

  let content;

  useEffect(() => {
    memoizedAnimes(selected, 1)
  }, [selected]);
  
  useEffect(() => {
    setMyPage(prev => ({
      ...prev,
      currentPage: 1,
    }))
  }, [])


  const memoizedAnimes = useMemo(() => async (genre, page) => {
    try {
      setIsLoading(true);
      const req = await fetchAnimeByGenre(genre, page);
      setAnime(req?.list);
      setMyPage(prev => (
        {
          ...prev,
          currentPage:page,
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
  }, [selected]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    memoizedAnimes(selected, 1);
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
        <View
          style={{ color: color.White, marginBottom:10 }}
        >
          <View style={{flexDirection:"row", gap:100}}>
            <IIcon name="arrow-back" size={25} color={color.White} onPress={()=> navigation.goBack()}/>
            <Text style={{color: color.White, fontSize:18, fontFamily:font.InterBlack,textAlign:"center", paddingBottom:5}}>Select Genre:-</Text>
          </View>
          <SelectDropdown
            data={Genres}
            search={true}
            searchPlaceHolder="search genre here..."
            searchPlaceHolderColor={color.LightGray}
            searchInputStyle={{backgroundColor:color.DarkBackGround, 
              borderBottomColor:color.Orange, borderWidth:0.5}}
              
            buttonStyle={{borderRadius:10, width:"100%", backgroundColor:color.DarkBackGround, borderColor:color.Orange, borderWidth:1}}
            buttonTextStyle={{color:color.Orange, textTransform:"capitalize", fontFamily:font.InterBlack}}
            dropdownStyle={{borderRadius:5,backgroundColor:color.DarkBackGround, borderColor:color.Orange, borderWidth:0.5}}
            rowTextStyle={{color:color.White, textTransform:"capitalize"}}
            rowStyle={{borderColor:color.LighterGray2}}
            selectedRowTextStyle={{color:color.White, textTransform:"capitalize"}}
            selectedRowStyle={{backgroundColor:color.Orange}}
            defaultValue={"isekai"}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index)
              setSelected(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              return item
            }}
          />
          
        </View>
        {content}
        <Pagination
          myPage={myPage} 
          setMyPage={setMyPage}
          fetchAnime={memoizedAnimes}
          title={selected}
          search={true}
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
