import { View, Text, StyleSheet, Image } from 'react-native'
import React, { memo, useMemo } from 'react'
import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';
import { dummy_image } from '../Utils/contstant';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const AnimecardVertical= ({anime}) =>{
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
    },[anime?.animeTitle,currentLang])

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
            return <Text style={[styles.Episode,{textTransform:"capitalize",}] }>({anime?.subOrDub})</Text>
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

  return (
      <View style={styles.container}>
            {PosterComponent}
        <View style={styles.Info}>
            <Text numberOfLines={2} style={styles.Title}>{AnimeTitle}</Text>
            <View style={{flexDirection:"row",alignItems:'center', columnGap:8}}>
            {EpisodeNumberComponent}
            {SubDubComponent}
            </View>
            {StatusComponent}
        </View>
      </View>
  )
}
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
export default memo(AnimecardVertical)