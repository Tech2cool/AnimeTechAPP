import { View, Text, StatusBar, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Splash from '../Screens/StackScreens/Splash';
import HomeScreen from '../Screens/StackScreens/HomeScreen';
import VideoScreen from '../Screens/StackScreens/VideoScreen';
import { LanguageProvider } from '../Context/LanguageContext';
import AnimeInfoScreen from '../Screens/StackScreens/AnimeInfoScreen';
import { useVideoPlayer } from '../Context/VideoPlayerContext';
import WatchListScreen from '../Screens/StackScreens/WatchListScreen';
import GenreScreen from "../Screens/StackScreens/GenreScreen"
import ThemeColors from '../Utils/ThemeColors';
import MovieScreen from '../Screens/StackScreens/MovieScreen';
import TopAiringScreen from '../Screens/StackScreens/TopAiringScreen';
import Testing from '../Screens/StackScreens/Testing';
import SetLinks from '../Screens/StackScreens/SetLinks';
import { getQueryParams } from '../Utils/Functions';

const Stack = createStackNavigator();
const color = ThemeColors.DARK
const AppNavigator = () => {
  // const deepLinking = {
  //   prefixes:["https:animeTech.app", "animeTech://"],
  //   config:{
  //     Home:"Testing",
  //     Details:{
  //       path:"Testing",
  //       params:{
  //         id:null
  //       }
  //     }
  //   }
  // }
  // const linking = {
  //   prefixes: ['https://ani-short.vercel.app', 'animeTech://'],
  //   config: {
  //     screens: {
  //       Testing:{
  //         path:'testing/:id',
  //       },
  //       SetLinks:{
  //         path:'SetLinks',
  //       },
  //       video:{
  //         path:'video/:animeId/:oneEpisode',
  //         // parse: {
  //         //   oneEpisode: (serializedObject) => JSON.parse(decodeURIComponent(serializedObject)),
  //         // },
  //         // stringify: {
  //         //   oneEpisode: (oneEpisode) => JSON.stringify(oneEpisode),
  //         // },
  
  //       }
  //     },
  //   },
  // };
  
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
                name="Video" 
                component={VideoScreen}
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
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  )
}

export default AppNavigator