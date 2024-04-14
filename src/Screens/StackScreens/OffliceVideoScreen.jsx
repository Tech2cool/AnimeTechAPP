import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ThemeColors from '../../Utils/ThemeColors';
import VideoPlayerr from '../../components/VideoPlayer';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { zIndex } from '../../Utils/contstant';
import DownloadCard from '../../components/DownloadCard';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { isValidData } from '../../Utils/Functions';
import { IIcon, MIcon } from '../../Utils';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const { height: SCREEN_HIEGHT } = Dimensions.get("window");

const OfflineVideoScreen = ({ route, navigation }) => {
  const { url, episode, id, quality, anime,status } = route.params;
  const { videoState,setVideoState } = useVideoPlayer();
  const handleGoBack = () => {
      navigation.goBack()
      setVideoState(prev=>({
        ...prev,
        offlineMode:false,
    }))
  }
  let AnimeTitle;
  if(isValidData(anime?.animeTitle?.english)){
    AnimeTitle = anime?.animeTitle?.english
  }else if(isValidData(anime?.animeTitle?.english_jp)){
    AnimeTitle = anime?.animeTitle?.english_jp
  }else if(isValidData(anime?.animeTitle?.japanese)){
    AnimeTitle = anime?.animeTitle?.japanese
  }
  useEffect(()=>{
    setVideoState(prev=>({
        ...prev,
        offlineMode:true,
    }))
  },[])
  const content =(
  <VideoPlayerr
    vId={episode?.id}
    // url={sources?.find(src => src?.quality === "default") ? sources?.find(src => src.quality === "default")?.url : sources[0]?.url}
    url={url}
    goback={handleGoBack}
  />)

  if (videoState.isFullscreen) {
    return (
      <View style={[{ flex: 1, position: "relative", backgroundColor: color.DarkBackGround }]}>
        {content}
      </View>
    )
  }
  else {
    return (
      <View style={[{ flex: 1, backgroundColor: color.DarkBackGround, position: "relative", zIndex: zIndex.CENTER }]}>
        {content}
        <View style={[styles.Info, { position: "relative" }]}>
          {/* anime Title */}
            <Text 
            style={{ 
              fontFamily: font.OpenSansBold, 
              fontSize: 16, 
              color:color.Orange,
            }}
            >{AnimeTitle}</Text>
          <View style={{flexDirection:"row", gap:20, paddingTop:10}}>
          <Text 
            style={{ 
              color: color.White, 
              fontFamily: font.InterMedium, 
              fontSize: 16, 
            }}
            >Episode {episode?.number}</Text>
            <MIcon name={status==="downloading"?"downloading":"cloud-done"} size={25} color={color.White} />
            {
              status ==="downloading" &&
              <Text style={{color:color.Red, fontFamily:font.OpenSansBold}}>Your Anime is Downloading it can be played after completing Download</Text>
            }
          </View>
        </View>
      </View>

    )
  }
}
const styles = StyleSheet.create({
  backbtn: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: zIndex.CENTER,
    marginTop: 8,
    marginLeft: 8,
  },
  Info: {
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
    flex: 1,
    position: "relative",
    backgroundColor: color.DarkBackGround
    // paddingBottom:160
  },
  Mybtns: {
    padding: 8,
    backgroundColor: color.DarkBackGround2,
    minWidth: 100,
    borderWidth: 1,
    borderColor: color.Orange,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default OfflineVideoScreen