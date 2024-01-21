import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TouchableWithoutFeedback, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Video from "react-native-video";
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoControls from './VideoControls';
import { getAsynStorageData, storeAsynStorageData } from '../Utils/Functions';
import { useVideoPlayer } from '../Context/VideoPlayerContext';

export default function VideoPlayerr(props) {
  const {
    vId="__blank", 
    pQualities=[],
    url="__blank",
  } = props;
  const {videoState, setVideoState} = useVideoPlayer()
  const playbackRates = [0.25,0.5,1.0,1.5,2.0,2.5,3.0]

  const navigation = useNavigation();
  const VideoRef = useRef(null)
  // const [videoState, setVideoState] = useState({
  //   currentTime: 0.0,
  //   videoId:vId,
  //   playableDuration: 0.0,
  //   duration: 0.0,
  //   paused: true,
  //   playbackSpeed:1,
  //   isFullscreen: false,
  //   showControls: true,
  //   showSettings: false,
  //   qualities:pQualities,
  //   showQualitySetting:false,
  //   showPlaybackRateSetting:false,
  // videoResizeMode:"contain",
  //   currentQuality:{
  //     url:url,
  //     quality:"Unavailable",
  //   }
  // })

  const { isFullscreen,showControls, paused, showSettings, 
          showQualitySetting,currentQuality,videoId,
          playbackSpeed,showPlaybackRateSetting,isBuffering,isVideoScreen} = videoState;


  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (
        setVideoState(s => ({...s, isFullscreen: true})), 
        StatusBar.setHidden(true),
        navigation.setOptions({ tabBarStyle: { display: "none" }}))
      : (
        setVideoState(s => ({...s, isFullscreen: false})),
        StatusBar.setHidden(false),
        navigation.setOptions({ tabBarStyle: { display: undefined }})
        );
  }

  function handleFullscreen() {
    if(videoState.isFullscreen){
      if(isVideoScreen){
        Orientation.lockToPortrait()
      }else{
        Orientation.unlockAllOrientations();
      } 
      // setTimeout(() => {
      // }, 500);
    }else{
      if(isVideoScreen){
        Orientation.lockToLandscapeLeft();
      }else{
        Orientation.unlockAllOrientations();
      } 
      
      // Orientation.lockToPortrait()
    }
    // videoState.isFullscreen
    //   ? (Orientation.unlockAllOrientations())
    //   : Orientation.lockToLandscapeLeft();
  }

  function handleProgress(data) {
    setVideoState(prev => ({
      ...prev,
      currentTime: data?.currentTime,
    }));
    // console.log(data)
    if(videoState.currentTime >= data.playableDuration && !paused && !isBuffering){
      setVideoState(prev => ({
        ...prev,
        isBuffering: true,
      }));
    }else if(data.playableDuration > videoState.currentTime && !paused && isBuffering){
      setVideoState(prev => ({
        ...prev,
        isBuffering: false,
      }));
      // console.log("bufferuing")
    }
    storeAsynStorageData(videoId, JSON.stringify(data?.currentTime))
  }
