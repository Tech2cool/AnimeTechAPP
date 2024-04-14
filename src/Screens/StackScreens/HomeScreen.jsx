import { ToastAndroid, View } from 'react-native';
import React, { useEffect } from 'react';
import BottomTabNavigation from '../../Navigation/BottomTabNavigation';
import {ThemeColors} from '../../Utils';
import { checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

const color= ThemeColors.DARK
export default function HomeScreen() {
  const requestStoragePermissions = async () => {
    try {
      const results = await checkMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]);
  
      if (
        results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
        results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
      ) {
        // Both permissions already granted, you can read and write to external storage
      } else {
        const permissionsToRequest = [];
  
        if (results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
  
        if (results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
          permissionsToRequest.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        }
  
        const permissionResults = await requestMultiple(permissionsToRequest);
  
        if (
          permissionResults[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED &&
          permissionResults[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED
        ) {
            ToastAndroid.show("Storage Permission is required to for offline Videos", ToastAndroid.LONG)
            return
        }
      }
    } catch (error) {
      console.error('Error requesting storage permissions:', error);
    }
  };
  
  
  useEffect(()=>{
    requestStoragePermissions();
  },[])
  return (
    <View style={{flex: 1, backgroundColor:color.DarkBackGround}}>
      {/* <Text>homeStack</Text> */}
      <BottomTabNavigation/>
    </View>
  );
}
