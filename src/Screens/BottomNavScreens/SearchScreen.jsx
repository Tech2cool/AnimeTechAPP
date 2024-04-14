import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView,
  RefreshControl, ToastAndroid, Text, FlatList, Modal, Alert, Dimensions
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAnimeBySearch, isValidData, setPagesArray } from '../../Utils/Functions';
import { Pagination, useDebounce, AnimeCard, HomeTopbar } from '../../components';
import { ThemeColors, IIcon, MCIcon, FA6Icon } from '../../Utils';
import { useVideoPlayer } from '../../Context/VideoPlayerContext';
import { useInternet } from '../../Context/InternetContext';
import SelectDropdown from 'react-native-select-dropdown';
import { Genres, zIndex } from '../../Utils/contstant';
const filterListItem = [
  {
    name: "all",
    value: "",
  },
  {
    name: "year-asc",
    value: "year-asc",
  },
  {
    name: "year-desc",
    value: "year-desc",
  }
  // {
  //   name:"ongoing",
  //   value:"ongoing",
  // },
  // {
  //   name:"completed",
  //   value:"completed",
  // },
]
const StatusListItem = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Upcoming",
    value: "Upcoming",
  },
  {
    name: "Ongoing",
    value: "Ongoing",
  },
  {
    name: "Completed",
    value: "Completed",
  },
]
const TypeListItem = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Movie",
    value: "3",

  },
  {
    name: "TV",
    value: "1",

  },
  {
    name: "OVA",
    value: "26",

  },
  {
    name: "ONA",
    value: "30",

  },
  {
    name: "Special",
    value: "2",
  },
  {
    name: "Music",
    value: "32",
  }
]
const subTypeListItem = [
  {
    name: "All",
    value: "",
  },
  {
    name: "sub",
    value: "sub",
  },
  {
    name: "dub",
    value: "dub",
  },
]
const seasonListItem = [
  {
    name: "All",
    value: "",
  },
  {
    name: "fall",
    value: "fall",
  },
  {
    name: "summer",
    value: "summer",
  },
  {
    name: "spring",
    value: "spring",
  },
  {
    name: "winter",
    value: "winter",
  }
]
const TName = {
  zero: 0,
  status: "status",
  subType: "subType",
  type: "type",
  season: "type",
}
function getAllYear() {
  const currentYear = new Date().getFullYear();

  // Start from the year 1999
  const startYear = 1999;

  // Array to store the years
  const yearsArray = [];

  // Loop from 1999 to the current year and add each year to the array
  for (let year = startYear; year <= currentYear; year++) {
    yearsArray.push(`${year}`);
    // console.log(typeof(`${year}`))
  }
  return yearsArray
}
const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function SearchScreen({ navigation }) {
  const { setVideoState } = useVideoPlayer()
  const { isOnline } = useInternet()
  const [selected, setSelected] = useState({
    sort: filterListItem[0],
    status: StatusListItem[0],
    subtype: subTypeListItem[0],
    type: TypeListItem[0],
    season: seasonListItem[0],
  });

  const [filterCount, setFilterCount] = useState(0)
  const [countFix, setCountFix] = useState({
    sort: 0,
    status: 0,
    subType: 0,
    type: 0,
    season: 0,
    genre: 0,
    year: 0,
  })

  const [genreLimit, setGenreLimit] = useState(true);
  const [yearLimit, setYearLimit] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectYear, setSelectYear] = useState([]);
  const [allYear, setAllYear] = useState([]);
  const [anime, setAnime] = useState([]);
  const [filterAnime, setFilterAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myInput, setMyInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [allSelectedFilter, setAllSelectedFilter] = useState([]);

  const [myPage, setMyPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages: [],
  });

  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(myInput, 500);
  if (!isOnline) {
    return navigation.navigate("Downloads")
  }
  const filterArray = []
  useEffect(() => {
    if (isValidData(selected?.sort?.value) ||
      isValidData(selected?.status?.value) ||
      isValidData(selected?.subtype?.value) ||
      isValidData(selected?.type?.value) ||
      isValidData(selected?.season?.value) ||
      genres?.length > 0 ||
      selectYear?.length > 0
    ) {
      if (isValidData(selected?.sort?.value)) {
        if (!filterArray.includes(selected?.sort?.name)) {
          filterArray.push(selected?.sort?.name)
        }
      }
      if (isValidData(selected?.status?.value)) {
        if (!filterArray.includes(selected?.status?.name)) {
          filterArray.push(selected?.status?.name)
        }
      }
      if (isValidData(selected?.subtype?.value)) {
        if (!filterArray.includes(selected?.subtype?.name)) {
          filterArray.push(selected?.subtype?.name)
        }
      }
      if (isValidData(selected?.type?.value)) {
        if (!filterArray.includes(selected?.type?.name)) {
          filterArray.push(selected?.type?.name)
        }
      }
      if (isValidData(selected?.season?.value)) {
        if (!filterArray.includes(selected?.season?.name)) {
          filterArray.push(selected?.season?.name)
        }
      }
      genres?.map((selectedGenre) => {
        if (!filterArray?.includes(selectedGenre))
          return filterArray.push(selectedGenre)
      })
      selectYear?.map((year) => {
        if (!filterArray?.includes(year))
          return filterArray.push(year)
      })
      setAllSelectedFilter(filterArray)
    }
  }, [selected, selectYear, genres])

  const filteredGenre = genreLimit ? Genres?.slice(0, 15) : Genres;
  const filteredAllYears = yearLimit ? allYear?.sort((a, b) => b - a)?.slice(0, 10) : allYear.sort((a, b) => b - a);
  const fetchAnime = async (title = "", page = 1) => {
    try {
      setIsLoading(true);
      // console.log("fetchPage:")
      // console.log("fetchPage: "+page, typeof(page))
      // let req
      // const result = await searchh(title, page, genre, status,subtype, type, season, year)
      const req = await fetchAnimeBySearch(
        title, page, convertGenretoURL(),
        selected?.status?.value,
        selected?.subtype?.value,
        selected?.type?.value,
        selected?.season?.value, convertYeartoURL());
      if(
      isValidData(convertGenretoURL())||
      isValidData(selected?.status?.value)||
      isValidData(selected?.subtype?.value)||
      isValidData(selected?.type?.value)||
      isValidData(selected?.season?.value)||
      isValidData(convertYeartoURL())){
        setFilterAnime(req?.list)
      }else{
        setAnime(req?.list);
      }
      // console.log(req?.list)
      setMyPage(prev => (
        {
          ...prev,
          currentPage: page,
          totalPage: req?.totalPages,
          availPages: setPagesArray(myPage?.currentPage, req?.totalPages)
        }
      ));
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  }

  const onRefresh = useCallback(() => {
    if (!isOnline) return
    setRefreshing(true);
    fetchAnime(myInput, 1);
    setVideoState(prev => ({
      ...prev,
      isVideoScreen: false,
    }))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("Downloads")
    } else {
      setMyPage(prev => ({
        ...prev,
        currentPage: 1,
      }))
      setVideoState(prev => ({
        ...prev,
        isVideoScreen: false,
      }))
    }
    setAllYear(getAllYear())
  }, [])

  useEffect(() => {
    if (!isOnline) {
      navigation.navigate("Downloads")
    } else {

      if (isValidData(debouncedSearch)) {
        fetchAnime(debouncedSearch, 1);
      }
    }
    // console.log("searched")
  }, [debouncedSearch])
  const handleYearSort = (selectedItem) => {
    if (isValidData(selectedItem?.value) && !selected?.sort?.value?.includes(selectedItem?.value)) {
      setSelected(prev => ({ ...prev, sort: selectedItem }))
      // setAllSelectedFilter(prev => ( [...prev, selectedItem ]))
      countFix?.sort === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, sort: 1 }))
      // console.log("if sort")
      // console.log(selectedItem)
    } else {
      setSelected(prev => ({ ...prev, sort: filterListItem[0] }))
      setFilterCount(prev => prev === 0 ? prev : prev - 1)
      setCountFix(prev => ({ ...prev, sort: 0 }))
      // console.log("else sort")
      // console.log(selectedItem)
    }
    // console.log(selectedItem?.name)
    //handleAllSecelectedFilters(selectedItem?.name)
  }
  const onSelectSort = (selectedItem) => {
    // console.log(selectedItem)
    switch (selectedItem?.value) {
      case filterListItem[1]?.value: {
        setFilterAnime(anime.sort((a, b) => (
          a?.year - b?.year ||
          parseInt(a?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(b?.AdditionalInfo?.startDate?.split("-")[0])
        )))
        break;
      }
      case filterListItem[2]?.value: {
        setFilterAnime(anime.sort((a, b) => (
          b?.year - a?.year ||
          parseInt(b?.AdditionalInfo?.startDate?.split("-")[0]) - parseInt(a?.AdditionalInfo?.startDate?.split("-")[0])
        )))
        break;
      }
      // case filterListItem[3]?.value: {
      //   setFilterAnime(anime.filter((an, i) => (
      //     an?.status === "current" ||
      //     an?.status === "ongoing" ||
      //     an?.AdditionalInfo?.status === "current" ||
      //     an?.AdditionalInfo?.status === "ongoing"
      //   )))
      //   break;
      // }
      // case filterListItem[4]?.value: {
      //   setFilterAnime(anime.filter((an, i) => (
      //     an?.status === "finished" ||
      //     an?.status === "completed" ||
      //     an?.AdditionalInfo?.status === "finished" ||
      //     an?.AdditionalInfo?.status === "completed"
      //   )))
      //   break;
      // }
      default: {
        setFilterAnime([])
        // setFilterCount(prev=> prev===0?prev:prev-1)
        break;
      }
    }

  }
  const onSelectType = (selectedItem) => {
    // console.log(selectedItem)
    if (isValidData(selectedItem?.value) && !selected?.type?.value?.includes(selectedItem?.value)) {
      setSelected(prev => ({ ...prev, type: selectedItem }))
      countFix?.type === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, type: 1 }))
    } else {
      setSelected(prev => ({ ...prev, type: TypeListItem[0] }))
      setFilterCount(prev => prev === 0 ? prev : prev - 1)
      setCountFix(prev => ({ ...prev, type: 0 }))
    }
    //handleAllSecelectedFilters(selectedItem?.value)
  }
  const onSelectSubType = (selectedItem) => {
    // console.log(selectedItem)
    if (isValidData(selectedItem?.value) && !selected?.subtype?.value?.includes(selectedItem?.value)) {
      setSelected(prev => ({ ...prev, subtype: selectedItem }))
      countFix?.subType === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, subType: 1 }))
    } else {
      setSelected(prev => ({ ...prev, subtype: subTypeListItem[0] }))
      setFilterCount(prev => prev === 0 ? prev : prev - 1)
      setCountFix(prev => ({ ...prev, subType: 0 }))
    }
    //handleAllSecelectedFilters(selectedItem?.value)
  }
  const onSelectSeason = (selectedItem) => {
    // console.log(selectedItem)
    if (isValidData(selectedItem?.value) && !selected?.season?.value?.includes(selectedItem?.value)) {
      setSelected(prev => ({ ...prev, season: selectedItem }))
      countFix?.season === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, season: 1 }))
    } else {
      setSelected(prev => ({ ...prev, season: seasonListItem[0] }))
      setFilterCount(prev => prev === 0 ? prev : prev - 1)
      setCountFix(prev => ({ ...prev, season: 0 }))
    }
    //handleAllSecelectedFilters(selectedItem?.value)

  }
  const onSelectStatus = (selectedItem) => {
    if (isValidData(selectedItem?.value) && !selected?.status?.value?.includes(selectedItem?.value)) {
      setSelected(prev => ({ ...prev, status: selectedItem }))
      countFix?.status === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, status: 1 }))
    } else {
      setSelected(prev => ({ ...prev, status: seasonListItem[0] }))
      setFilterCount(prev => prev === 0 ? prev : prev - 1)
      setCountFix(prev => ({ ...prev, status: 0 }))
    }
    //handleAllSecelectedFilters(selectedItem?.value)
  }
  const onSelectYears = (selectedItem) => {
    if (!selectYear?.includes(selectedItem)) {
      setSelectYear(prev => ([...prev, selectedItem]))
      // console.log(selectedItem)
      // console.log(selectYear)
      countFix?.year === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, year: 1 }))
    } else {
      const removeYears = selectYear?.filter((Year) => Year !== selectedItem)
      setSelectYear(removeYears)
      if (selectYear?.length <= 1) {
        setCountFix(prev => ({ ...prev, year: 0 }))
        setFilterCount(prev => prev == 0 ? prev : prev - 1)
      }
    }
    //handleAllSecelectedFilters(selectedItem)
  }
  const onSelectGenre = (selectedItem) => {
    if (!genres?.includes(selectedItem)) {
      setGenres(prev => ([...prev, selectedItem]))
      // console.log(selectedItem)
      // console.log(genres)
      countFix?.genre === 0 && setFilterCount(prev => prev + 1)
      setCountFix(prev => ({ ...prev, genre: 1 }))
    } else {
      const removeGenres = genres?.filter((genre) => genre !== selectedItem)
      setGenres(removeGenres)
      if (genres?.length <= 1) {
        setFilterCount(prev => prev == 0 ? prev : prev - 1)
        setCountFix(prev => ({ ...prev, genre: 0 }))
      }
    }
    //handleAllSecelectedFilters(selectedItem)
  }
  function convertYeartoURL() {
    if (selectYear?.length <= 0) return ""
    const resp = selectYear?.map((Year) => {
      return `&year[]=${Year}`
    })
    // console.log(resp.join(""))
    return resp.join("")
  }
  function convertGenretoURL() {
    if (genres?.length <= 0) return ""
    const resp = genres?.map((genre) => {
      return `&genre[]=${genre}`
    })
    // console.log(resp.join(""))
    return resp.join("")
  }
  const ListHeaderComponent = (
    <>
      <View style={{
        // flex:1, 
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        // paddingTop:30,
        justifyContent: "space-between"
      }}>
        {/* <Text style={{ fontFamily:font.OpenSansBold, color:color.White }}>Filters:</Text> */}
        <View style={[styles.keyAvoing, { maxWidth: "82%" }]}>
          <TextInput
            style={{ height: 35, color: color.LightGray, fontWeight: "600", flex: 1 }}
            placeholder="Search anime here!..."
            placeholderTextColor={color.LightGray}
            onChangeText={newText => { setMyInput(newText) }}
            value={myInput}
          // defaultValue={"one piece"}
          />
          <IIcon name={"search"} size={30} color={color.Orange} onPress={() => fetchAnime(debouncedSearch, 1)} />
        </View>

        <View style={{
          borderRadius: 4,
          padding: 5,
          width: 45,
          height: 45,
          justifyContent: "center",
          position: "relative"
        }}>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
            <View style={{
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              width: 18,
              height: 18,
              backgroundColor: color.Orange,
              borderRadius: 50,
              right: 0,
              opacity: filterCount > 0 ? 1 : 0,
              top: -4,
              zIndex: zIndex.TOP,
              elevation: 10,
              shadowColor: color.LightGray,
              shadowOffset: { width: 0, height: 2 }
            }}>
              <Text style={{ fontSize: 16, color: color.White, fontFamily: font.OpenSansBold, lineHeight: 19 }}>{filterCount}</Text>
            </View>
            <FA6Icon name='sliders' size={30} color={color.LightGray} />
          </TouchableOpacity>
        </View>

      </View>
      <View>
        <ScrollView 
        horizontal={true}
        style={{ flexWrap: "wrap", flexDirection: "row", gap: 10,paddingBottom:4 }}>
          {
            allSelectedFilter?.map((item, i) => (
              <TouchableOpacity
                // onPress={() => onSelectGenre(item)}
                style={[styles.allFilterBtn]}
                key={`${i}-${item}`}>
                <Text style={{
                  color: color.White,
                  fontFamily: font.OpenSansBold,
                  textTransform: "capitalize",
                }}>{item}</Text>
              </TouchableOpacity>))
          }
        </ScrollView>
      </View>
    </>
  )
  const handleReset = () => {
    setSelected(prev => ({
      ...prev,
      sort: filterListItem[0],
      status: StatusListItem[0],
      subtype: subTypeListItem[0],
      type: TypeListItem[0],
      season: seasonListItem[0],
    }))
    //handleAllSecelectedFilters([])
    setCountFix({
      sort: 0,
      status: 0,
      subType: 0,
      type: 0,
      season: 0,
      genre: 0,
      year: 0,
    })
    filterArray?.splice(0)
    setAllSelectedFilter([])
    setFilterCount(0)
    setSelectYear([])
    setGenres([])
    setFilterAnime([])
    setModalVisible(false)
  }
  const handleApply = () => {
    if (filterCount === 0) return ToastAndroid.show("Select atleast one Filter", ToastAndroid.SHORT)
    if (myInput === "") {
      fetchAnime(" ", 1)
    }
    else {
      fetchAnime(myInput, 1)
    }
    onSelectSort(selected?.sort)
    setModalVisible(false)
  }
  const renderItem = useCallback(({ item, index }) => (
    <TouchableOpacity activeOpacity={0.7}
      onPress={() => navigation.navigate("AnimeInfo", { anime: item })}>
      <AnimeCard anime={item} />
    </TouchableOpacity>), [selected, filterAnime])
  const animeNotFound = () =>{
    if(!isValidData(myInput))
    {
      return(<>
      <Text style={{
          color: color.White, textAlign: "center",
          fontFamily: font.OpenSansBold, marginVertical: 10
        }}>Search Anime eg. Solo Leveling</Text>
      <Text style={{
          color: color.LightGray, textAlign: "center",
          fontFamily: font.OpenSansBold,
        }}>Tip: use Filters to find anime easily</Text>
    </>)
    }
    return(
      <Text style={{
        color: color.White, textAlign: "center",
        fontFamily: font.OpenSansBold, marginVertical: 20
      }}>Anime Not Found</Text>)
  }
  const ListFooterComp = () => (<View style={{marginBottom:150}}>
    <Pagination 
      myPage={myPage} 
      setMyPage={setMyPage} 
      fetchAnime={fetchAnime} 
      title={myInput}
      search={true}
    />
  </View>)
  const memoizedFlatList = useMemo(() => {
    // console.log("flatListed pop")
    return (
      <FlatList
        data={filterAnime?.length > 0 ? filterAnime : anime}
        keyExtractor={(item, index) => `${item.animeID}-${index}-SearchScreenFlatlist`}
        renderItem={renderItem}
        // ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComp}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={animeNotFound}
      />)
  }, [anime, filterAnime, selected])

  return (
    <View style={styles.container}>
      <View style={{
        paddingBottom: 60,
        borderWidth: 1,
        marginBottom: 2,
        borderBottomColor: color.LighterGray2,
      }}>
        <HomeTopbar />
      </View>
      <View style={styles.mcontainer}>
        <Modal
          transparent={false}
          animationType='slide'
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          {/* Apply/Rest Btns + container */}
          <View style={{
            position: "absolute",
            backgroundColor: color.DarkBackGround2,
            borderColor: color.LighterGray,
            // borderWidth:1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopWidth: 1,
            flex: 1,
            bottom: 0,
            left: 0,
            width: Dimensions.get("window").width,
            height: 110,
            elevation: 10,
            zIndex: zIndex.HIGH,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}>
            <TouchableOpacity
              onPress={handleReset}
              style={{
                width: Dimensions.get("window").width / 2.2,
                height: 50,
                padding: 10,
                backgroundColor: color.LighterGray2,
                borderRadius: 20,
                borderColor: color.LighterGray,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ fontFamily: font.NunitoBlack, fontSize: 16, color: color.White }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={{
                width: Dimensions.get("window").width / 2.2,
                height: 50,
                padding: 10,
                backgroundColor: color.Orange,
                borderRadius: 20,
                borderColor: color.LighterGray,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center"
              }}>
              <Text style={{ fontFamily: font.NunitoBlack, fontSize: 16, color: color.White }}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity style={{ paddingBottom: 20 }}>
              <FA6Icon name='arrow-left' size={25} color={color.White} onPress={() => setModalVisible(false)} />
            </TouchableOpacity>
            {/* sort list container */}
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Sort</Text>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  filterListItem?.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => handleYearSort(item)}
                      style={[{
                        backgroundColor: selected?.sort?.name === item?.name ?
                          color.Orange : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item?.name}`}>
                      <Text style={{
                        color: selected?.sort?.name === item?.name ? color.White : color.LightGray,
                        textTransform: "capitalize",
                        fontFamily: font.OpenSansBold
                      }}>{item?.name}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>

            {/* SubType list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Sub Or Dub</Text>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  subTypeListItem.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectSubType(item)}
                      style={[{
                        backgroundColor: selected?.subtype?.name === item?.name ? color.Orange
                          : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item.name}`}>
                      <Text style={{
                        color: selected?.subtype?.name === item?.name ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold,
                        textTransform: "capitalize"
                      }}>{item?.name}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>

            {/* Type list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Type</Text>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  TypeListItem?.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectType(item)}
                      style={[{
                        backgroundColor: selected?.type?.name === item?.name ? color.Orange
                          : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item?.name}`}>
                      <Text style={{
                        color: selected.type.name === item?.name ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold
                      }}>{item?.name}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>

            {/* Status list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Status</Text>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  StatusListItem?.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectStatus(item)}
                      style={[{
                        backgroundColor: selected?.status?.name === item?.name ? color.Orange
                          : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item?.name}`}>
                      <Text style={{
                        color: selected?.status?.name === item?.name ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold
                      }}>{item?.name}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>

            {/* Season list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Season</Text>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  seasonListItem.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectSeason(item)}
                      style={[{
                        backgroundColor: selected?.season?.name === item?.name ? color.Orange
                          : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item?.name}`}>
                      <Text style={{
                        color: selected?.season?.name === item?.name ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold,
                        textTransform: "capitalize"
                      }}>{item?.name}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>
            {/* Year list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Year</Text>
                <Text onPress={() => setYearLimit(!yearLimit)} style={{ fontFamily: font.OpenSansBold, color: color.Orange, fontSize: 16, paddingRight: 10 }}>{yearLimit ? "Show all" : "Show few"}</Text>
              </View>
              <View style={{ flexWrap: "wrap", flexDirection: "row", rowGap: 10, columnGap: 7 }}>
                {
                  filteredAllYears?.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectYears(item)}
                      style={[{
                        backgroundColor: selectYear?.includes(item) ? color.Orange : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item}`}>
                      <Text style={{
                        color: selectYear?.includes(item) ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold,
                        textTransform: "capitalize",
                      }}>{item}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>
            {/* Genre list container */}
            <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: font.OpenSansBold, color: color.White, fontSize: 16 }}>Genre</Text>
                <Text onPress={() => setGenreLimit(!genreLimit)} style={{ fontFamily: font.OpenSansBold, color: color.Orange, fontSize: 16, paddingRight: 10 }}>{genreLimit ? "Show all" : "Show few"}</Text>
              </View>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                {
                  filteredGenre?.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => onSelectGenre(item)}
                      style={[{
                        backgroundColor: genres?.includes(item) ? color.Orange : color.DarkBackGround2
                      }, styles.SortingBtn]}
                      key={`${i}-${item}`}>
                      <Text style={{
                        color: genres?.includes(item) ? color.White : color.LightGray,
                        fontFamily: font.OpenSansBold,
                        textTransform: "capitalize",
                      }}>{item}</Text>
                    </TouchableOpacity>))
                }
              </View>
            </View>
            <View style={{ marginVertical: 75 }}></View>
          </ScrollView>
        </Modal>
        {ListHeaderComponent}
        {isLoading ? <ActivityIndicator size={"large"} color={color.Orange} /> : memoizedFlatList}

        {/* {content} */}
        {/* {searchbox}  */}
        {/* {inputContent} */}
        {/* {animeNotFound} */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // padding:10,
    // paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  keyAvoing: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: color.DarkBackGround,
    borderColor: color.LighterGray,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
    flex: 1,

  },
  mcontainer: {
    marginBottom: 20,
    paddingTop: 5,
  },
  BtnContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  currentPage: {
    borderRadius: 99,
    backgroundColor: color.DarkBackGround,
    borderWidth: 5,
    borderColor: color.White,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  myBtn: {
    paddingVertical: 18,
    // width: 100,
    // height: 200,
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
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
    flex: 0,
    alignSelf: "flex-start",
    maxWidth: 180,
    // flex:1,
    backgroundColor: color.DarkBackGround,
    // borderColor:color.LighterGray,
    // borderWidth:1,
  },
  rowStyle: {
    borderColor: 'transparent'
  },
  selectedRowStyle: {
    backgroundColor: color.Orange,
  },
  ListFooter: {
    marginBottom: 80,
  },
  modalContainer: {
    backgroundColor: color.DarkBackGround2,
    flex: 1,
    // paddingHorizontal: 10,
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 20,
    gap: 10,
    position: "relative"
  },
  SortingBtn: {
    borderColor: color.LighterGray,
    borderWidth: 1,
    flex: 0,
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 12,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  allFilterBtn: {
    borderColor: color.LighterGray,
    borderWidth: 1,
    flex: 0,
    alignSelf: "flex-start",
    // padding: 10,
    paddingVertical:8,
    paddingHorizontal:8,
    borderRadius: 12,
    minWidth: 60,
    backgroundColor: color.Orange, 
    // opacity:0.9,
    marginHorizontal:2, 
    justifyContent: "center",
    alignItems: "center"
  }
})
