import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{ memo, useCallback, useMemo } from 'react'
import { IIcon, ThemeColors } from '../../../Utils';
import { useNavigation } from '@react-navigation/native';
import { isValidData } from '../../../Utils/Functions';
import { dummy_image } from '../../../Utils/contstant';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const { width, height } = Dimensions.get("window");

const SmallSliderRenderItem = ({item,currentLang}) => {
    const navigation = useNavigation()
    const memoizedPoster = useMemo(() => {
        if (isValidData(item?.AdditionalInfo?.coverImage?.original)) {
            return item?.AdditionalInfo?.coverImage?.original
        } else if (isValidData(item?.AdditionalInfo?.coverImage?.small)) {
            return item?.AdditionalInfo?.coverImage?.small
        } else if (isValidData(item?.AdditionalInfo?.coverImage?.tiny)) {
            return item?.AdditionalInfo?.coverImage?.tiny
        }
        else {
            return dummy_image
        }
    }, [])

    const memoizedTitle = useMemo(() => {
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
    }, [currentLang, item?.animeTitle])

    const handleNavigation = useCallback(() => navigation.navigate("AnimeInfo", { anime: item }), [])

    const memoizedWatchNow = useMemo(() => {
        // console.log("SLiderSmall Watchnow")
        return (<TouchableOpacity
            onPress={handleNavigation}
            style={styles.WatchNowBtn}>
            <IIcon name="play-sharp" size={25} color={color.White} />
            <Text style={styles.WatchNowText}>Watch Now</Text>
        </TouchableOpacity>)
    }, [])

  return (
    <View style={{ width: width, height: width * 4 / 16, position: "relative" }}>
    <Image
        style={{ width: "100%", height: "100%" }}
        resizeMode='cover'
        source={{ uri: memoizedPoster }}
    />
    <View style={styles.InfoContainer}>
        <Text style={styles.InfoText} numberOfLines={1}>
            {memoizedTitle}
        </Text>
        {memoizedWatchNow}
    </View>

</View>

  )
}

export default memo(SmallSliderRenderItem)

const styles = StyleSheet.create({
    InfoContainer: {
        bottom: 0,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.4)",
        flexDirection: "row",
        // justifyContent: "center",
        // flex:1,
        width: "100%",
        height: 50,
        paddingHorizontal: 5,
        gap: 5,
        // flex:1,
        flexWrap: "wrap",
    },
    InfoText: {
        color: color.White,
        fontSize: 20,
        fontFamily: font.OpenSansBold,
        // flex:1,
    },
    WatchNowText: {
        color: color.White,
        fontFamily: font.OpenSansBold,
        fontSize: 16,
        textTransform: "uppercase",
        fontWeight: "700",
    },
    WatchNowBtn: {
        gap: 5,
        flex: 0,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        bottom: 0,
    },



})