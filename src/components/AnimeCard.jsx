import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { filterNUE } from '../Utils/Functions';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function AnimeCard({anime}) {
  const{currentLang}=useLanguage();

  let AnimeTitle,status=anime?.AdditionalInfo?.status;

    if(currentLang === "en"){
        AnimeTitle= (filterNUE(anime?.animeTitle?.english) && anime?.animeTitle?.english) || (anime?.animeTitle?.english_jp)
    }else{
        AnimeTitle= (anime?.animeTitle?.english_jp) || (anime?.animeTitle?.japanese)
    }

    if(anime?.AdditionalInfo?.status === "current"){
        status ="ongoing"
    }

  return (
      <View style={styles.container}>
        <Image style={styles.Img} source={{uri:anime?.animeImg}}/>
        <View style={styles.Info}>
            <Text numberOfLines={4} style={styles.Title}>{AnimeTitle}</Text>
            <View style={{flexDirection:"row",alignItems:'center', columnGap:8}}>
            {filterNUE(anime?.episodeNum) && <Text style={styles.Episode}>Episode {anime?.episodeNum}</Text> }

            {filterNUE(anime?.subOrDub) && <Text style={[styles.Episode,{textTransform:"capitalize"}] }>({anime?.subOrDub})</Text> }

            </View>
            {filterNUE(anime?.year) && <Text style={styles.Episode}>Year: {
            anime?.year !== 0?anime?.year
            :anime?.AdditionalInfo?.startDate?.split("-")[0]
            }</Text> }
            {filterNUE(anime?.AdditionalInfo?.status) && <Text style={[styles.Episode,{textTransform:"capitalize"}] }>Status: {status}</Text> }
            {   
                filterNUE(anime?.AdditionalInfo?.ageRatingGuide) &&
                <Text style={styles.Episode}>{anime?.AdditionalInfo?.ageRating+ " - " +anime?.AdditionalInfo?.ageRatingGuide }</Text>
            }
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:color.DarkBackGround2,
        borderRadius:10,
        overflow:"hidden",
        height:135,
        flexDirection:'row',
        shadowColor: color.White,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
        marginVertical:5,
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
        paddingHorizontal:6,
        flex:1,
        gap:1,
    },
    Title:{
        fontSize:14,
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