import { View, Text, StyleSheet, Dimensions, Image, KeyboardAvoidingView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Gesture, GestureDetector, TextInput } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { IIcon, MCIcon, MIcon, ThemeColors } from '../Utils';
import { zIndex } from '../Utils/contstant';
import SelectDropdown from 'react-native-select-dropdown'

import { useDebounce } from '.';
import DownloadEpisodeCard from './DownloadEpisodeCard';
import { useLanguage } from '../Context/LanguageContext';
import { convertM3U8toMP4, getAsynStorageData, isValidData } from '../Utils/Functions';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer } from '../Context/VideoPlayerContext';
const { height: SCREEN_HIEGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HIEGHT / 1.5;
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const quality = [
    "360p",
    "480p",
    "720p",
    "1080p",
]
const DownloadCard = (props) => {
    const { episodes, anime, episodeNum, episodeId, sources, 
            showDownloadCard, setShowDownloadCard, item } = props

    const [selected, setSelected] = useState("1080p");
    const [isLoading, setIsLoading] = useState(false);
    const { setVideoState } = useVideoPlayer();
    const context = useSharedValue({ y: 0 })
    const translationY = useSharedValue(0);
    const { currentLang } = useLanguage()
    const navigation = useNavigation()
    const scrollTo = useCallback((destination) => {
        "worklet";
        translationY.value = withSpring(destination, { damping: 50 })
    })

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translationY.value }
        })
        .onUpdate((e) => {
            // console.log(e.translationY)
            translationY.value = e.translationY + context.value.y;
            translationY.value = Math.max(translationY.value, MAX_TRANSLATE_Y)
        })
        .onEnd(() => {
            if (translationY.value > -SCREEN_HIEGHT / 2) {
                scrollTo(0)
                runOnJS(setShowDownloadCard)(false)

            } else if (translationY.value < -SCREEN_HIEGHT / 1.8) {
                scrollTo(MAX_TRANSLATE_Y)
            }
        })

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translationY.value, [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 20],
            Extrapolation.CLAMP
        )
        return {
            borderRadius,
            transform: [{ translateY: translationY.value }]
        }
    })
    // console.log(item)
    useEffect(() => {
        // translationY.value =withTiming(-SCREEN_HIEGHT/3)
        // console.log("card redeer")
        setIsLoading(true)
        setTimeout(() => {
        if(sources?.length>0)
            {
                setIsLoading(false)
            }
            else{
                setTimeout(() => {
                    
                    setIsLoading(false)
                }, 1000);
            }
        }, 500);
        scrollTo(MAX_TRANSLATE_Y)
    }, [showDownloadCard])

    const onSelectDropDown = useCallback((selectedItem, index) => {
        setSelected(selectedItem)
    }, [selected])
    const buttonTextAfterSelection = useCallback((selectedItem, index) => (
        selectedItem?.quality
    ), [])
    const rowTextForSelection = useCallback((item, index) => (
        item?.quality
    ), [])
    const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />, [])

    const handleDownloadEpisode = async () => {
        try {
            // console.log("selectedQuality: "+ selectedQuality)
            // console.log("item?.item?.id: "+ item?.id)
            const AsnycData = await getAsynStorageData(`download_${episodeId}-`)
            if (AsnycData) {
                setTimeout(() => {
                    setVideoState(prev => ({
                        ...prev,
                        paused: true
                    }))
                    navigation.navigate("Downloads")
                }, 500);
                ToastAndroid.show("Already Downloaded", ToastAndroid.SHORT)
                return
            } else {
                // console.log(selected?.url)
                convertM3U8toMP4(selected?.url, item, selected?.quality, anime)
                setTimeout(() => {
                    navigation.navigate("Downloads")
                }, 500);
            }
        } catch (error) {
            ToastAndroid.show("err: " + error, ToastAndroid.SHORT)
        }
    }
    const AnimeTitle = useMemo(() => {
        if (currentLang === "en") {
            if (isValidData(anime?.animeTitle?.english)) {
                return anime?.animeTitle?.english
            } else if (isValidData(anime?.animeTitle?.english_jp)) {
                return anime?.animeTitle?.english_jp
            }
        } else if(currentLang === "jp") {
            if (isValidData(anime?.animeTitle?.english_jp)) {
                return anime?.animeTitle?.english_jp
            } else if (isValidData(anime?.animeTitle?.japanese)) {
                return anime?.animeTitle?.japanese
            }
        }else{
            return anime?.animeTitle?.english_jp
        }
    }, [item?.title, anime?.animeTitle,currentLang,episodeId])
    const find1080P = ()=>{
        const resp = sources?.findIndex((src, i)=> src?.quality?.toLowerCase() === "1080p")
        return resp
    }
    if (!showDownloadCard) {
        return
    }

    return (
        <KeyboardAvoidingView>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.container, rBottomSheetStyle]}>
                    <View style={styles.line} />
                    <Text style={styles.downloadText}>Download</Text>
                    <View style={styles.keyboardView}>
                        {/* <View */}
                        <Image source={{ uri: anime?.animeImg }} style={{ width: 300, height: 150, }} />
                        {
                            isLoading ? (
                                <ActivityIndicator color={color.Orange} size={'large'}/>
                            ) : (<>
                            <Text style={styles.title}>{AnimeTitle}</Text>
                            {/* <Text style={styles.title}>{item?.title?.english_jp}</Text> */}
                            <Text style={styles.episode}>Episode {episodeNum}</Text>
                            <SelectDropdown
                                data={sources}
                                renderDropdownIcon={renderDropdownIcon}
                                buttonStyle={styles.buttonStyle}
                                buttonTextStyle={styles.buttonTextStyle}
                                dropdownStyle={styles.dropdownStyle}
                                rowTextStyle={styles.rowTextStyle}
                                rowStyle={styles.rowStyle}
                                selectedRowTextStyle={styles.selectedRowTextStyle}
                                selectedRowStyle={styles.selectedRowStyle}
                                // defaultValue={"1080P"}
                                defaultValueByIndex={find1080P() !== -1?find1080P():0}
                                onSelect={onSelectDropDown}
                                buttonTextAfterSelection={buttonTextAfterSelection}
                                rowTextForSelection={rowTextForSelection}
                            />
                            <TouchableOpacity
                                onPress={handleDownloadEpisode}
                                style={styles.downloadBtn}>
                                <Text style={{ fontSize: 16, fontFamily: font.OpenSansBold }}>Download</Text>
                            </TouchableOpacity>
                            </>)
                        }
                    </View>

                </Animated.View>
            </GestureDetector>
        </KeyboardAvoidingView>

    )
}

