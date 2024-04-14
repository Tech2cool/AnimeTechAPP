import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import AnimecardVertical from '../../../components/AnimeCardVertical'
import { useNavigation } from '@react-navigation/native'
import { ThemeColors } from '../../../Utils';
import { useInternet } from '../../../Context/InternetContext';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

const RecentList = ({ myAnime }) => {
    const navigation = useNavigation()
    // console.log("RecentList Rendered")
    const { isOnline } = useInternet()

    if (!isOnline) {
        return navigation.navigate("Downloads")
    }
    const VideoOnpress = useCallback((item) => {
        navigation.navigate("Video", { 
            animeId: item?.animeID ,
            episodeId: item?.episodeId,
            episodeNum: item?.episodeNum
        })
        // console.log(item)
    }, [])

    const renderItem = useCallback(({ item }) => {
        // console.log("render Item RecentList")
        return (
            <TouchableOpacity
                style={{ marginHorizontal: 4 }}
                onPress={() => VideoOnpress(item)}>
                <AnimecardVertical anime={item} />
            </TouchableOpacity>
        )
    }, [])

    const keyExtractor = useMemo(() => (item, index) =>
        `${item?.animeID}-${index}-RecentList`)

    const getItemLayout = useCallback((data, index) => ({
        length: 145,
        offset: 145 * index,
        index,
    }), [])

    const ListEmptyComponent = useMemo(() => (<Text style={{ fontSize: 20, color: color.White, textAlign: "center" }}>List was Empty</Text>), [])

    const memoizeFlatList = useMemo(() => {
        // console.log("Recent FlatList")
        return (
            <FlatList
                nestedScrollEnabled={true}
                data={myAnime}
                horizontal={true}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                // windowSize={10}
                // initialNumToRender={10}
                removeClippedSubviews={false}
                // maxToRenderPerBatch={10}
                ListEmptyComponent={ListEmptyComponent}
            />
        )
    }, [myAnime])

    const ShowMoreOnpress = useCallback(() => {
        navigation.navigate("Recent")
    }, [])

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal:5 }}>
                <Text style={styles.Heading}>New Episode Releases</Text>
                <TouchableOpacity onPress={ShowMoreOnpress}>
                    <Text style={styles.showMore}> Show More</Text>
                </TouchableOpacity>
            </View>
            {memoizeFlatList}
        </View>
    )
}

export default memo(RecentList)

const styles = StyleSheet.create({
    Heading: {
        fontSize: 18,
        fontFamily: font.OpenSansMedium,
        fontWeight: "800",
        color: color.White,
        textTransform: "capitalize",
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    showMore: {
        fontSize: 14,
        color: color.Orange,
        fontFamily: font.OpenSansMedium,
        fontWeight: "700",
    }
})