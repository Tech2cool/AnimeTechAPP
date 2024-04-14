import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo, useMemo } from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';
import { dummy_image } from '../Utils/contstant';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const AnimeCard= memo(({anime}) =>{
    const{currentLang}=useLanguage();
    const AnimeTitle = useMemo(()=>{
        if(currentLang === "en"){
            if(isValidData(anime?.animeTitle?.english)){
                return anime?.animeTitle?.english
            }else if(isValidData(anime?.animeTitle?.english_jp)){
                return anime?.animeTitle?.english_jp
            }
        }else{
            if(isValidData(anime?.animeTitle?.english_jp)){
                return anime?.animeTitle?.english_jp
            }else if(isValidData(anime?.animeTitle?.japanese)){
                return anime?.animeTitle?.japanese
            }
        }
    },[anime?.animeTitle, currentLang])

    const status = useMemo(()=>{
        if(isValidData(anime?.status)){
            return anime?.status
        }else{
            if(anime?.AdditionalInfo?.status === "current"){
                return "ongoing"
            }else {
                return anime?.AdditionalInfo?.status
            }
        }
    },[anime?.status, anime?.AdditionalInfo?.status])

    const StatusComponent = useMemo(()=>{
        if(isValidData(status)){
            return <Text style={[styles.status]}>Status: {status}</Text>
        }
    },[anime?.status, anime?.AdditionalInfo?.status])
    
    const SubDubComponent = useMemo(()=>{
        if(isValidData(anime?.subOrDub)){
            return <Text style={[styles.Episode,{textTransform:"capitalize",}] }>{anime?.subOrDub}</Text>
        }
    },[anime?.subOrDub])

    const EpisodeNumberComponent = useMemo(()=>{
        if(isValidData(anime?.episodeNum)){
            return <Text style={styles.Episode}>Episode {anime?.episodeNum}</Text>
        }
    },[anime?.episodeNum])

    const PosterComponent = useMemo(()=>{
        if(isValidData(anime?.animeImg)){
            return <Image style={styles.Img} source={{uri:anime?.animeImg}}/>
        }else{
            return <Image style={styles.Img} source={{uri:dummy_image}}/>
        }
    },[anime?.animeImg])

    const YearComponent = useMemo(()=>{
        if(isValidData(anime?.year) && anime?.year !== 0){
            return <Text style={styles.Episode}>Year: {anime?.year}</Text>
        }else if(isValidData(anime?.AdditionalInfo?.startDate) ){
            return <Text style={styles.Episode}>Year: {anime?.AdditionalInfo?.startDate?.split("-")[0]}</Text>
        }
    },[anime?.year,anime?.AdditionalInfo?.startDate])

    const AgeRatingComponent = useMemo(()=>{
        if(isValidData(anime?.AdditionalInfo?.ageRatingGuide)){
            return <Text style={styles.Episode}>{anime?.AdditionalInfo?.ageRating+ " - " +anime?.AdditionalInfo?.ageRatingGuide }</Text>
        }
    },[anime?.AdditionalInfo?.ageRatingGuide, anime?.AdditionalInfo?.ageRating])
  return (
      <View style={styles.container}>
            {PosterComponent}
        <View style={styles.Info}>
            <Text numberOfLines={4} style={styles.Title}>{AnimeTitle}</Text>
            <View style={{flexDirection:"row",alignItems:'center', columnGap:8}}>
            {EpisodeNumberComponent}
            {SubDubComponent}
            </View>
            {YearComponent}
            {StatusComponent}
            {AgeRatingComponent}
        </View>
      </View>
  )
})
const styles = StyleSheet.create({
    container:{
        backgroundColor:color.DarkBackGround,
        borderRadius:10,
        borderColor:color.LighterGray,
        borderWidth:1,
        overflow:"hidden",
        height:135,
        flexDirection:'row',
        elevation: 2,
        margin:5
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

export default AnimeCard