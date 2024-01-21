import { View, Text, Image, Dimensions, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import ThemeColors from '../../Utils/ThemeColors'
const color = ThemeColors.DARK
const Splash = ({navigation}) => {

  useEffect(()=>{
    setTimeout(() => {
      navigation.navigate("HomeStack");
    }, 2000);
  },[])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:color.DarkBackGround}}>
      {/* <Text style={{color:"red"}}>Splash</Text> */}
      <Image style={{width:Dimensions.get("screen").width, height:Dimensions.get("screen").height, resizeMode:"cover"}} source={require("../../assets/images/splash1.png")}/>
    </SafeAreaView>
  )
}

export default Splash