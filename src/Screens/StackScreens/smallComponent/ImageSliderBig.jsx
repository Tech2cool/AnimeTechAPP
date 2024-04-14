import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IIcon, ThemeColors } from '../../../Utils';
import { isValidData } from '../../../Utils/Functions';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../Context/LanguageContext';
import { dummy_image } from '../../../Utils/contstant';
import { useInternet } from '../../../Context/InternetContext';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const { width, height } = Dimensions.get("window");
let count=1
const ImageSliderBig = ({ myAnime }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    // console.log("ImageSliderBig Rendered" + count)
    // count++
    const { currentLang } = useLanguage()

    const navigation = useNavigation()
    const SliderRef = useRef(null)
    const { isOnline } = useInternet()
    // if(myAnime?.length === 0){return null}
    if(!isOnline){
        return navigation.navigate("Downloads")
    }
    const getItemLayout = useCallback((data, index) => ({
        length: width,
        offset: width * index,
        index,
    }), [])

    useEffect(() => {
        const sid = setTimeout(() => {
            setTimeout(() => {
                setSelectedIndex((prev) => (prev < myAnime?.length - 1 ? prev + 1 : 0));
            });
        }, 5000);

        setTimeout(() => {
            SliderRef?.current?.scrollToIndex({ animated: true, index: selectedIndex });
        });
        return () => clearTimeout(sid)
    }, [selectedIndex, myAnime])

    const ListEmptyComponent = useMemo(()=>{
        return(
        <View style={{ width: width, height: width * 18 / 16, position: "relative" }}>
            <Image
                source={ { uri:dummy_image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode='cover'
            /> 
        </View>)
    },[])

    const memoizedPoster = useCallback((item) => {
        if (isValidData(item?.AdditionalInfo?.posterImage?.original)) {
            return item?.AdditionalInfo?.posterImage?.original
        } else if (isValidData(item?.AdditionalInfo?.posterImage?.small)) {
            return item?.AdditionalInfo?.posterImage?.small
        } else if (isValidData(item?.AdditionalInfo?.posterImage?.tiny)) {
            return item?.AdditionalInfo?.posterImage?.tiny
        } else {
            return dummy_image
        }
    }, [])

    const memoizedTitle = useCallback((item) => {
        if (currentLang === "en") {
            if (isValidData(item?.animeTitle?.english)) {
                return item?.animeTitle?.english
            } else if (isValidData(item?.animeTitle?.english_jp)) {
                return item?.animeTitle?.english_jp
            }
        } else {
            if (isValidData(item?.animeTitle?.english_jp)) {
                return item?.animeTitle?.english_jp
            } else if (isValidData(item?.animeTitle?.japanese)) {
                return item?.animeTitle?.japanese
            }
        }
    }, [currentLang])

    const memoizedDesc = useCallback((item) => {
        if (isValidData(item?.AdditionalInfo?.description)) {
            return item?.AdditionalInfo?.description
        }
    }, [])

    const memoizedWatchNow = useCallback((item) => (
        <TouchableOpacity
            style={styles.WatchNowBtn}
            onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
            <IIcon name="play-sharp" size={25} color={color.White} />
            <Text style={styles.WatchNowText}>Watch Now</Text>
        </TouchableOpacity>), [navigation])

    const renderImageSlider1 = useCallback(({ item, index }) => {
        // console.log("RenderImage render BIGSlider")

        return(
            <View style={{ width: width, height: width * 18 / 16, position: "relative" }}>
                <Image
                    style={{ width: "100%", height: "100%" }}
                    resizeMode='cover'
                    source={{ uri: memoizedPoster(item) }}
                />
                <View style={styles.InfoContainer}>
                    <Text style={styles.InfoText}>
                        {memoizedTitle(item)}
                    </Text>
                    <Text numberOfLines={3}
                        style={{ color: color.White, fontSize: 14, fontFamily: font.OpenSansMedium }}>
                        {memoizedDesc(item)}
                    </Text>
                    {memoizedWatchNow(item)}
                </View>
            </View>
        )
    }, [currentLang, navigation])

    const keyExtractor =useMemo(()=>(item, index) => `${index}-BigImageSlider`,[])
    
    const memoizedFlatList = useMemo(() => {
        // console.log("flatList render BIGSlider")
        return (
          <FlatList
            nestedScrollEnabled={true}
            data={myAnime}
            horizontal={true}
            keyExtractor={keyExtractor}
            ref={SliderRef}
            getItemLayout={getItemLayout}
            renderItem={renderImageSlider1}
            // windowSize={3} // Adjust based on your specific use case
            // initialNumToRender={3}
            removeClippedSubviews={false} // Disabling removeClippedSubviews for testing
            // maxToRenderPerBatch={3}
            ListEmptyComponent={ListEmptyComponent}
          />
        );
      }, [myAnime, currentLang]);

    return (
        <View>
            {memoizedFlatList}
        </View>
    )
}

export default memo(ImageSliderBig)

const styles = StyleSheet.create({
    InfoContainer: {
        bottom: 0,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        flexDirection: "column",
        width: "100%",
        paddingHorizontal: 5,
        gap: 5,
    },
    InfoText: {
        color: color.White,
        fontSize: 20,
        fontFamily: font.OpenSansBold
    },
    WatchNowBtn: {
        gap: 5,
        flex: 0,
        padding: 10,
        borderRadius: 5,
        marginBottom: 2,
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: color.Orange,
        justifyContent: "center",
        alignItems: "center",
    },
    WatchNowText: {
        color: color.White,
        fontFamily: font.OpenSansBold,
        fontSize: 16,
        textTransform: "uppercase",
        fontWeight: "700"
    }
})