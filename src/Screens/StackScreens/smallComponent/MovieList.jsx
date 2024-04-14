import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import AnimecardVertical from '../../../components/AnimeCardVertical'
import { useNavigation } from '@react-navigation/native'
import { ThemeColors } from '../../../Utils';
import { useInternet } from '../../../Context/InternetContext';
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
let count = 1
const MovieList = ({ myAnime }) => {
  const navigation = useNavigation()
  // console.log("MovieList Rendered"+count)
  // count++
  const { isOnline } = useInternet()
  if(!isOnline){
    return navigation.navigate("Downloads")
  }
  const ListEmptyComponent = useMemo(()=>(<Text style={{fontSize:20, color:color.White, textAlign:"center"}}>List was Empty</Text>),[])
  
  const renderItem = useCallback(({ item }) => {
    if(myAnime?.length === 0) return null
    return(
      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        onPress={()=>navigation.navigate("AnimeInfo", { anime: item })}>
        <AnimecardVertical anime={item} />
      </TouchableOpacity>
    )
  }, [navigation,myAnime])

  const keyExtractor = useMemo(() => (item, index) => `${item?.animeID}-${index}-MovieList`)

  const memoizedFlatList = useMemo(() => {
    return (
      <FlatList
        nestedScrollEnabled={true}
        data={myAnime}
        horizontal={true}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // windowSize={5}
        // initialNumToRender={3}
        removeClippedSubviews={false}
        // maxToRenderPerBatch={5}
        ListEmptyComponent={ListEmptyComponent}
      />
    )
  }, [myAnime])

  const ShowMoreOnpress = useCallback(() => {
    navigation.navigate("Movies")
  }, [navigation])
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal:5 }}>
        <Text style={styles.Heading}>Movies</Text>
        <TouchableOpacity onPress={ShowMoreOnpress}>
          <Text style={styles.showMore}>Show More</Text>
        </TouchableOpacity>      
        </View>
      {memoizedFlatList}
    </View>
  )
}

export default memo(MovieList)

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