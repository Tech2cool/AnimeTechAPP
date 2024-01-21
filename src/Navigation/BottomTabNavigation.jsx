import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/BottomNavScreens/HomeScreen';
import SettingScreen from '../Screens/BottomNavScreens/SettingScreen';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IIcon from 'react-native-vector-icons/Ionicons';

import SearchScreen from '../Screens/BottomNavScreens/SearchScreen';
import PopularScreen from '../Screens/BottomNavScreens/PopularScreen';
import ThemeColors from '../Utils/ThemeColors';
import HomeTopbar from '../components/Topbar/HomeTopbar';

const Tab = createBottomTabNavigator();
const color = ThemeColors.DARK  
export default function BottomTabNavigation() {
  return (
    <View style={{flex:1, backgroundColor:color.DarkBackGround}}>

    <Tab.Navigator
    screenOptions={{
        // headerShown:false,
        header: ({ navigation, route, options }) => (
          <HomeTopbar
            state={navigation.state}
            descriptors={navigation.descriptors}
            navigation={navigation}
          />
        ),
      tabBarActiveTintColor:color.Orange,
        tabBarInactiveTintColor: color.LightGray,
        labelStyle:{
          fontSize:14,
        },
        tabBarStyle:{
          backgroundColor:color.DarkBackGround,
          // borderColor:color.LighterGray2,
          alignItems:"center",
          justifyContent:"center",
          flexDirection:"column",
          height:55,
          marginBottom:2,
        }
    }}
    >
        
      <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      color={color.DarkGray}
      
        options={{
          tabBarLabel:"Home",
          tabBarIcon: ({color, size})=>(
            <MIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Search" component={SearchScreen} 
        options={{
          tabBarLabel:"Search",
          tabBarIcon: ({color, size})=>(
            <IIcon name="search" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Popular" component={PopularScreen} 
        options={{
          tabBarLabel:"Popular",
          tabBarIcon: ({color, size})=>(
            <MCIcon name="fire" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Setting" component={SettingScreen} 
        options={{
          tabBarLabel:"Setting",
          headerShown:false,
          tabBarIcon: ({color, size})=>(
            <IIcon name="settings" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
      </View>
  )
}


