import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { compareTime, fetchScheduleWeekly } from '../../Utils/Functions'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MCIcon, ThemeColors } from '../../Utils';
import ScheduleCard from '../../components/ScheduleCard';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import SelectDropdown from 'react-native-select-dropdown';
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const color = ThemeColors.DARK
const font = ThemeColors.FONT
const today = new Date();
const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
const getTimeDifference = (time) => {
    const currentTime = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const targetTime = new Date(currentTime);
    targetTime.setHours(hours);
    targetTime.setMinutes(minutes);
    const differenceInMs = targetTime - currentTime;
    return differenceInMs / (1000 * 60); // Convert milliseconds to minutes
};


const WeekSchedule = () => {
    const navigation = useNavigation()
    const {isOnline} =useInternet()
    const {setVideoState}=useVideoPlayer()
    const[schedule, setSchedule]= useState([])
    const[sortedSchedule, setSortedSchedule]= useState([])
    const[currentWeekDay, setcurrentWeekDay]= useState(weekday)
    const[isLoading, setisLoading]= useState(false)
    const [selected, setSelected] = useState(currentWeekDay);
    // const sortedSchedule = schedule?.[currentWeekDay]?.slice().sort(compareTime);
    if(!isOnline){
        return navigation.navigate("Downloads")
    }
    const fetchScheduleMain = async () => {
        try {
            setisLoading(true);
            const resp = await fetchScheduleWeekly();
            setSchedule(resp);
            setcurrentWeekDay(weekday)
            const findWeek = resp?.find((day) => {
                return Object.keys(day)[0] === weekday;
            });
            setSortedSchedule(findWeek?.[weekday]?.sort((a, b) => {
                const timeDifferenceA = Math.abs(getTimeDifference(a.time));
                const timeDifferenceB = Math.abs(getTimeDifference(b.time));
                return timeDifferenceA - timeDifferenceB;
            }))
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
            ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
        }
    }

    const handleWeekChange = (week)=>{
        setcurrentWeekDay(week)
        const findWeek = schedule?.find((day) => {
            return Object.keys(day)[0] === week;
        });
        setSortedSchedule(findWeek?.[week].sort((a, b) => {
            const timeDifferenceA = Math.abs(getTimeDifference(a.time));
            const timeDifferenceB = Math.abs(getTimeDifference(b.time));
            return timeDifferenceA - timeDifferenceB;
        }))
    }
    useEffect(()=>{
        if(!isOnline){
            navigation.navigate("Downloads")
        }else{

        fetchScheduleMain()
        handleWeekChange(weekday)
        setVideoState(prev=>({
            ...prev,
            isVideoScreen:false,
          }))
        }
      
    },[])

    const onSelectDropDown = useCallback((selectedItem, index) => {
        // setSelected(selectedItem)
        handleWeekChange(selectedItem)
    }, [setcurrentWeekDay])
    const buttonTextAfterSelection = useCallback((selectedItem, index) => (
        selectedItem
    ), [])
    const rowTextForSelection = useCallback((item, index) => (
        item
    ), [])
    const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />, [])

  return (
    <ScrollView style={{flex:1, backgroundColor:color.DarkBackGround, paddingHorizontal:5,}}>
        <View style={{
            flexDirection:"row", 
            gap:8, 
            flexWrap:"wrap", 
            justifyContent:"center",
            paddingVertical:10,
            }}>
            <SelectDropdown 
            data={weekdays}              
            renderDropdownIcon={renderDropdownIcon}
            buttonStyle={styles.buttonStyle}
            
            buttonTextStyle={styles.buttonTextStyle}
            dropdownStyle={styles.dropdownStyle}
            rowTextStyle={styles.rowTextStyle}
            rowStyle={styles.rowStyle}
            selectedRowTextStyle={styles.selectedRowTextStyle}
            selectedRowStyle={styles.selectedRowStyle}
            defaultValue={weekday}
            onSelect={onSelectDropDown}
            buttonTextAfterSelection={buttonTextAfterSelection}
            rowTextForSelection={rowTextForSelection}
            />

            {
                // weekdays?.map((week,i)=>(
                //     <TouchableOpacity 
                //     key={week}
                //     style={currentWeekDay === week?styles.weekdayBtnsActive:styles.weekdayBtns}
                //     onPress={()=> handleWeekChange(week)}>
                //         <Text style={styles.weekBtnText}>{week}</Text>
                //     </TouchableOpacity>
                // ))
            }
        </View>
        {
            isLoading?(
                <ActivityIndicator size="large" color={color.Orange} />
            ):(
                <View style={{marginBottom:20}}>
                {
                    sortedSchedule?.map((day,i)=>{
                        return (
                        <TouchableOpacity
                        onPress={() => navigation.navigate("AnimeInfo", { anime: day?.filterList })}
                        key={day?.aniwatch_id}>
                            <ScheduleCard day={day}/>
                        </TouchableOpacity>
                        )
                    })
                }
                </View>
            )
        }
    </ScrollView>
  )
}

export default WeekSchedule

const styles = StyleSheet.create({
    container:{
        backgroundColor:color.DarkBackGround2,
        borderRadius:10,
        overflow:"hidden",
        height:135,
        flexDirection:'row',
        justifyContent:"center",
        shadowColor: color.White,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
        marginVertical:5,
    },
    weekdayBtns:{
        padding:10,
        backgroundColor:color.DarkBackGround,
        borderRadius:5,
        elevation:1,
        borderWidth:1,
        borderColor:color.LighterGray
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
        gap:1,
    },
    Title:{
        fontSize:14,
        textTransform:"capitalize",
        // fontWeight:"600",
        color:color.White,
        // paddingVertical:4,
        fontFamily:font.InterBlack,
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
        width: "90%",
        backgroundColor: color.DarkBackGround,
        borderRadius:10,
        alignSelf:"center",
        borderWidth:1,
        borderColor:color.LighterGray,
    },
    rowStyle: {
        borderColor: 'transparent'
    },
    selectedRowStyle: {
        backgroundColor: color.Orange,
        
    },
    ListFooter: {
        marginBottom: 80,
    }

})