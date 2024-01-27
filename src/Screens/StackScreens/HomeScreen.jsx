import { View } from 'react-native';
import React from 'react';
import BottomTabNavigation from '../../Navigation/BottomTabNavigation';
import {ThemeColors} from '../../Utils';

const color= ThemeColors.DARK
export default function HomeScreen() {

  return (
    <View style={{flex: 1, backgroundColor:color.DarkBackGround}}>
      {/* <Text>homeStack</Text> */}
      <BottomTabNavigation/>
    </View>
  );
}
