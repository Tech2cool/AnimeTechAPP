import React from 'react';
import { View, Text, StyleSheet, Switch,TouchableOpacity, Animated,TouchableWithoutFeedback } from 'react-native';
import ThemeColors from '../../Utils/ThemeColors';
import { useLanguage } from '../../Context/LanguageContext';

const color = ThemeColors.DARK;

const HomeTopBar = () => {
  const{currentLang, toggleLanguage}=useLanguage();
  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          <Text style={styles.title}>Anime<Text style={[styles.title, {color:color.Orange}]}>Tech</Text></Text>

        <TouchableWithoutFeedback
        onPress={toggleLanguage}
        >
          <View style={styles.switch}>
          <View style={currentLang ==="en"?styles.switchBtnActive:styles.switchBtn}>
            <Text style={currentLang ==="en"?styles.switchTextActive:styles.switchText}>EN</Text>
          </View>
          <View style={currentLang ==="jp"?styles.switchBtnActive:styles.switchBtn}>
            <Text style={currentLang ==="jp"?styles.switchTextActive:styles.switchText}>JP</Text>
          </View>
        </View>
        </TouchableWithoutFeedback>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Adjust this value based on your device's status bar height
},
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: color.DarkBackGround,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:"row",
    borderBottomColor:color.LighterGray2,
    borderBottomWidth:1,
    paddingHorizontal:10,
    zIndex: 1, // Ensure the top bar is above other components
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex:1,
  },
  switch:{
    flexDirection:"row",
    width:100,
    height:42,
    backgroundColor:color.DarkBackGround,
    borderRadius:99,
    // padding:10,
    alignItems:"center",
    justifyContent:"space-around",
    overflow:"hidden",
    padding:2,
    borderWidth:3,
    borderColor:color.LighterGray,
  },
  switchBtn:{
    overflow:"hidden",
    backgroundColor:color.DarkBackGround,
    flex:1,
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    // borderRadius:12,
  }, 
  switchBtnActive:{
    overflow:"hidden",
    backgroundColor:color.Orange, 
    flex:1,
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:50,

  },
  switchText:{
    color: color.White,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight:20,
  },
  switchTextActive:{
    color: color.White,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight:20,
  }
});

export default HomeTopBar;