/*
  LOG  {"canPlayFastForward": true, "canPlayReverse": true, "canPlaySlowForward": true, 
  "canPlaySlowReverse": true, "canStepBackward": true, "canStepForward": true, "currentTime": 0, 
  "duration": 1419.96, "naturalSize": {"height": 360, "orientation": "landscape", "width": 640}}
*/

  function handleOnLoad(data) {
    // console.log(data)
    let customQuality = `${data?.naturalSize?.height}P`;
    // console.log("onload")
    // console.log(currentQuality.quality)
    if(currentQuality.quality === "default" || currentQuality.quality === "backup"){
      customQuality=currentQuality.quality;
      // console.log('default')
    }

    getAsynStorageData(videoId)
    .then(res=>{
      
      if(res){
        // console.log(JSON.parse(res))
        handleSeek(JSON.parse(res))
        setVideoState(prev => ({
          ...prev,
          duration: data.duration,
          currentTime: JSON.parse(res),
          currentQuality:{
            ...prev.currentQuality,
            quality:customQuality,
          },
          isBuffering:false,
        }));
    
      }else{
        setVideoState(prev => ({
          ...prev,
          duration: data.duration,
          currentTime: data.currentTime,
          currentQuality:{
            ...prev.currentQuality,
            quality:customQuality,
          },
          isBuffering:false,
        }));
        // console.log("else")

      }
    }).catch(err=> console.log(err))
    //console.log("pass 1")
   // console.log("pass 2")
  }
  function handleOnEnd(){
    
  }
  function handleSeek(value){
    VideoRef.current.seek(value);
    setVideoState({...videoState, currentTime: value});
  }
  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }
  function handleControls(){
    //console.log("press")
    setVideoState(prev=>({
      ...prev,
      showControls:!showControls,
      showSettings:false,
      showQualitySetting:false,
      showPlaybackRateSetting:false,
    }))
  }
  function handlePlayPause(){
    //console.log("play/pause")
    setVideoState(prev=>({
      ...prev,
      paused:!paused,
    }))
  }
  function handleSetting(){
    //console.log("setting touch")
    setVideoState({
      ...videoState, 
      showSettings:!showSettings,
      showPlaybackRateSetting: (showPlaybackRateSetting === true) && false,
      showQualitySetting: (showQualitySetting === true) && false,
    })
  }
  function handleQualitySetting(){
    //console.log("qulity setting")
    setVideoState({...videoState, 
      showQualitySetting:!showQualitySetting,
      showSettings:!showSettings
    })
  }
  function handlePlaybackRateSetting(){
    //console.log("playbackrate setting")
    setVideoState({...videoState, 
      showPlaybackRateSetting:!showPlaybackRateSetting,
      showSettings:!showSettings
    })
  }
  function handlePlaybackSpeed(value){
    //console.log("playbackrate setting")
    setVideoState(prev=>({
      ...prev, 
      playbackSpeed:value,
    }))
  }
  function handleSetQuality(value){
    //console.log("set quality" + value.quality)
    let customQuality = `${value?.quality}P`;
    if(value?.quality === "default" || value?.quality === "backup"){
      customQuality=`${value?.quality}`
    }
    setVideoState(prev => ({
      ...prev,
      currentQuality:{
        ...prev.currentQuality,
        url:value?.url,
        quality:customQuality,
      },
    }));
  }
  function handleResizeSetting(){
    setVideoState(prev=>({
      ...prev,
      videoResizeMode: videoState.videoResizeMode === "contain"? "cover":"contain",
    }))
  }
  useEffect(()=>{
    //console.log(videoState.qualities)
  },[videoState.qualities])


  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);

    // Orientation.lockToLandscapeLeft();
    const vQuality = pQualities?.find(src => src?.url === url)
    setVideoState(prev=>({
      ...prev,
      qualities: pQualities,
      videoId:vId,
      currentQuality:{
        ...prev.currentQuality,
        url:url,
        quality:vQuality.quality,
      },
      isVideoScreen:true,
    }))
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);


  return videoState.currentQuality.url !=="" &&(
    <View style={isFullscreen ? styles.container:styles.container_noFlex}>
      <TouchableWithoutFeedback
        onPress={handleControls}
      >
      <View style={{backgroundColor:"black"}}>
      <Video
        ref={VideoRef}
        fullscreen={isFullscreen}
        style={isFullscreen ? styles.fullscreenVideo : styles.video}
        source={{uri:currentQuality?.url}}
        resizeMode={videoState.videoResizeMode}
        onLoad={handleOnLoad}
        // onLoadStart={handlePlaybackStatusUpdate}
        onEnd={handleOnEnd}
        onProgress={handleProgress}
        paused={paused}
        rate={playbackSpeed}
        // onBuffer={handleBuffer}
        // onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      {
        showControls&&(
          <View style={styles.controlOverlay}>
          <VideoControls 
            videoState={videoState}
            setVideoState={setVideoState}
            handleFullscreen={handleFullscreen}
            handleSeek={handleSeek}
            getMinutesFromSeconds={getMinutesFromSeconds}
            handleSetting={handleSetting}
            handlePlayPause={handlePlayPause}
            handleQualitySetting={handleQualitySetting}
            playbackRates={playbackRates}
            handlePlaybackRateSetting={handlePlaybackRateSetting}
            handlePlaybackSpeed={handlePlaybackSpeed}
            handleSetQuality={handleSetQuality}
            handleResizeSetting={handleResizeSetting}
          />
          </View>
        )
      }
      {isBuffering &&(
          <ActivityIndicator style={{position:"absolute", top:"40%", left:"45%", zIndex:9,}} color="white" size="large" />
      )}

      </View>

      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    position:"relative"
  },
  container_noFlex: {
    backgroundColor: '#ebebeb',
    position:"relative"
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
    paddingHorizontal:10,
    zIndex:11
  },
})