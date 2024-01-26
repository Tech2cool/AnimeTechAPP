import {Image, Dimensions, SafeAreaView, Linking, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import ThemeColors from '../../Utils/ThemeColors'
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getQueryParams} from "../../Utils/Functions";

const color = ThemeColors.DARK
const base_URL = "https://animetechapp.page.link"
const base_URL2 ="https://ani-short.vercel.app"

const Splash = ({ navigation }) => {
  const navigateToNextScreen = (link) => {
    if (link?.url.startsWith(`${base_URL}/Video`)) {
      // console.log("matched");
      // console.log(link?.url)
      // Usage
      const queryParams = getQueryParams(link?.url);
      // console.log(queryParams);
      navigation.navigate("Video",{
        animeId:queryParams.animeId,
        oneEpisode:{
        id:queryParams.episodeId,
        number:queryParams.episodeNum,
      }});
    } else {
      // console.log("not matched");
      navigation.navigate("HomeStack");
    }
  };

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
      navigation.navigate("HomeStack");
    }
  };

  useEffect(() => {
    
    const timerId = setTimeout(() => {
      // dynamicLinks()
      //   .getInitialLink()
      //   .then(link => {navigateToNextScreen(link)})
      //   .catch(err => { console.log(err);});
      Linking.getInitialURL()
      .then((url) => {handleDeepLink(url)})
      .catch((err) =>
      {
        // console.log(err);
        ToastAndroid.show(`Error: ${err}`, ToastAndroid.SHORT);
      }
      );
          
        // Linking?.addEventListener('url', (event) => {
        //   handleDeepLink(event?.url);
        // });
    
    }, 2000);
    
    // console.log("splash")
    return () => {
      // Clear the timeout when the component unmounts
      clearTimeout(timerId);
    };
  }, [navigation]);

  // useEffect(()=>{
  //   setTimeout(() => {
  //     navigation.navigate("HomeStack");
  //   }, 2000);
  // },[])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.DarkBackGround }}>
      {/* <Text style={{color:"red"}}>Splash</Text> */}
      <Image style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, resizeMode: "cover" }} source={require("../../assets/images/splash1.png")} />
    </SafeAreaView>
  )
}

export default Splash