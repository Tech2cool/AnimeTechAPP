import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IIcon, ThemeColors } from '../../../Utils';
import { isValidData } from '../../../Utils/Functions';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../Context/LanguageContext';
import { dummy_image } from '../../../Utils/contstant';
import { useInternet } from '../../../Context/InternetContext';
import SmallSliderRenderItem from './SmallSliderRenderItem';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
const { width, height } = Dimensions.get("window");
let count = 1
const ImageSliderSmallWide = ({ myAnime }) => {
    // console.log("ImageSliderSmallWide Rendered" + count)
    // count++
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { currentLang } = useLanguage()
    const navigation = useNavigation()
    const SliderRef2 = useRef(null)
    const { isOnline } = useInternet()

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
            setSelectedIndex((prev) => (prev < myAnime?.length - 1 ? prev + 1 : 0));
        }, 5000);

        // Move the scrollToIndex logic outside the setTimeout to ensure the latest selectedIndex
        setTimeout(() => {
            SliderRef2?.current?.scrollToIndex({ animated: true, index: selectedIndex });
        });

        return () => clearTimeout(sid);
    }, [selectedIndex, myAnime]);

    const ListEmptyComponent = useMemo(() => {
        return (
            <View
                style={{ width: width, height: width * 4 / 16, position: "relative" }}>
                <Image
                    source={{ uri: dummy_image }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode='cover'
                />
            </View>)
    }, [])

    const renderImageSlider2 = useCallback(({ item }) => {
        // if (myAnime?.length === 0) return null
        // console.log("RenderItem SLiderSmall")
        return (<SmallSliderRenderItem item={item} currentLang={currentLang}/>)
    }, [currentLang, myAnime,])

    const keyExtractor = useMemo(() => (item, index) => `${index}-SmallImageSlider`, [])

    const memoizedFlatList = useMemo(() => {
        // console.log("smallSlider flatList");
        return (
            <FlatList
                nestedScrollEnabled={true}
                data={myAnime}
                horizontal={true}
                keyExtractor={keyExtractor}
                ref={SliderRef2}
                getItemLayout={getItemLayout}
                renderItem={renderImageSlider2}
                // windowSize={3}
                // initialNumToRender={3}
                removeClippedSubviews={false}
                // maxToRenderPerBatch={3}
                ListEmptyComponent={ListEmptyComponent}
            />
        );
    }, [myAnime, currentLang]);



    return (
        <View style={{ marginVertical: 10 }}>
            {memoizedFlatList}
        </View>
    )
}

export default memo(ImageSliderSmallWide)

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
})