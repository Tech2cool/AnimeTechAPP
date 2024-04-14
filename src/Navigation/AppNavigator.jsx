import { View, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import {ThemeColors} from '../Utils';
import Testing from '../Screens/StackScreens/Testing';
import SetLinks from '../Screens/StackScreens/SetLinks';
import {Splash, HomeScreen, VideoScreen, AnimeInfoScreen, 
        WatchListScreen, GenreScreen, MovieScreen, TopAiringScreen} from "../Screens/StackScreens"
import Recent from '../Screens/StackScreens/Recent';
import WeekSchedule from '../Screens/StackScreens/WeekSchedule';
import PopularScreen from '../Screens/BottomNavScreens/PopularScreen';
import DownloadedAnime from '../Screens/StackScreens/DownloadedAnime';
import OfflineVideoScreen from '../Screens/StackScreens/OffliceVideoScreen';
const Stack = createStackNavigator();
const color = ThemeColors.DARK
const AppNavigator = () => {

    return (
    <NavigationContainer>
      <View style={{backgroundColor:"black", flex:1}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen 
                name="Splash"
                component={Splash}
                options={{headerShown: false, }}
            />
            <Stack.Screen 
                name="HomeStack"
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen 
                name="Recent"
                component={Recent}
                options={{headerShown: true,
                  headerTintColor:color.White,
                  headerStyle:{
                  backgroundColor:color.DarkBackGround,
                }}}
            />
          <Stack.Screen 
                name="Video" 
                component={VideoScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="OfflineVideo" 
                component={OfflineVideoScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="AnimeInfo" 
                component={AnimeInfoScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="WatchList" 
                component={WatchListScreen}
                options={{headerShown: true,
                  headerTintColor:color.White,
                  headerStyle:{
                  backgroundColor:color.DarkBackGround,
                }}}
            />
          <Stack.Screen 
                name="Genre" 
                component={GenreScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="Movies" 
                component={MovieScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="TopAring" 
                component={TopAiringScreen}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="Testing" 
                component={Testing}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="SetLinks" 
                component={SetLinks}
                options={{headerShown: false}}
            />
          <Stack.Screen 
                name="WeekSchedule" 
                component={WeekSchedule}
                options={{headerShown: true,
                  headerTintColor:color.White,
                  headerStyle:{
                  backgroundColor:color.DarkBackGround,
                }}}
            />
          <Stack.Screen 
                name="Popular" 
                component={PopularScreen}
                options={{headerShown: true,
                  headerTintColor:color.White,
                  headerStyle:{
                  backgroundColor:color.DarkBackGround,
                }}}
            />
          <Stack.Screen 
                name="Downloads" 
                component={DownloadedAnime}
                options={{headerShown: true,
                  headerTintColor:color.White,
                  headerStyle:{
                  backgroundColor:color.DarkBackGround,
                }}}
            />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  )
}

export default AppNavigator