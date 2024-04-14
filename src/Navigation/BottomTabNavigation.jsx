import { View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from '../Screens/BottomNavScreens/SettingScreen';
import PopularScreen from '../Screens/BottomNavScreens/PopularScreen';
import SearchScreen from '../Screens/BottomNavScreens/SearchScreen';
import HomeScreen2 from '../Screens/BottomNavScreens/HomeScreen2';
import HomeTopbar from '../components/Topbar/HomeTopbar';
import { ThemeColors, IIcon, MCIcon, MIcon } from '../Utils';
import { WatchListScreen } from '../Screens/StackScreens';
import MylistScreen from '../Screens/MyList/MylistScreen';

const Tab = createBottomTabNavigator();
const color = ThemeColors.DARK
export default function BottomTabNavigation() {
  return (
    <View style={{ flex: 1, backgroundColor: color.DarkBackGround }}>

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // header: ({ navigation, route, options }) => (
          //   <HomeTopbar
          //     state={navigation.state}
          //     descriptors={navigation.descriptors}
          //     navigation={navigation}
          //   />
          // ),
          tabBarActiveTintColor: color.Orange,
          tabBarInactiveTintColor: color.LightGray,
          labelStyle: {
            fontSize: 14,
          },
          tabBarStyle: {
            backgroundColor: color.DarkBackGround,
            // borderColor:color.LighterGray2,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: 55,
            marginBottom: 2,
          }
        }}
        initialRouteName='HomeScreen'
      >

        {/* <Tab.Screen name="Home" component={HomeScreen}
      color={color.DarkGray}
      
        options={{
          tabBarLabel:"Home",
          tabBarIcon: ({color, size})=>(
            <MIcon name="home" size={size} color={color} />
          ),
        }}
      /> */}
        <Tab.Screen name="HomeScreen" component={HomeScreen2}
          color={color.DarkGray}

          options={{

            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MIcon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen name="Search" component={SearchScreen}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <IIcon name="search" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen name="WatchList" component={WatchListScreen}
          options={{
            tabBarLabel: "My List",
            tabBarIcon: ({ color, size }) => (
              <MCIcon name="bookmark-minus-outline" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen name="Setting" component={SettingScreen}
          options={{
            tabBarLabel: "Setting",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <IIcon name="settings" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  )
}


