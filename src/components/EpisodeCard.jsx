import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo, useMemo } from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const EpisodeCard  = memo(({episode, anime, currentEpisode}) =>{
  const{currentLang}=useLanguage();
    // console.log(currentEpisode)
  let AnimeTitle,status;
  
    if(currentLang === "en"){
        AnimeTitle= (episode?.title?.english) || (episode?.title?.english_jp)
        // console.log(episode?.animeTitle)
    }else{
        AnimeTitle= (episode?.title?.english_jp) || (episode?.title?.japanese)
        // console.log(episode?.animeTitle?.english_jp)
    }
    if(episode?.AdditionalInfo?.status === "current"){
        status ="ongoing"
    }else{
        status = episode?.AdditionalInfo?.status
    }
    let Poster=anime?.animeImg;
    if(episode?.thumbnail !== null && episode?.thumbnail !==""){
        Poster= episode?.thumbnail
        // console.log(episode.thumbnail)
    }

  return (
      <View style={parseInt(currentEpisode) === episode?.number? styles.containerActive:styles.container}>
        
        <Image style={styles.Img} source={{uri:Poster }}/>
        <View style={styles.Info}>
            {
                AnimeTitle && <Text style={parseInt(currentEpisode) === episode?.number? styles.TitleActive:styles.Title}>{AnimeTitle}</Text>
            }
            <Text style={parseInt(currentEpisode) === episode?.number? styles.EpisodeActive:styles.Episode}>Episode {episode?.number}</Text>
            <Text style={parseInt(currentEpisode) === episode?.number? styles.statusActive:styles.status}>{episode?.hasDub ===true? "dub": "sub"}</Text>
            <Text style={parseInt(currentEpisode) === episode?.number? styles.EpisodeActive:styles.Episode}>{episode?.AdditionalInfo?.ageRatingGuide}</Text>
        </View>
      </View>
  )
})
const styles = StyleSheet.create({
    container:{
        backgroundColor:color.DarkBackGround2,
        // borderRadius:10,
        overflow:"hidden",
        height:100,
        flexDirection:'row',
        shadowColor: color.White,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
        marginVertical:5,
    },
    containerActive:{
        backgroundColor:color.Yellow,
        // borderRadius:10,
        overflow:"hidden",
        height:100,
        flexDirection:'row',
        shadowColor: color.White,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
        marginVertical:5,
    },
    Img:{
        // flex:1, 
        width:160,
        height:100,
        resizeMode:"cover",
    },
    Info:{
        paddingHorizontal:8,
        flex:1,
        gap:4,
    },
    Title:{
        fontSize:14,
        textTransform:"capitalize",
        fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.InterBlack,
    },
    TitleActive:{
        fontSize:14,
        textTransform:"capitalize",
        fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.InterBlack,
    },
    Episode:{
        color:color.LightGray,
        // fontWeight:"600",
        fontSize:16,
        fontFamily:font.InterMedium,

    },
    EpisodeActive:{
        color:color.White,
        // fontWeight:"600",
        fontSize:16,
        fontFamily:font.InterMedium,

    },
    status:{
        color:color.LightGray,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:16,
        fontFamily:font.PoppinsMedium,
    },
    statusActive:{
        color:color.White,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:16,
        fontFamily:font.PoppinsMedium,
    },

})

export default EpisodeCard