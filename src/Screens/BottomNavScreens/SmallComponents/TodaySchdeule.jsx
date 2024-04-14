import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IIcon, ThemeColors } from '../../../Utils';
import { compareTime, convertToAMPM, fetchSchedule, fetchScheduleToday, isValidData } from '../../../Utils/Functions';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../Context/LanguageContext';
import moment from 'moment';
import { useInternet } from '../../../Context/InternetContext';
import { dummy_image } from '../../../Utils/contstant';
import TodaScheRenderItem from './TodaScheRenderItem';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const { width, height } = Dimensions.get("window");
const today = new Date();
const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
const todayDate = today.toISOString().split('T')[0]
const TodaySchedule = () => {
    const { currentLang } = useLanguage();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [schedule, setSchedule] = useState([]);
    const [oldSchedule, setoldSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation()
    const SliderRef3 = useRef(null)
    // const sortedSchedule = schedule?.[weekday]?.slice().sort(compareTime);
    const { isOnline } = useInternet()
    if (!isOnline) {
        navigation.navigate("Downloads")
        return null
    }

    const getItemLayout = useCallback((data, index) => ({
        length: width,
        offset: width * index,
        index,
    }), [])

    const fetchScheduleMain = useCallback(async () => {
        try {
            setIsLoading(true)
            // console.log()
            const resp = await fetchScheduleToday(todayDate);
            // console.log(resp)
            if (JSON.stringify(resp) !== JSON.stringify(schedule)) {
                setSchedule(resp);
                setoldSchedule(resp);
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
        }
    }, []);

    useEffect(() => {
        if (!isOnline) {
            navigation.navigate("Downloads")
        } else {
            if (schedule?.length === 0) {
                fetchScheduleMain()
            }
        }
    }, [])

    useEffect(() => {
        const sid = setTimeout(() => {
            setTimeout(() => {
                if (schedule?.length > 0) {
                    setSelectedIndex((prev) => (prev < schedule?.length - 1 ? prev + 1 : 0));
                    SliderRef3?.current?.scrollToIndex({ animated: true, index: selectedIndex });
                }
            });
        }, 5000);
        return () => clearTimeout(sid)
    }, [selectedIndex, schedule])

    const ListEmptyComponent = useMemo(()=>{
        return(
        <View
            style={{ width: width, height: width * 5 / 16, position: "relative" }}>
            <Image
                source={ { uri:dummy_image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode='cover'
            /> 
        </View>)
    },[])

    const renderImageSlider2 = useCallback(({ item }) =>{
        //console.log("today Schdule RenderItem")
        // if(JSON.stringify(oldSchedule) === JSON.stringify(schedule)) return
        return(
            <TodaScheRenderItem item={item} currentLang={currentLang}/>
        )
    }, [])

    const keyExtractor = useMemo(()=>(item, index) => `${index}-TodayScheduleSlider`,[])
    
    const memoizedFlatList = useMemo(() => {
        // console.log("today Schdule FlatList")
        return (
          <FlatList
            nestedScrollEnabled={true}
            data={schedule}
            horizontal={true}
            keyExtractor={keyExtractor}
            ref={SliderRef3}
            getItemLayout={getItemLayout}
            renderItem={renderImageSlider2}
            // windowSize={1} // Adjust based on your specific use case
            // initialNumToRender={2}
            removeClippedSubviews={false} // Disabling removeClippedSubviews for testing
            // maxToRenderPerBatch={3}
            ListEmptyComponent={ListEmptyComponent}
          />
        );
      }, [schedule]);
      
    return (
        <View style={{ marginVertical: 10 }}>
            <Text style={[styles.InfoText, { marginVertical: 5, fontSize: 16 }]}>Today Schedule</Text>
            {
                isLoading ? (<ActivityIndicator size="small" color={color.Orange} />)
                    : (memoizedFlatList)
            }
        </View>
    )
}

export default memo(TodaySchedule)

const styles = StyleSheet.create({
    InfoText: {
        color: color.White,
        fontSize: 19,
        fontFamily: font.OpenSansBold,
        textTransform: "capitalize",
    },

})