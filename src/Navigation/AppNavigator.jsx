import { View, Text, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../Screens/StackScreens/Splash';
import HomeScreen from '../Screens/StackScreens/HomeScreen';
import VideoScreen from '../Screens/StackScreens/VideoScreen';
import { LanguageProvider } from '../Context/LanguageContext';
import AnimeInfoScreen from '../Screens/StackScreens/AnimeInfoScreen';
import { useVideoPlayer } from '../Context/VideoPlayerContext';
import Orientation from 'react-native-orientation-locker';
import WatchListScreen from '../Screens/StackScreens/WatchListScreen';
import ThemeColors from '../Utils/ThemeColors';
const Stack = createStackNavigator();
const color = ThemeColors.DARK
const AppNavigator = () => {
  // const {videoState, setVideoState} = useVideoPlayer()

  // function handleOrientationApp(orientation) {
  //   if(!videoState.isFullscreen){
  //       // setVideoState(s => ({...s, isFullscreen: false})),
  //       StatusBar.setHidden(false),
  //       navigation.setOptions({ tabBarStyle: { display: undefined }})
  //       Orientation.unlockAllOrientations();
  //   }
  // }
  // useEffect(() => {
  //   Orientation.addOrientationListener(handleOrientationApp);

  //   // Orientation.lockToLandscapeLeft();
  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientationApp);
  //   };
  // }, []);

  return (
    <NavigationContainer>
      <View style={{backgroundColor:"black", flex:1}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
        <Stack.Navigator>
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
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  )
}

export default AppNavigator