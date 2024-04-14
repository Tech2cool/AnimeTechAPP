import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { convertM3U8toMP4, fetchSources, getAsynStorageData, isValidData, storeAsynStorageData } from '../Utils/Functions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MCIcon, ThemeColors } from '../Utils'
import { dummy_image } from '../Utils/contstant'
import { useNavigation } from '@react-navigation/native'
import { useVideoPlayer } from '../Context/VideoPlayerContext'
import { useLanguage } from '../Context/LanguageContext'
import SelectDropdown from 'react-native-select-dropdown'
const color = ThemeColors.DARK
const font = ThemeColors.FONT
// const { width, height } = Dimensions.get("window")
const DownloadEpisodeCard = (props) => {
    const{item, anime, selectedQuality, episodeNum}= props
    const navigation = useNavigation()
    const {setVideoState} =useVideoPlayer();
    const {currentLang} = useLanguage()
    const [source, setSources] = useState([])
    const [selected, setSelected] = useState("1080p");
    const [progress, setProgress] = useState(0);

    const fetchSourcees = async () => {
        try {
            const resp = await fetchSources(item?.id)
            setSources(resp)
        } catch (error) {
            ToastAndroid.show("errorL" + error, ToastAndroid.SHORT)
        }
    }

    useEffect(() => {
        fetchSourcees()
    }, [item])
    // useEffect(()=>{
    //     console.log(source?.quality)
    // },[source])

    const AnimeTitle = useMemo(()=>{
        if(currentLang === "en"){
            if(isValidData(item?.title?.english)){
                return item?.title?.english
            }else if(isValidData(anime?.animeTitle?.english)){
                return anime?.animeTitle?.english
            }
        }else{
            if(isValidData(item?.title?.english_jp)){
                return item?.title?.english_jp
            }else if(isValidData(anime?.animeTitle?.english_jp)){
                return anime?.animeTitle?.english_jp
            }
        }
    },[item?.title, anime?.animeTitle])

    const poster = useMemo(()=>{
        return isValidData(anime?.animeImg) ? anime?.animeImg : dummy_image
    },[anime?.animeImg])

    const onSelectDropDown = useCallback((selectedItem, index) => { setSelected(selectedItem?.quality) },[selected])
    const buttonTextAfterSelection = useCallback((selectedItem, index) => (selectedItem?.quality),[])
    const rowTextForSelection = useCallback((item, index) => (item?.quality),[])
    const renderDropdownIcon = useCallback(() => <MCIcon name={"chevron-down"} color={color.Orange} size={25} />,[])

    const handleDownload = async () => {
        try {
            // console.log("selectedQuality: "+ selectedQuality)
            // console.log("item?.item?.id: "+ item?.id)
            const AsnycData = await getAsynStorageData(`download_${item?.id}`)
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

                const qulity = await findQuality();
                // console.log("idk")
                // console.log("selectedQuality:" + selectedQuality)
                // console.log("ql:" + qulity?.quality)
                // console.log("url:" + qulity?.url)
                if (qulity) {
                    convertM3U8toMP4(qulity?.url, item, selectedQuality, anime)
                    setTimeout(() => {
                        navigation.navigate("Downloads")
                    }, 500);
                } else {
                    ToastAndroid.show("Try Again or choose Different Quality", ToastAndroid.SHORT)
                }
            }
        } catch (error) {
            ToastAndroid.show("err: " + error, ToastAndroid.SHORT)
        }
    }
    return (
        <View style={styles.container}>
            <Image style={styles.Img} source={{ uri: poster }} />
            {
                source?.length <1?(
                    <ActivityIndicator color={color.Orange} size={'large'}/>
                ):(
                    <View style={styles.Info}>
                    <Text numberOfLines={1}
                        style={{ color: color.White }}>
                        {AnimeTitle}
                    </Text>
                    <Text style={{ color: color.White }}>Episode {item?.number}</Text>
                    <View style={{
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center",
                        }}>
                    <SelectDropdown
                        data={source}
                        renderDropdownIcon={renderDropdownIcon}
                        buttonStyle={styles.buttonStyle}
                        buttonTextStyle={styles.buttonTextStyle}
                        dropdownStyle={styles.dropdownStyle}
                        rowTextStyle={styles.rowTextStyle}
                        rowStyle={styles.rowStyle}
                        selectedRowTextStyle={styles.selectedRowTextStyle}
                        selectedRowStyle={styles.selectedRowStyle}
                        defaultValue={"1080p"}
                        onSelect={onSelectDropDown}
                        buttonTextAfterSelection={buttonTextAfterSelection}
                        rowTextForSelection={rowTextForSelection}
                    />
                    <TouchableOpacity style={styles.DownloadBtn} onPress={handleDownload}>
                        <Text style={{ color: color.White }}>Download</Text>
                    </TouchableOpacity>
                </View>
                </View>
                )
            }

        </View>
    )
}

export default memo(DownloadEpisodeCard)

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.DarkBackGround,
        // marginVertical: 5, 
        flexDirection: "column",
        overflow: "hidden",
        gap: 10,
        margin: 5,
        elevation: 2,
        borderRadius: 5,
        shadowColor: color.White,
        shadowOffset: { width: 2, height: 2 },
        // padding:1,
        flex:1,
    },
    Img: {
        // flex:1, 
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    DownloadBtn: {
        padding: 10,
        width:120,
        // height:60,
        backgroundColor: color.Orange,
        flex: 0,
        alignSelf: "flex-start",
        borderRadius: 5,
    },
    Info: {
        flexDirection: "column",
        flex: 1,
        gap: 4,
        paddingHorizontal:5,
    },
    rowTextStyle: {
        fontSize: 14,
        color: color.White,
        textTransform: "uppercase",
    },
    selectedRowTextStyle: {
        fontSize: 14,
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
        width: 150,
        backgroundColor: color.DarkBackGround,
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