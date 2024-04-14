import { Dimensions, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MCIcon, ThemeColors } from '../Utils';
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useInternet } from '../Context/InternetContext';
import { getAsynStorageData, isValidData } from '../Utils/Functions';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { zIndex } from '../Utils/contstant';
import { useLanguage } from '../Context/LanguageContext';
import RNFS from 'react-native-fs';

import { Slider } from '@react-native-assets/slider';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
const myWatchListKey = "download_";
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const ITEM_HEIGHT = 130
const { width } = Dimensions.get("window")
const TranselateX_Treshould = -width * .3

const DownloadCardPageCard = ({ data, handleSingleDelete,setDownloaded,fetchData }) => {
    const navigation = useNavigation()
    const { isOnline } = useInternet()
    const { currentLang } = useLanguage()
    const [progress, setProgress] = useState(0);
    const interValRef = useRef(null)

    const animeTitle = useMemo(() => {
        const titleBase = data?.value?.anime?.animeTitle;
        if (currentLang === "en") {
            if (isValidData(titleBase?.english)) {
                return titleBase?.english
            } else if (isValidData(titleBase?.english_jp)) {
                return titleBase?.english_jp
            }
        } else {
            if (isValidData(titleBase?.english_jp)) {
                return titleBase?.english_jp
            } else if (isValidData(titleBase?.japanese)) {
                return titleBase?.japanese
            }
        }
    })

    // console.log(data?.value?.status)
    // const directoryPath = data?.value?.url?.slice(7)

    useEffect(() => {
        interValRef.current = setInterval(() => {
            getAsynStorageData(data?.Id).then((res) => {
                const parsed = JSON.parse(res)
                // console.log(parsed?.status)
                if (parsed?.status?.toLowerCase() === "downloading") {
                    setProgress(parsed?.progress)
                }
                else if (parsed?.status?.toLowerCase() === "downloaded") {
                    // setProgress(99)
                    setProgress(100)
                    fetchData()
                    clearInterval(interValRef.current)
                }
            })
            .catch(err => {
                // ToastAndroid.show("err:::" + err, ToastAndroid.SHORT)
                // console.log(err)
            })
        }, 1000);
        return ()=>clearInterval(interValRef.current)
    }, [])

    const handleonCancel = async (sessionId) => {
        // console.log("canceled")
        FFmpegKit.cancel(sessionId);
    }

    const translateX = useSharedValue(0)
    // const context = useSharedValue({y:0})
    const itemHeight = useSharedValue(ITEM_HEIGHT)
    const marginVertical = useSharedValue(5)

    const deleteItem = (id, sessionId) => {
        // console.log("deleted")
        handleSingleDelete(id, animeTitle)
        // if(data?.value?.status === "downloading"){
        //     FFmpegKit.cancel(parseInt(sessionId))
        //     .then((res) => ToastAndroid.show("Download canceled", ToastAndroid.SHORT))
        //     .catch((err)=>ToastAndroid.show("Failed delete/cancel", ToastAndroid.SHORT))
        // }
    }

    const panGesture = Gesture.Pan()
        .onStart(() => { })
        .onUpdate((e) => {
            translateX.value = e.translationX
            // console.log(e)
        })
        .onEnd(() => {
            const isDismisss = translateX.value < TranselateX_Treshould
            if (isDismisss) {
                translateX.value = withTiming(-width)
                itemHeight.value = withTiming(0)
                marginVertical.value = withTiming(0)
                // console.log(mainId)
                runOnJS(deleteItem)(data?.Id, data?.value?.sessionId)
            } else {
                translateX.value = withTiming(0)
            }
        })

    const rStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value
            }
        ]
    }))

    const rIconContainerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < TranselateX_Treshould ? 1 : 0)
        return { opacity }
    })

    const rTaskContainerStye = useAnimatedStyle(() => {
        return {
            height: itemHeight.value,
            marginVertical: marginVertical.value
        }
    })

    return (
        <Animated.View style={[{ flex: 1 }, rTaskContainerStye]}>
            <GestureDetector gesture={panGesture} nestedScrollEnabled={true}>
                <Animated.View style={[{
                    height: "100%", width: 120, backgroundColor: "transparent",
                    position: "absolute", right: 0, zIndex: zIndex.TOP
                }, rStyle]}></Animated.View>
            </GestureDetector>
            <Animated.View style={[{
                position: "absolute",
                right: 10,
                width: ITEM_HEIGHT / 1.5,
                height: ITEM_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
            }, rIconContainerStyle]}>
                <MCIcon name="delete-outline" size={50} color={color.Red} />
            </Animated.View>
            <Animated.View style={[styles.container, rStyle]}>
                <Image
                    style={styles.Poster}
                    source={{ uri: data?.value?.anime?.animeImg }}
                />
                <View style={styles.InfoContainer}>
                    {
 
                    }

                    <Text numberOfLines={2} style={styles.Title}>{animeTitle}</Text>
                    <Text style={styles.Episode}>Episode {data?.value?.item?.number}</Text>
                    <Text style={styles.quality}>Quality: {data?.value?.quality?.toUpperCase()}</Text>
                    <View style={styles.progressContainer}>
                        {
                            data?.value?.progress === 100 ? (<>
                                <Text style={styles.downloaded}>Status: Downloaded</Text>
                            </>) : (<>
                                <Slider
                                    minimumValue={0}
                                    value={parseInt(progress)}
                                    trackHeight={15}
                                    thumbStyle={{
                                        // borderTopRightRadius:10,
                                        // borderBottomRightRadius:10,
                                        borderBottomLeftRadius: 0,
                                        borderTopLeftRadius: 0,
                                        thumbSize: 10,
                                    }}
                                    trackStyle={{
                                        paddingLeft: 5,

                                    }}
                                    thumbTintColor={color.AccentBlue}
                                    // style={{overflow:"hidden"}}
                                    minimumTrackTintColor={color.AccentBlue}
                                    maximumValue={100}
                                    width={"75%"}
                                    style={{
                                        overflow: "hidden",
                                        opacity: progress === 0 ? 0 : 1,
                                    }}
                                />
                                <Text style={[styles.progress, { opacity: progress === 0 ? 0 : 1 }]}>{progress?.toFixed(0)}%</Text>
                            </>)
                        }
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    )
}

export default DownloadCardPageCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.DarkBackGround,
        // marginVertical:2,
        borderRadius: 10,
        overflow: "hidden",
        marginHorizontal: 5,
        borderColor: color.LighterGray,
        borderWidth: 1,
        flexDirection: "row",
        gap: 4,
    },
    Poster: {
        width: 110,
        height: 130,
    },
    InfoContainer: {
        flexDirection: "column",
        gap: 6,
        padding: 2,
        flex: 1,
        position: "relative",
    },
    Title: {
        fontSize: 14,
        color: color.Orange,
        fontFamily: font.OpenSansBold,
        overflow: "hidden",
        marginRight: 12,
    },
    Episode: {
        fontSize: 14,
        color: color.LightGray,
        fontFamily: font.OpenSansBold,
    },
    quality: {
        fontSize: 14,
        color: color.LightGray,
        fontFamily: font.OpenSansBold,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        // marginLeft:5,
        flex: 1,
    },
    progress: {
        color: color.AccentBlue,
        fontFamily: font.OpenSansBold
    },
    downloaded: {
        fontFamily: font.OpenSansMedium,
        fontSize: 13,
        color: color.AccentGreen
    },

})