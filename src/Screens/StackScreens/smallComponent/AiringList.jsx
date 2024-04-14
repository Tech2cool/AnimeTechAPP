import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import AnimecardVertical from '../../../components/AnimeCardVertical'
import { useNavigation } from '@react-navigation/native'
import { ThemeColors } from '../../../Utils';
import { useInternet } from '../../../Context/InternetContext';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;

const AiringList = ({ myAnime }) => {
  
  const navigation = useNavigation()
  // console.log("AiringList Rendered")
  const { isOnline } = useInternet()
  if(!isOnline){
    return navigation.navigate("Downloads")
  }
  const renderItem = useCallback(({ item }) => {
    if(myAnime?.length === 0) return null
    return(
      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
        <AnimecardVertical anime={item} />
      </TouchableOpacity>
    )
  },[])

  const ListEmptyComponent = useMemo(()=>(<Text style={{fontSize:20, color:color.White, textAlign:"center"}}>List was Empty</Text>),[])
  
  const keyExtractor = useMemo(() => (item, index) => 
  `${item?.animeID}-${index}-AiringList`)

  const getItemLayout = useCallback((data, index) => ({
    length: 145,
    offset: 145 * index,
    index,
  }), [])

  const memoizeFlatList = useMemo(() => {
    // console.log("Airing FlatList")
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
    navigation.navigate("TopAring")
  }, [navigation])
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal:5 }}>
        <Text style={styles.Heading}>Top Airing</Text>
        <TouchableOpacity onPress={ShowMoreOnpress}>
        <Text style={styles.showMore}> Show More</Text>
        </TouchableOpacity>
      </View>
      {memoizeFlatList}
    </View>
  )
}

export default memo(AiringList)
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