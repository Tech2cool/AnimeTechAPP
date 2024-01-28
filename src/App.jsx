import React from 'react';
import { SafeAreaView, StyleSheet, View} from 'react-native';
import { VideoPlayerProvider } from './Context/VideoPlayerContext';
import { LanguageProvider } from './Context/LanguageContext';
import AppNavigator from './Navigation/AppNavigator';
import { ThemeColors } from './Utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const color = ThemeColors.DARK
function App() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <LanguageProvider>
          <VideoPlayerProvider>
            <AppNavigator />
          </VideoPlayerProvider>
        </LanguageProvider>
      </SafeAreaView>
    </View>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DarkBackGround,
  },
});

export default App;
