import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchAnimeBySearch, filterNUE } from '../../Utils/Functions';
import ThemeColors from '../../Utils/ThemeColors';
import AnimeCard from '../../components/AnimeCard';
import { TextInput } from 'react-native-gesture-handler';
import useDebounce from '../../components/useDebounce';
import IIcon from 'react-native-vector-icons/Ionicons';

const color = ThemeColors.DARK;
export default function SearchScreen({navigation}) {

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myInput, setMyInput] = useState("");
  const [page, setPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages:[],
  });
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(myInput,500);

  let content;
  const fetchAnime = async (title,page) => {
    try {
      setIsLoading(true);
      // console.log("fetchPage: "+page, typeof(page))
      const req = await fetchAnimeBySearch(title, page);
      // console.log(req?.list)
     setAnime(req.list);
     setPage(prev=>(
      {
        ...prev,
        totalPage:req.totalPages
       }
     ));
     setIsLoading(false);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnime(myInput,1);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    
    if(filterNUE(debouncedSearch)){
      fetchAnime(debouncedSearch,1);
    }
  }, [debouncedSearch])

  useEffect(() => {
    // console.log(typeof({page:page.currentPage}));
    // console.log(typeof("tpage" + page.totalPage));
    const avPages=[];
    for(let i= 1; i<=page.totalPage; i++){
      avPages.push(i);
    }
    setPage(prev=>({
      ...prev,
      availPages:avPages,
    }))
    // console.log("avail:" + avPages)
  }, [page.totalPage])

  const handlePrevious = ()=>{
    if(page.currentPage <=1) return;
    // console.log("prev")
    fetchAnime(page.currentPage - 1);
    setPage(prev=>(
      {
        ...prev,
        currentPage:page.currentPage - 1,
       }
    )) 
  }
  const handleNext = ()=>{
    if(page.currentPage >= page.totalPage) return;
    
    // console.log("Next")
    // console.log("Next: "+ page.currentPage + typeof(page.currentPage))
    fetchAnime(page.currentPage + 1)
    setPage(prev=>(
      {
        ...prev,
        currentPage:page.currentPage + 1,
       }
    ))
  }
  if(isLoading && !refreshing){
    content = <ActivityIndicator size="large" color={color.Orange}/>
  }else{
    content = anime?.map((anim) => (
        <TouchableOpacity  activeOpacity={0.7} key={anim.animeID} onPress={()=>navigation.navigate("AnimeInfo",{anime:anim})}>
          <AnimeCard anime={anim}/>
        </TouchableOpacity>))
  }

  return (
    <ScrollView style={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.mcontainer}>
        {/* {content} */}
        <KeyboardAvoidingView style={{padding: 5, borderRadius:10, 
          backgroundColor:color.White, flexDirection:"row",
          alignItems:"center",
          marginBottom:5, marginTop:5,
          }}>
          <TextInput
            style={{height: 40, color:color.DarkGray,fontWeight:"600", width:"90%"}}
            placeholder="Search anime here!..."
            placeholderTextColor={color.DarkGray}
            onChangeText={newText => setMyInput(newText)}
            value={myInput}
            // defaultValue={"one piece"}
          />
          <IIcon name={"search"} size={30} color={color.Orange} onPress={() => fetchAnime(debouncedSearch,1)}/>
        </KeyboardAvoidingView>
          { content }
          <View style={styles.BtnContainer}>
          {
            page.totalPage > 1 && page.currentPage > 1 && (
              <TouchableOpacity style={styles.myBtn} onPress={handlePrevious} >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )
          }
          <View style={styles.currentPage}>
            <Text style={{ color: color.White, fontWeight: "600", fontSize: 20, }}>{page?.currentPage}</Text>
          </View>
          {
            page?.totalPage > 1 && page?.currentPage < page?.totalPage &&
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
    alignItems:"center",
    marginVertical: 10,
  },
  currentPage: {
    borderRadius: 99,
    backgroundColor: color.DarkBackGround,
    borderWidth:5,
    borderColor:color.White,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  myBtn: {
    paddingVertical: 18,
    // width: 100,
    // height: 200,
    flex:1,
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
