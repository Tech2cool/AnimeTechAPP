import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import { convertToAMPM, isValidData } from '../../../Utils/Functions'
import { dummy_image } from '../../../Utils/contstant'
import { ThemeColors } from '../../../Utils';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

const TodaScheRenderItem = ({item,currentLang}) => {
    const navigation = useNavigation()
    const findImage = useMemo(() => {
        if (isValidData(item?.filterList?.AdditionalInfo?.coverImage?.original)) {
            return item?.filterList?.AdditionalInfo?.coverImage?.original
        } else if (isValidData(item?.filterList?.AdditionalInfo?.coverImage?.small)) {
            return item?.filterList?.AdditionalInfo?.coverImage?.small
        } else if (isValidData(item?.filterList?.AdditionalInfo?.coverImage?.tiny)) {
            return item?.filterList?.AdditionalInfo?.coverImage?.tiny
        }
        else if(isValidData(item?.filterList?.animeImg))
        {
            return item?.filterList?.animeImg
        }
        else{
            return dummy_image
        }
        
    }, [item?.filterList])

    const memoizedTitle = useMemo(() => {
        if (currentLang === "en") {
            if (isValidData(item?.filterList?.animeTitle?.english)) {
                return item?.filterList?.animeTitle?.english
            } else if (isValidData(item?.filterList?.animeTitle?.english_jp)) {
                return item?.filterList?.animeTitle?.english_jp
            }else {
                return item?.english
            }
        } else {
            if (isValidData(item?.filterList?.animeTitle?.english_jp)) {
                return item?.filterList?.animeTitle?.english_jp
            } else if (isValidData(item?.animeTitle?.japanese)) {
                return item?.animeTitle?.japanese
            }else {
                return item?.english_jp
            }
        }
    }, [currentLang,item?.filterList?.animeTitle, item?.english, item?.english_jp])

    const memoizedConvertedTime = useMemo(()=>{
        return convertToAMPM(item?.time)
    },[item?.time])

    const handleNavigation = useCallback(()=>navigation.navigate("WeekSchedule"),[])
    const memoizedMementDate = useMemo(()=>(moment(`${item?.date} ${item?.time}`).fromNow()),[item?.date,item?.time])

  return (
    <TouchableOpacity
    onPress={handleNavigation}
    style={{ width: width, height: width * 5 / 16, position: "relative" }}>
    <Image
        source={ { uri: findImage}}
        style={{ width: "100%", height: "100%" }}
        resizeMode='cover'
    /> 
    <View style={styles.InfoContainer}>
        <Text
            numberOfLines={1}
            style={styles.InfoText}>
            {memoizedTitle}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Text style={[styles.InfoText, { color: color.White, fontSize: 20, fontFamily: font.OpenSansBold }]}>{item?.episode}</Text>
            <Text style={styles.Time}>({memoizedConvertedTime})</Text>
            <Text style={styles.TimeAgo}>{memoizedMementDate}</Text>
        </View>
    </View>

</TouchableOpacity>

  )
}

export default memo(TodaScheRenderItem)

const styles = StyleSheet.create({
    InfoContainer: {
        bottom: 0,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "50%",
        paddingTop: 11,
        paddingHorizontal: 5,
    },
    InfoText: {
        color: color.White,
        fontSize: 18,
        fontFamily: font.OpenSansBold,
        textTransform: "capitalize",
        paddingVertical:2,
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
    WatchNowText: {
        color: color.White,
        fontFamily: font.OpenSansBold,
        fontSize: 16,
        textTransform: "uppercase",
        fontWeight: "700"
    },
    Time: {
        fontSize: 20,
        textTransform: "uppercase",
        color: color.Orange,
        fontFamily: font.OpenSansBold,
    },
    TimeAgo: {
        fontSize: 18,
        // textTransform:"capitalize",
        color: color.LightGray,
        fontFamily: font.OpenSansBold,
    },
})