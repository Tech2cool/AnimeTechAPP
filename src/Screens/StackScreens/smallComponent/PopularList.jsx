import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import AnimecardVertical from '../../../components/AnimeCardVertical'
import { useNavigation } from '@react-navigation/native'
import { ThemeColors } from '../../../Utils';
import { useInternet } from '../../../Context/InternetContext';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

const PopularList = ({ myAnime }) => {
  const navigation = useNavigation()
  // console.log("PopularList Rendered")
  const { isOnline } = useInternet()

  if(!isOnline) {
    return navigation.navigate("Downloads")
  }
  const renderItem = useCallback(({ item }) => {
    // console.log("renderItem PopularList")
    return (

      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
        <AnimecardVertical anime={item} />
      </TouchableOpacity>
    )
  }, [])

  const ListEmptyComponent = useMemo(()=>(<Text style={{fontSize:20, color:color.White, textAlign:"center"}}>List was Empty</Text>),[])

  const keyExtractor = useMemo(() => (item, index) =>
    `${item?.animeID}-${index}-PopularList`)

  const getItemLayout = useCallback((data, index) => ({
    length: 145,
    offset: 145 * index,
    index,
  }), [])

  const memoizedFlatList = useMemo(() => {
    // console.log("Popular FlatList")
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
        ListEmptyComponent={ListEmptyComponent}
      // maxToRenderPerBatch={10}
      />
    )
  }, [myAnime])

  const ShowMoreOnpress = useCallback(() => {
    navigation.navigate("Popular")
  }, [navigation])

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal:5 }}>
        <Text style={styles.Heading}>Popular</Text>
        <TouchableOpacity onPress={ShowMoreOnpress}>
        <Text style={styles.showMore}> Show More</Text>
        </TouchableOpacity>
      </View>
      {memoizedFlatList}
    </View>)
}

export default memo(PopularList)

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