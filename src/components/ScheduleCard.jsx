import { Image, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { ThemeColors } from '../Utils'
import { convertToAMPM, isValidData } from '../Utils/Functions'
import { useLanguage } from '../Context/LanguageContext'
import moment from 'moment';
import { dummy_image } from '../Utils/contstant'

const color = ThemeColors.DARK
const font = ThemeColors.FONT
const ScheduleCard = ({day}) => {
    const{currentLang}=useLanguage();
    const inputDate = day?.date;
    const inputTime = day?.time;
    const inputDateTime = moment(`${inputDate} ${inputTime}`);
    
    const timeAgo = inputDateTime.fromNow();
      
    return (
    <View style={styles.container}>
        <Image source={{uri:isValidData(day?.filterList?.animeImg)?day?.filterList?.animeImg:dummy_image}} style={styles.Img}/>
        <View style={styles.Info}>
            <Text numberOfLines={2} style={styles.Title}>{currentLang ==="en"?day?.english:day?.english_jp}</Text>
            <Text style={styles.Time}>{convertToAMPM(inputTime)}</Text>
            <Text style={styles.TimeAgo}>{timeAgo}</Text>
        </View>
    </View>
  )
}

export default memo(ScheduleCard)

const styles = StyleSheet.create({
    container:{
        flex:1,
        rowGap:5,
        backgroundColor:color.DarkBackGround,
        borderRadius:10,
        overflow:"hidden",
        height:130,
        flexDirection:'row',
        elevation: 10,
        marginVertical:5,
        marginHorizontal:15,
        borderColor:color.LighterGray,
        borderWidth:1,
    },
    weekdayBtns:{
        padding:10,
        backgroundColor:color.DarkBackGround2,
        borderRadius:5,
        elevation:1,
        borderWidth:1,
        borderColor:color.LighterGray2
    },
    weekdayBtnsActive:{
        padding:10,
        backgroundColor:color.Orange,
        borderRadius:5,
        elevation:1,
        borderWidth:1,
        borderColor:color.Orange
    },
    weekBtnText:{
        fontSize:16,
        fontFamily:font.OpenSansRegular,
        color:color.White,
        fontWeight:"600",
    },
    Img:{
        // flex:1, 
        width:100,
        height:160,
        resizeMode:"cover"
    },
    Info:{
        paddingHorizontal:6,
        flex:1,
        gap:5,
    },
    Title:{
        fontSize:15,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
    },
    Time:{
        fontSize:20,
        textTransform:"uppercase",
        // fontWeight:"600",
        color:color.Orange,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
    },
    TimeAgo:{
        fontSize:16,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.LightGray,
        // paddingVertical:4,
        fontFamily:font.OpenSansBold,
    },
    Episode:{
        color:color.LightGray,
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.InterMedium,

    },
    status:{
        color:color.LightGray,
        textTransform:"capitalize",
        // fontWeight:"600",
        fontSize:14,
        fontFamily:font.PoppinsMedium,
    },

})