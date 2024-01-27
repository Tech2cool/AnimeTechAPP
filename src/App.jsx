/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import ThemeColors from './Utils/ThemeColors';
import { LanguageProvider } from './Context/LanguageContext';
import AppNavigator from './Navigation/AppNavigator';
import { VideoPlayerProvider } from './Context/VideoPlayerContext';
import { PaginationProvider } from './Context/PaginationContext';

let color = ThemeColors.DARK
function App() {
  return (
    <View style={styles.container}>

    <SafeAreaView style={styles.container}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor={color.LighterGray2}
      /> */}
      <LanguageProvider>
      <PaginationProvider>
      <VideoPlayerProvider>
        <AppNavigator />
      </VideoPlayerProvider>
      </PaginationProvider>
      </LanguageProvider>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "black",
  },
});

export default App;
