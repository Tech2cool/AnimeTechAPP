import {Image, Dimensions, SafeAreaView, Linking, ToastAndroid, ImageBackground, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors'
import {getQueryParams} from "../../Utils/Functions";
import { useInternet } from '../../Context/InternetContext';
import Animated, { FadeInLeft, FadeInRight, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const color = ThemeColors.DARK
const font = ThemeColors.FONT
const base_URL = "https://animetechapp.page.link"
const base_URL2 ="https://ani-short.vercel.app"

const Splash = ({ navigation }) => {
  const {isOnline} =useInternet()
  const opacity = useSharedValue(0)
  // const navigateToNextScreen = (link) => {
  //   if (link?.url.startsWith(`${base_URL}/Video`)) {
  //     // console.log("matched");
  //     // console.log(link?.url)
  //     // Usage
  //     const queryParams = getQueryParams(link?.url);
  //     // console.log(queryParams);
  //     navigation.navigate("Video",{
  //       animeId:queryParams.animeId,
  //       oneEpisode:{
  //       id:queryParams.episodeId,
  //       number:queryParams.episodeNum,
  //     }});
  //   } else {
  //     // console.log("not matched");
  //     navigation.navigate("HomeStack");
  //   }
  // };
  
  const handleDeepLink = (url) => {
    // console.log('Received deep link:', url);
    if (url) {
      // console.log("matched")
      const queryParams = getQueryParams(url);
      // console.log(queryParams);
      if(queryParams.episodeId){
        navigation.navigate("Video",{
          animeId:queryParams.animeId,
          oneEpisode:{
            id:queryParams.episodeId,
            number:queryParams.episodeNum,
          }});
      }
    }else{
      // console.log("not matched");
      // navigation.navigate("HomeStack");
      navigation.navigate("HomeStack");
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      opacity.value=1
    }, 500);
    const timerId = setTimeout(() => {
      if(!isOnline){
        navigation.navigate("Downloads")
      }else{
        Linking.getInitialURL()
        .then((url) => {handleDeepLink(url)})
        .catch((err) =>{
          // console.log(err);
          ToastAndroid.show(`Error: ${err}`, ToastAndroid.SHORT);
        });
      }
          
    }, 2000);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [navigation, isOnline,Linking]);

  rStyleAct= useAnimatedStyle(()=>{
    return{
      opacity:opacity.value
    }
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.DarkBackGround, justifyContent:"center", alignItems:"center" }}>
      {/* <Text style={{color:"red"}}>Splash</Text> */}
        {/* <Image source={require("../../assets/images/jujtsu.webp")}/> */}
          <Animated.View 
          style={{flexDirection:"row"}} 
          entering={FadeInRight.delay(500)} 
          exiting={FadeOut.delay(500)}>
            <Animated.Text style={{fontSize:30, color:color.Orange, fontFamily:font.NunitoBlack}}>Anime</Animated.Text>
            <Animated.Text style={{fontSize:30, color:color.White, fontFamily:font.NunitoBlack}}>Tech</Animated.Text>
          </Animated.View>
          <Animated.Text 
            entering={FadeInLeft.delay(1000)} 
            exiting={FadeInRight.delay(1000)} 
            style={{fontSize:20, color:color.White, fontFamily:font.NunitoBlack}}>THE ANIME STREAMING APP</Animated.Text>
          
          {/* <ActivityIndicator style={{marginTop:20}} size={50} color={color.Orange}/> */}
      {/* <Image style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, resizeMode: "cover" }} source={require("../../assets/images/splash1.png")} /> */}
    </SafeAreaView>
  )
}

export default Splash