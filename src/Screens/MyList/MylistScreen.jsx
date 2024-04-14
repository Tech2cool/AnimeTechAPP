import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { WatchListScreen } from '../StackScreens';
import DownloadedAnime from '../StackScreens/DownloadedAnime';
import { ThemeColors } from '../../Utils';

const Tab = createMaterialTopTabNavigator();
const color = ThemeColors.DARK
const TabIndicator = ()=>{
  
  return(
    <View style={{width:100, height:10, backgroundColor:color.Red}}></View>
  )
}
const MylistScreen = ({ route, navigation }) => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor:color.Orange,
        tabBarInactiveTintColor:color.LightGray,
        
        tabBarStyle:{
          backgroundColor:color.DarkBackGround2, 
        },
        tabBarIndicatorStyle:{
          backgroundColor:color.Orange
        },
        tabBarLabelStyle:{
          fontWeight:"600"
        }
      }}
      

      
    >
      <Tab.Screen name="WatchList" component={WatchListScreen} 
        options={{
          headerShown: true,
          headerTintColor:color.Red,
          
          }}
      />
      <Tab.Screen name="Downloads" component={DownloadedAnime} />
    </Tab.Navigator>
  )
}

export default MylistScreen