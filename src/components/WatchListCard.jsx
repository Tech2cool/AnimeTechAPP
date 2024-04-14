import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'

import ThemeColors from '../Utils/ThemeColors'
import { useLanguage } from '../Context/LanguageContext';
import { isValidData } from '../Utils/Functions';
import { Gesture, GestureDetector, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MCIcon, AIcon } from '../Utils';
import { dummy_image, zIndex } from '../Utils/contstant';
import { couldStartTrivia } from 'typescript';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const ITEM_HEIGHT = 130;
const { width } = Dimensions.get("window")
const TranselateX_Treshould = -width * .3

export default function WatchListCard(props) {
    const { anime, episodeId, watchingEpisode, watchedTime, duration, mainId, handleSingleDelete } = props;
    // console.log(mainId)
    const { currentLang } = useLanguage();
    let AnimeTitle, status = anime?.AdditionalInfo?.status;
    if (currentLang === "en") {
        AnimeTitle = (isValidData(anime?.animeTitle?.english) && anime?.animeTitle?.english) || (anime?.animeTitle?.english_jp)
    } else {
        AnimeTitle = (anime?.animeTitle?.english_jp) || (anime?.animeTitle?.japanese)
    }

    if (anime?.AdditionalInfo?.status === "current") {
        status = "ongoing"
    }
    const calculateWatchTime = () => {
        const cval = ((watchedTime / duration) * 100).toFixed(0)
        if (isNaN(cval)) return 0
        return cval
    }
    const translateX = useSharedValue(0)
    // const context = useSharedValue({y:0})
    const itemHeight = useSharedValue(ITEM_HEIGHT)
    const marginVertical = useSharedValue(5)
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
                runOnJS(handleSingleDelete)(mainId, AnimeTitle)
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
        <Animated.View style={[{ marginVertical: 5, position: "relative" }, rTaskContainerStye]}>
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

            <GestureDetector gesture={panGesture} nestedScrollEnabled={true}>
                <Animated.View style={[{
                    height: "100%", width: 120, backgroundColor: "transparent",
                    position: "absolute", right: 0, zIndex: zIndex.TOP
                }, rStyle]}></Animated.View>
            </GestureDetector>
            <Animated.View style={[styles.container, rStyle]}>
                <Image style={styles.Img} source={{ uri: isValidData(anime?.animeImg) ? anime?.animeImg : dummy_image }} />
                <View style={styles.Info}>
                    <Text numberOfLines={3} style={styles.Title}>{AnimeTitle}</Text>
                    <View style={{ flexDirection: "row", alignItems: 'center', columnGap: 2 }}>
                        <Text style={[styles.Episode, { fontSize: 15, color: color.White }]}>Episode {watchingEpisode}</Text>
                        {isValidData(anime?.subOrDub) && <Text style={[styles.Episode, { textTransform: "capitalize" }]}>({anime?.subOrDub})</Text>}

                    </View>
                    <Text style={styles.Episode}>Watched: {calculateWatchTime()}%</Text>
                    {isValidData(anime?.year) && <Text style={styles.Episode}>Year: {
                        anime?.year !== 0 ? anime?.year : anime?.AdditionalInfo?.startDate?.split("-")[0]
                    }</Text>}
                    {isValidData(anime?.AdditionalInfo?.status) && <Text style={[styles.Episode, { textTransform: "capitalize" }]}>Status: {status}</Text>}
                </View>

            </Animated.View>

        </Animated.View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: color.DarkBackGround2,
        // borderRadius:10,
        overflow: "hidden",
        height: 130,
        flexDirection: 'row',
        borderRadius: 5,
    },
    Poster: {
        flex: 1,
        maxWidth: 140,
        maxHeight: 160,
        // backgroundColor:"red",
        position: "relative",
    },
    Img: {
        // flex:1, 
        width: 100,
        height: 160,
        resizeMode: "cover"
    },
    Info: {
        paddingHorizontal: 8,
        flex: 1,
        // gap:2,
        overflow: "hidden",
    },
    Title: {
        fontSize: 15,
        textTransform: "capitalize",
        // fontWeight:"600",
        color: color.White,
        // paddingVertical:4,
        fontFamily: font.InterBlack,
    },
    Episode: {
        color: color.LightGray,
        // fontWeight:"600",
        fontSize: 14,
        fontFamily: font.InterMedium,

    },
    status: {
        color: color.LightGray,
        textTransform: "capitalize",
        // fontWeight:"600",
        fontSize: 14,
        fontFamily: font.PoppinsMedium,
    },

})

