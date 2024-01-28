import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function WatchListCard(props) {
const {anime, episodeId, watchingEpisode, watchedTime, duration} = props;

  const{currentLang}=useLanguage();
  let AnimeTitle,status=anime?.AdditionalInfo?.status;
    if(currentLang === "en"){
        AnimeTitle= (isValidData(anime?.animeTitle?.english) && anime?.animeTitle?.english) || (anime?.animeTitle?.english_jp)
    }else{
        AnimeTitle= (anime?.animeTitle?.english_jp) || (anime?.animeTitle?.japanese)
    }

    if(anime?.AdditionalInfo?.status === "current"){
        status ="ongoing"
    }
    const calculateWatchTime = ()=>{
        const cval = ((watchedTime/duration)*100).toFixed(0)
        if(isNaN(cval)) return 0
        return cval
    }

  return (
      <View style={styles.container}>
        <Image style={styles.Img} source={{uri:anime?.animeImg}}/>
        <View style={styles.Info}>
            <Text numberOfLines={3} style={styles.Title}>{AnimeTitle}</Text>
            <View style={{flexDirection:"row",alignItems:'center', columnGap:2}}>
            <Text style={[styles.Episode, {fontSize:15, color:color.White}]}>Episode {watchingEpisode}</Text> 
            {isValidData(anime?.subOrDub) && <Text style={[styles.Episode,{textTransform:"capitalize"}] }>({anime?.subOrDub})</Text> }

            </View>
            <Text style={styles.Episode}>Watched: {calculateWatchTime()}%</Text>
            {isValidData(anime?.year) && <Text style={styles.Episode}>Year: {
                anime?.year !== 0?anime?.year:anime?.AdditionalInfo?.startDate?.split("-")[0]
            }</Text> }
            {isValidData(anime?.AdditionalInfo?.status) && <Text style={[styles.Episode,{textTransform:"capitalize"}] }>Status: {status}</Text> }
        </View>
      </View>
  )
}



const styles = StyleSheet.create({
    container:{
        backgroundColor:color.DarkBackGround2,
        // borderRadius:10,
        overflow:"hidden",
        height:130,
        flexDirection:'row',
    },
    Poster:{
        flex:1,
        maxWidth:140,
        maxHeight:160,
        // backgroundColor:"red",
        position:"relative",
    },
    Img:{
        // flex:1, 
        width:100,
        height:160,
        resizeMode:"cover"
    },
    Info:{
        paddingHorizontal:8,
        flex:1,
        // gap:2,
        overflow:"hidden",
    },
    Title:{
        fontSize:15,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.InterBlack,
    },
    Episode:{
        color:color.LightGray,
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.InterMedium,

    },
    status:{
        color:color.LightGray,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.PoppinsMedium,
    },

})