export default memo(DownloadCard)

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HIEGHT,
        width: "100%",
        backgroundColor: color.DarkBackGround2,
        position: "absolute",
        top: SCREEN_HIEGHT,
        borderRadius: 25,
        zIndex: zIndex.TOP,
        paddingHorizontal: 5,
        alignItems: "center",
        borderColor: color.LighterGray,
        borderWidth: 1,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: color.LightGray,
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2,
    },
    downloadBtn:{
        padding: 10,
        backgroundColor: color.Orange,
        borderRadius: 10,
        flex: 0,
        alignSelf: "center",
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    downloadText: {
        color: color.White,
        fontSize: 20,
        fontFamily: font.OpenSansBold,
        textAlign: "center",
        marginBottom: 10,
    },
    title:{
        color: color.Orange, 
        fontSize: 16, 
        fontFamily: font.OpenSansBold,
        paddingHorizontal:8,
    },
    episode:{
        color: color.LightGray, 
        fontSize: 16, 
        fontFamily: font.OpenSansBold

    },
    searchView: {
        padding: 5,
        borderRadius: 10,
        backgroundColor: color.DarkBackGround,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        //   marginBottom: 5, 
        //   marginTop: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        gap: 10,
        borderColor: color.LighterGray2,
    },
    TextInput: {
        height: 35,
        color: color.DarkGray,
        fontWeight: "600",
        width: 120,
    },
    keyboardView: {
        flex: 1,
        alignItems: "center",
        gap: 10,
        // maxWidth:"100%",
        maxHeight: "52%",
        flexDirection: "column",
        // justifyContent: "center",
        // paddingHorizontal: 5,
        // backgroundColor:color.DarkBackGround2,
        // borderColor:color.LighterGray,
        // borderWidth:1,
        borderRadius: 10,
        // marginHorizontal:10,
        // elevation:10,
    },
    rowTextStyle: {
        fontSize: 16,
        color: color.White,
        textTransform: "uppercase",
    },
    selectedRowTextStyle: {
        fontSize: 16,
        color: color.White,
        textTransform: "uppercase",
    },
    dropdownStyle: {
        borderRadius: 5,
        backgroundColor: color.DarkBackGround,
        elevation: 10,
        borderColor: color.LighterGray2,
        borderWidth: 0.2,
    },
    buttonTextStyle: {
        color: color.Orange,
        textTransform: "uppercase",
        fontFamily: font.NunitoBlack,
    },
    buttonStyle: {
        width: 120,
        backgroundColor: color.DarkBackGround2,
    },
    rowStyle: {
        borderColor: 'transparent'
    },
    selectedRowStyle: {
        backgroundColor: color.Orange
    },
    ListFooter: {
        marginBottom: 80,
    }
})
