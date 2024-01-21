import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import ThemeColors from '../../Utils/ThemeColors'

import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const color = ThemeColors.DARK;
const font = ThemeColors.FONT;
export default function SettingScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{padding:12, borderBottomColor:color.LighterGray, borderBottomWidth:1, 
        marginBottom:10, flexDirection:'row', gap:10, alignItems:"center"}}>
      <IIcon 
            name={"arrow-back"} 
            size={25} 
            color={color.White}
            onPress={() => navigation.goBack()}
          />        
        <Text style={{fontSize:18, fontFamily:font.PoppinsBlack, color:color.White}}>Setting</Text>
      </View>
      <TouchableOpacity style={styles.List} onPress={()=>{ navigation.navigate("WatchList")}}>
        <Text style={styles.ListText} >My WatchList</Text>
          <MIcon 
            name={"keyboard-arrow-right"} 
            size={25} 
            color={color.Orange}
            // onPress={() => navigation.goBack()}
          /> 
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    // padding:10,
    // paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
  List:{
    // backgroundColor:color.White,
    padding:14,
    borderRadius:10,
    marginHorizontal:5,
    // paddingVertical:15,
    borderColor:color.DarkGray,
    borderWidth:1,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  ListText:{
    // fontWeight:"600",
    fontFamily:font.PoppinsBlack,
    fontSize:16,
    color:color.Orange,
  }

})
