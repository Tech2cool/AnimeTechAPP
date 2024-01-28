import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo } from 'react'
import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const AnimecardVertical= memo(({anime}) =>{
  const{currentLang}=useLanguage();

  let AnimeTitle,status=anime?.AdditionalInfo?.status;
    
    if(currentLang === "en"){
        AnimeTitle= (isValidData(anime?.animeTitle?.english) && anime?.animeTitle?.english) || (anime?.animeTitle?.english_jp)
    }else{
        AnimeTitle= (anime?.animeTitle?.english_jp) || (anime?.animeTitle?.japanese)
    }
    if(isValidData(anime?.status)){
        status= anime?.status
    }else{
        if(anime?.AdditionalInfo?.status === "current"){
            status ="ongoing"
        }
    }

  return (
      <View style={styles.container}>
        {
            isValidData(anime?.animeImg)?
            <Image style={styles.Img} source={{uri:anime?.animeImg}}/>
            :<Image style={styles.Img} source={require("../assets/images/no-poster.png")}/>
        }
        <View style={styles.Info}>
            <Text numberOfLines={2} style={styles.Title}>{AnimeTitle}</Text>
            <View style={{flexDirection:"row",alignItems:'center', columnGap:8}}>
            {isValidData(anime?.episodeNum) && <Text style={styles.Episode}>Episode {anime?.episodeNum}</Text> }

            {isValidData(anime?.subOrDub) && <Text style={[styles.Episode,{textTransform:"capitalize",}] }>({anime?.subOrDub})</Text> }

            </View>

            {isValidData(status) && <Text style={[styles.status]}>Status: {status}</Text> }
        </View>
      </View>
  )
})
const styles = StyleSheet.create({
    container:{
        width:145,
        flex:1,
        backgroundColor:color.DarkBackGround,
        overflow:"hidden",
        height:200,
        flexDirection:'column',
        shadowColor: color.White,
        elevation: 2,
        position:"relative",
        borderRadius:5,
    },
    Img:{
        // flex:1, 
        width:"100%",
        height:"100%",
        resizeMode:"cover",
    },
    Info:{
        width:"100%",
        flex:1,
        // gap:1,
        position:"absolute",
        bottom:0,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.70)",
        height:75,
        // paddingBottom:2,
        paddingVertical:5,
        paddingHorizontal:2,
    },
    Title:{
        fontSize:14,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
        textAlign:"center",
    },
    Episode:{
        color:color.Orange,
        // fontWeight:"800",
        fontSize:15,
        fontFamily:font.OpenSansBold,
        
    },
    status:{
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.OpenSansMedium,
        textTransform:"capitalize", 
        color:color.Cyan, 
        fontWeight:"800",
    },

})
export default AnimecardVertical