import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo, useMemo } from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';
import { dummy_image } from '../Utils/contstant';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
// let count = 1
const EpisodeCard  = ({episode, anime, currentEpisode}) =>{
  const{currentLang}=useLanguage();
    // console.log("episode card rendered" +count)
    // count++
    const AnimeTitle = useMemo(()=>{
        if(currentLang === "en"){
            if(isValidData(episode?.title?.english)){
                return episode?.title?.english
            }else if(isValidData(episode?.title?.english_jp)){
                return episode?.title?.english_jp
            }
        }else{
            if(isValidData(episode?.title?.english_jp)){
                return episode?.title?.english_jp
            }else if(isValidData(episode?.title?.japanese)){
                return episode?.title?.japanese
            }
        }
    },[episode?.title,currentEpisode])

    const status = useMemo(()=>{
        if(isValidData(episode?.AdditionalInfo?.status)){
            if(episode?.AdditionalInfo?.status === "current"){
                return "ongoing"
            }else {
                return episode?.AdditionalInfo?.status
            }
        }
    },[episode?.AdditionalInfo?.status,currentEpisode])

    const PosterComponent = useMemo(()=>{
        if(isValidData(episode?.thumbnail)){
           return episode?.thumbnail
        }else if(isValidData(anime?.animeImg)){
            return anime?.animeImg
        }else{
            return dummy_image
        }
    },[episode?.thumbnail, anime?.animeImg, currentEpisode])

    const AnimeTitleComponent = useMemo(()=>{
        return <Text numberOfLines={3} style={parseInt(currentEpisode) === episode?.number? styles.TitleActive:styles.Title}>{AnimeTitle}</Text>
    },[episode?.title,currentEpisode])

    const EpisodeNumberComponent = useMemo(()=>{
        return <Text numberOfLines={2} style={parseInt(currentEpisode) === episode?.number? styles.EpisodeActive:styles.Episode}>Episode {episode?.number}</Text>
    },[episode?.number,currentEpisode])

    const HasDubComponent = useMemo(()=>{
        return <Text style={parseInt(currentEpisode) === episode?.number? styles.statusActive:styles.status}>{episode?.hasDub ===true? "dub": "sub"}</Text>
    },[episode?.hasDub,currentEpisode])

    const AgeRatingComponent = useMemo(()=>{
        return <Text 
        style={
            parseInt(currentEpisode) === episode?.number ?
            styles.EpisodeActive:styles.Episode}>
            {episode?.AdditionalInfo?.ageRatingGuide}</Text>
    },[episode?.AdditionalInfo?.ageRatingGuide,currentEpisode])
     
    return(
        <View style={parseInt(currentEpisode) === episode?.number? styles.containerActive:styles.container}>
            {/* {PosterComponent} */}
            <Image style={styles.Img} source={{uri:PosterComponent}}/>
        <View style={styles.Info}>
            {AnimeTitleComponent}
            {EpisodeNumberComponent}
            {HasDubComponent}
            {AgeRatingComponent}
        </View>
      </View>
    )
}
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
        fontSize:12,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
    },
    TitleActive:{
        fontSize:12,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
    },
    Episode:{
        color:color.LightGray,
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.OpenSansMedium,

    },
    EpisodeActive:{
        color:color.White,
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.OpenSansMedium,

    },
    status:{
        color:color.LightGray,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.OpenSansMedium,
    },
    statusActive:{
        color:color.White,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.OpenSansMedium,
    },

})

export default memo(EpisodeCard)