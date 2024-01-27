import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TouchableWithoutFeedback, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Video from "react-native-video";
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';
import VideoControls from './VideoControls';
import { getAsynStorageData, storeAsynStorageData } from '../Utils/Functions';
import { useVideoPlayer } from '../Context/VideoPlayerContext';
import { Slider } from '@react-native-assets/slider'
import ThemeColors from '../Utils/ThemeColors';
import { zIndex } from '../Utils/contstant';

const color = ThemeColors.DARK
let progressCount = 1;
let lastPress = 0;
export default function VideoPlayerr(props) {
  const {
    vId = "__blank", 
    pQualities = [],
    url = "__blank",
    goback,
  } = props;
  const { videoState, setVideoState } = useVideoPlayer()
  const playbackRates = [0.25, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]

  const navigation = useNavigation();
  const VideoRef = useRef(null)
  const RippleTimerRef = useRef(null)
  const seekingTimerRef = useRef(null)

  const { isFullscreen, showControls, paused, showSettings,
    showQualitySetting, currentQuality, videoId,
    playbackSpeed, showPlaybackRateSetting, isBuffering, isVideoScreen } = videoState;

  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (
        setVideoState(s => ({ ...s, isFullscreen: true })),
        StatusBar.setHidden(true),
        navigation.setOptions({ tabBarStyle: { display: "none" } }))
      : (
        setVideoState(s => ({ ...s, isFullscreen: false })),
        StatusBar.setHidden(false),
        navigation.setOptions({ tabBarStyle: { display: undefined } })
      );
  }
  function handleFullscreen() {
    if (videoState.isFullscreen) {
      if (isVideoScreen) {
        Orientation.lockToPortrait()
      } else {
        Orientation.unlockAllOrientations();
      }
      // setTimeout(() => {
      // }, 500);
    } else {
      if (isVideoScreen) {
        Orientation.lockToLandscapeLeft();
      } else {
        Orientation.unlockAllOrientations();
      }
    }
  }
  function handleProgress(data) {
    if (!paused && !videoState.isSeeking) {
      setVideoState(prev => ({
        ...prev,
        currentTime: data?.currentTime,
      }));
      if (videoState.currentTime >= data.playableDuration && !isBuffering) {
        setVideoState(prev => ({
          ...prev,
          isBuffering: true,
        }));
      } else if (data.playableDuration > videoState.currentTime && isBuffering) {
        setVideoState(prev => ({
          ...prev,
          isBuffering: false,
        }));
        // console.log("bufferuing")
      }
      // console.log("showQualitySetting"+showQualitySetting)
      // console.log("showPlaybackRateSetting"+showPlaybackRateSetting)
      if ((progressCount > 15 && showControls) && (!showQualitySetting && !showPlaybackRateSetting)) {
        setVideoState(prev => ({
          ...prev,
          showControls: false,
        }));
        progressCount = 1;
      } else if (showControls) {
        progressCount++
      }

      storeAsynStorageData(videoId, JSON.stringify(data?.currentTime))
    }
  }
  function handleOnLoad(data) {
    // console.log(data)
    let customQuality = `${data?.naturalSize?.height}P`;
    // console.log("onload")
    // console.log(currentQuality.quality)
    if (currentQuality.quality === "default" || currentQuality.quality === "backup") {
      customQuality = currentQuality.quality;
      // console.log('default')
    }

    getAsynStorageData(videoId)
      .then(res => {

        if (res) {
          // console.log(JSON.parse(res))
          handleSeek(JSON.parse(res))
          setVideoState(prev => ({
            ...prev,
            duration: data.duration,
            currentTime: JSON.parse(res),
            currentQuality: {
              ...prev.currentQuality,
              quality: customQuality,
            },
            isBuffering: false,
          }));

        } else {
          setVideoState(prev => ({
            ...prev,
            duration: data.duration,
            currentTime: data.currentTime,
            currentQuality: {
              ...prev.currentQuality,
              quality: customQuality,
            },
            isBuffering: false,
          }));
          // console.log("else")

        }
      }).catch(err => console.log(err))
    //console.log("pass 1")
    // console.log("pass 2")
  }
  function handleOnEnd() {
    setVideoState(prev => ({
      ...prev,
      paused: true,
      isBuffering: false,
    }));
  }
  function handleSeek(value) {
    VideoRef.current.seek(value);
    setVideoState(prev=>(
      { 
        ...prev, 
        currentTime: value, 
        isSeeking: !videoState.isSeeking && true 
      }
    ));

    clearTimeout(seekingTimerRef.current)
    seekingTimerRef.current= setTimeout(() => {
      setVideoState(prev=>({
          ...prev, 
          isSeeking: false,
      }));
    }, 300);
  }
  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds
      }`;
  }
  function handleControls() {
    //console.log("press")
    const time = new Date().getTime();
    const delta = time - lastPress;

    const DOUBLE_PRESS_DELAY = 300;
    if (delta < DOUBLE_PRESS_DELAY) {
      // Success double press
      // console.log('double press');
      setVideoState(prev => ({
        ...prev,
        isDoubleTapActive:true,
        
      }))

    } 
      // console.log('single press');
      lastPress=time
      if(lastPress >0 && delta > DOUBLE_PRESS_DELAY){
        setVideoState(prev => ({
          ...prev,
          showControls: !showControls,
          showSettings: false,
          showQualitySetting: false,
          showPlaybackRateSetting: false,
        }))
      }
  }
  function handleRippleLeft(){
    // console.log("rippleLeft")
    
    handleSeek(videoState.currentTime -10)
    const seektime= videoState.totalSeekTime - 10

    // if(!videoState.isSeekingLeft){
      // console.log("set left true")
      setVideoState(prev=>({
        ...prev,
        isSeekingLeft:true,
        totalSeekTime:seektime
      }))
    // }

    clearTimeout(RippleTimerRef.current)
    RippleTimerRef.current= setTimeout(() => {
      setVideoState(prev=>({
        ...prev,
        isDoubleTapActive:false,
        isSeekingLeft:false,
        totalSeekTime:0,
      }))
    }, 1000);
  }
  function handleRippleRight(){
    // console.log("rippleRight")
    handleSeek(videoState.currentTime+10)
    // if(!videoState.isSeekingRight){
      const seektime= videoState.totalSeekTime + 10
      // console.log("set right true")
      setVideoState(prev=>({
        ...prev,
        isSeekingRight:true,
        totalSeekTime:seektime
      }))
    // }

    clearTimeout(RippleTimerRef.current)
    RippleTimerRef.current= setTimeout(() => {
      setVideoState(prev=>({
        ...prev,
        isDoubleTapActive:false,
        isSeekingRight:false,
        totalSeekTime:0,
      }))
    }, 1000);
  }
  function handlePlayPause() {
    //console.log("play/pause")
    setVideoState(prev => ({
      ...prev,
      paused: !paused,
    }))
  }
  function handleSetting() {
    //console.log("setting touch")
    setVideoState({
      ...videoState,
      showSettings: !showSettings,
      showPlaybackRateSetting: (showPlaybackRateSetting === true) && false,
      showQualitySetting: (showQualitySetting === true) && false,
    })
  }
  function handleQualitySetting() {
    //console.log("qulity setting")
    setVideoState({
      ...videoState,
      showQualitySetting: !showQualitySetting,
      showSettings: !showSettings
    })
  }
  function handlePlaybackRateSetting() {
    //console.log("playbackrate setting")
    setVideoState({
      ...videoState,
      showPlaybackRateSetting: !showPlaybackRateSetting,
      showSettings: !showSettings
    })
  }
  function handlePlaybackSpeed(value) {
    //console.log("playbackrate setting")
    setVideoState(prev => ({
      ...prev,
      playbackSpeed: value,
    }))
  }
  function handleSetQuality(value) {
    //console.log("set quality" + value.quality)
    let customQuality = `${value?.quality}P`;
    if (value?.quality === "default" || value?.quality === "backup") {
      customQuality = `${value?.quality}`
    }
    setVideoState(prev => ({
      ...prev,
      currentQuality: {
        ...prev.currentQuality,
        url: value?.url,
        quality: customQuality,
      },
    }));
  }
  function handleResizeSetting() {
    setVideoState(prev => ({
      ...prev,
      videoResizeMode: videoState.videoResizeMode === "contain" ? "cover" : "contain",
    }))
  }
  useEffect(() => {
    //console.log(videoState.qualities)
  }, [videoState.qualities])

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);

    // Orientation.lockToLandscapeLeft();
    const vQuality = pQualities?.find(src => src?.url === url)
    setVideoState(prev => ({
      ...prev,
      qualities: pQualities,
      videoId: vId,
      currentQuality: {
        ...prev.currentQuality,
        url: url,
        quality: vQuality.quality,
      },
      isVideoScreen: true,
    }))
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const handlegoBack = () => {
    if (goback) {
      // console.log("gobackc");
      goback()
    }
    else {
      // console.log("no back");
      navigation.goBack()
    }
  }

  return videoState.currentQuality.url !== "" && (
    <View style={isFullscreen ? styles.container : styles.container_noFlex}>
      <TouchableWithoutFeedback
        onPress={handleControls}
      >
        <View style={[videoId.resizeMode === "cover" && styles.fullcenter, { backgroundColor: "black" }]}>
          <Video
            ref={VideoRef}
            fullscreen={isFullscreen}
            style={isFullscreen ? styles.fullscreenVideo : styles.video}
            source={{ uri: currentQuality?.url }}
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
          {/* { */}
            {/* // showControls ? ( */}
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
                  handlegoBack={handlegoBack}
                  handleRippleRight={handleRippleRight}
                  handleRippleLeft={handleRippleLeft}
                />
              </View>
            {/* // ) : ( */}
            {
              !isFullscreen && !showControls &&(
                <View style={styles.controlOverlay2}>
                  <Slider
                    value={videoState.currentTime}
                    // value={50}
                    minimumValue={0}                  // Minimum value
                    maximumValue={videoState.duration} // Maximum value
                    thumbTintColor={color.Red}
                    thumbSize={3}
                    // onValueChange={handleSeek}
                    slideOnTap={false}
                    trackHeight={3}
                    step={1}
                    minimumTrackTintColor={color.Red}
                  // minimumTrackTintColor={"#008cff"}
                  />
                </View>
              )
            }
            {/* // ) */}
          {/*  } */}
          {isBuffering && (
            <ActivityIndicator style={{ position: "absolute", top: "40%", left: "45%", zIndex: zIndex.CENTER, }} color="white" size="large" />
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
    position: "relative",
    zIndex: zIndex.TOP,
  },
  container_noFlex: {
    backgroundColor: '#ebebeb',
    position: "relative",
    zIndex: zIndex.TOP,
  },
  fullcenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
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
    // backgroundColor: 'red',
    // backgroundColor: '#000000c4',
    justifyContent: 'space-between',
    // paddingHorizontal:10,
    zIndex: zIndex.TOP,
    // opacity:0
  },
  controlOverlay2: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: Dimensions.get("window").width,
    // backgroundColor: 'red',
    // justifyContent: 'space-between',
    // paddingHorizontal:10,
    zIndex: zIndex.TOP
  },
})