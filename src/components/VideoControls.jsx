import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import { Slider } from '@react-native-assets/slider'
import { useNavigation } from '@react-navigation/native';

export default function VideoControls(props) {
  const navigation = useNavigation();
  
  const { videoState, setVideoState, handleFullscreen, handleSeek,
    getMinutesFromSeconds, handleSetting,handlePlayPause, handleQualitySetting, 
    playbackRates, handlePlaybackRateSetting, handlePlaybackSpeed,handleSetQuality,handleResizeSetting} = props;

  const { currentTime, duration, showSettings, isFullscreen,
    showQualitySetting, showPlaybackRateSetting,playbackSpeed,currentQuality} = videoState;

  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);
  const BtnSize = 35;
  const BtnClr = "white";
  return (
    <View style={styles.wrapper}>
      <View style={isFullscreen ? styles.settingOvarlayFullscreen : styles.settingOvarlay}>
      {
          showPlaybackRateSetting && (
            <ScrollView style={styles.qualityWrapper}>
              <TouchableOpacity
                onPress={handlePlaybackRateSetting}
                style={styles.qualityHeading}>
                <MIcon name={"keyboard-arrow-left"} size={25} color={BtnClr} />
                <Text style={{ color: "white", padding: 4, fontWeight: "600" }}>Playback Rates</Text>
              </TouchableOpacity>
              {
                playbackRates.map((rate, index) => (
                  <TouchableOpacity
                  onPress={()=> handlePlaybackSpeed(rate)}
                  style={playbackSpeed === rate? styles.qualityItemActive: styles.qualityItem} 
                  key={index}
                  >
                    <Text style={{ color: "white", padding: 4, fontWeight: "600" }}>{`${rate}X`}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          )
        }        
        {
          showQualitySetting && (
            <ScrollView style={styles.qualityWrapper}>
              <TouchableOpacity
                onPress={handleQualitySetting}
                style={styles.qualityHeading}>
                <MIcon name={"keyboard-arrow-left"} size={25} color={BtnClr} />
                <Text style={{ color: "white", padding: 4, fontWeight: "600" }}>Quality Setting</Text>
              </TouchableOpacity>
              {
                videoState?.qualities?.length > 0 ? videoState?.qualities?.map((quality,index) => (
                  <TouchableOpacity
                  onPress={()=> handleSetQuality(quality)}
                  style={currentQuality.quality.toLowerCase() === quality.quality? styles.qualityItemActive: styles.qualityItem} 
                  key={index}
                  >
                    <Text style={{ color: "white", padding: 4, fontWeight: "600" }}>{`${quality?.quality}`}</Text>
                  </TouchableOpacity>
                )) : (
                  <TouchableOpacity style={styles.qualityItem}>
                    <Text style={{ color: "white", padding: 4, fontWeight: "600" }}>Unavailable</Text>
                  </TouchableOpacity>

                )
              }
            </ScrollView>
          )
        }

        {
          /* main Setting Option start */
          showSettings && (
            <View style={isFullscreen ? styles.settinWrapperFullscreen : styles.settinWrapper}>
              {/* PlaybackRate Tab Start */}
              <TouchableOpacity 
              onPress={handlePlaybackRateSetting}
              style={styles.settingLI}
              >
                <View style={styles.settingItem}>
                  <MIcon name={"display-settings"} size={22} color={BtnClr} />
                  <Text style={{ color: "white", paddingLeft: 4, fontWeight: "600" }}>Playback Rate</Text>
                </View>
                <View style={styles.settingSubItem}>
                  <Text style={{ paddingLeft: 4, color: "#adadad" }}>1X</Text>
                  <MIcon name={"keyboard-arrow-right"} size={25} color={BtnClr} />
                </View>
              </TouchableOpacity>
              {/* PlaybackRate Tab end */}

              {/* Quality Tab start */}
              <TouchableOpacity
                style={styles.settingLI}
                onPress={handleQualitySetting}
              >
                <View style={styles.settingItem}>
                  <MIcon name={"play-circle"} size={20} color={BtnClr} />
                  <Text style={{ color: "white", paddingLeft: 4, fontWeight: "600" }}>Quality</Text>
                </View>
                <View style={styles.settingSubItem}>
                  <Text style={{ color: "#adadad" }}>{currentQuality.quality}</Text>
                  <MIcon name={"keyboard-arrow-right"} size={25} color={BtnClr} />
                </View>
              </TouchableOpacity>
              {/* Quality Tab end */}

              {/* Quality Tab start */}
              <TouchableOpacity
                style={styles.settingLI}
                onPress={handleResizeSetting}
              >
                <View style={styles.settingItem}>
                  <MIcon name={"display-settings"} size={20} color={BtnClr} />
                  <Text style={{ color: "white", paddingLeft: 4, fontWeight: "600" }}>Resize</Text>
                </View>
                <View style={styles.settingSubItem}>
                  <Text style={{ color: "#adadad" }}>{videoState.videoResizeMode}</Text>
                  <MIcon name={"keyboard-arrow-right"} size={25} color={BtnClr} />
                </View>
              </TouchableOpacity>
              {/* Quality Tab end */}

            </View>
          )
          /* main Setting Option end */
        }

      </View>
      {/* Top Controls */}
      <View style={styles.topWrapper}>
        <View style={styles.topWrapperRight}>
          {/* GoBack start*/}
          <IIcon name={"arrow-back"} size={25} color={"#ffff"} onPress={()=>navigation.goBack()}/>
          {/* GoBack end */}
          {/* Setting start*/}
          {/* <Text style={{ color: "red" }}>fullscreen</Text> */}
          <IIcon name={"settings-outline"} size={30} color="#ffff" onPress={handleSetting}/>
          {/* Setting end*/}
        </View>

      </View>

      {/* Center Controls */}
      <View style={styles.centerWrapper}>
        {/* Rewind 10s */}
          {/* <Text>Play/Pause</Text> */}
          <MCIcon 
            name="rewind-10" 
            size={BtnSize} 
            color={BtnClr}
            onPress={() => {(currentTime - 10 > 0) && handleSeek(currentTime - 10) }}
          />
        {/* Play/Pause */}
        {/* <Text>Play/Pause</Text> */}
        <MCIcon 
          name={videoState.paused ? "play" : "pause"} 
          size={50} color={BtnClr} 
          onPress={handlePlayPause}
        />

        {/* Forward 10s */}
        {/* <Text>Play/Pause</Text> */}
        <MCIcon 
          name="fast-forward-10" 
          size={BtnSize} 
          color={BtnClr} 
          onPress={() => handleSeek(currentTime + 10)}
        />
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomWrapper}>
        <View style={styles.bottomWrapperControls}>

          <View style={styles.timeWrapper}>
            <Text style={styles.timeLeft}>{position}</Text>
            <Text style={styles.timeDevider}>/</Text>
            <Text style={styles.timeRight}>{fullDuration}</Text>
          </View>

          {/* fullscreen start*/}
            <MCIcon 
            // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.fullscreenButton}
              name={videoState.isFullscreen ? "fullscreen-exit" : "fullscreen"} 
              size={BtnSize} 
              color="white"
              onPress={handleFullscreen}
            />
          {/* fullscreen end*/}


        </View>
        {/* Slider start */}
        <View style={styles.wrapperSlider}>
          <Slider
            value={videoState.currentTime}
            // value={50}
            minimumValue={0}                  // Minimum value
            maximumValue={videoState.duration} // Maximum value
            thumbTintColor="#008cff"
            thumbSize={18}
            onValueChange={handleSeek}
            slideOnTap={true}
            trackHeight={8}
            step={1}
            minimumTrackTintColor={"#008cff"}
          />
        </View>
        {/* Slider end */}

      </View>

      <TouchableOpacity>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: "column",
    display: "flex",
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    position: "relative",
  },
  settingOvarlay: {
    position: "absolute",
    flex: 1,
    right: 10,
    top: 50,
    maxWidth: 200,
    maxHeight: 140,
    zIndex: 10,
  },
  settingOvarlayFullscreen: {
    position: "absolute",
    flex: 1,
    right: 10,
    top: 50,
    maxWidth: 300,
    maxHeight: 300,
    zIndex: 10,
  },

  settinWrapper: {
    backgroundColor: "#0b0b0b",
    shadowColor: "white",
    elevation: 10,
    overflow: "scroll",
    borderRadius: 10,
    padding: 10,
  },
  settinWrapperFullscreen: {
    backgroundColor: "#0b0b0b",
    shadowColor: "white",
    elevation: 10,
    flex: 1,
    overflow: "scroll",
    borderRadius: 10,
    padding: 20,
  },
  settingLI: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 10,
    borderBottomColor: "white",
    borderWidth: 1,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  settingSubItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 2,
    // backgroundColor:"red",
  },
  qualityWrapper: {
    backgroundColor: "#0b0b0b",
    shadowColor: "white",
    elevation: 10,
    borderRadius: 10,
    padding: 10,
  },
  qualityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop:0,
    borderRadius:10,
  },
  qualityItemActive: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop:5,
    backgroundColor:"#ff7b00",
    borderRadius:10,
  },
  qualityHeading: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 0,
    borderBottomColor: "white",
    borderWidth: 0.5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "transparent",
  },
  topWrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  topWrapperRight: {
    gap: 10,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 10,
  },
  centerWrapper: {
    width: "100%",
    flex: 2,
    // backgroundColor:"green",
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    alignItems: "center",
    position: "relative",
  },
  bottomWrapper: {
    width: "100%",
    flex: 1,
    // backgroundColor:"lightblue",
    position: "relative",
    flexDirection: "column",
    
  },
  bottomWrapperControls: {
    // backgroundColor:"blue",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  wrapperSlider: {
    flex: 1,
    marginTop:5,
    // paddingVertical: 4,
    paddingHorizontal: 2,
    // backgroundColor:"red",
    justifyContent:"center"
  },
  fullscreenButton: {
    // flex: 1,
    // position:"absolute",

    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 5,
    // backgroundColor:"red",
    // right: 0,
  },

  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
  timeWrapper: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    // backgroundColor:"red",
    width: 150,
    // flex:1,
  },
  timeLeft: {
    // flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 5,
  },
  timeDevider: {
    marginHorizontal: 4,
    color: "gray",
  },
  timeRight: {
    // flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    // textAlign: 'right',
    // paddingRight: 10,
  },
})