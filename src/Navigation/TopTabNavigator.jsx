import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { WatchListScreen } from '../Screens/StackScreens';
import DownloadedAnime from '../Screens/StackScreens/DownloadedAnime';

const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="WatchList" component={WatchListScreen} />
      <TopTab.Screen name="Downloads" component={DownloadedAnime} />
    </TopTab.Navigator>
  )
}

export default TopTabNavigator