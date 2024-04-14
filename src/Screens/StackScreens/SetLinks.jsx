import { View, Text, Share, Linking, ToastAndroid, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
// import RNFetchBlob from 'rn-fetch-blob'; // Make sure to install this library
import RNFS from 'react-native-fs';

const SetLinks = () => {


  // const downloadM3U8 = async () => {
  //   const m3u8Url = 'https://www109.vipanicdn.net/streamhls/db88aed30c354cc2d8b750b82e743725/ep.51.1706906843.360.m3u8';
    
  //   try {
  //     const response = await RNFetchBlob.fetch('GET', m3u8Url);
  //     const m3u8Content = response.text();
      
  //     const tsFiles = m3u8Content.match(/\.ts/g);

  //     if (tsFiles) {
  //       for (let i = 0; i < tsFiles.length; i++) {
  //         const tsUrl = `https://www109.vipanicdn.net/streamhls/db88aed30c354cc2d8b750b82e743725/${tsFiles[i]}`;
  //         const tsFileName = `file_${i}.ts`;
  //         const path = `${RNFS.DownloadDirectoryPath}/${tsFileName}`;

  //         await RNFS.downloadFile({
  //           fromUrl: tsUrl,
  //           toFile: path,
  //           background: true, // Run in the background to avoid potential thread issues
  //         }).promise;

  //         // Now, 'path' contains the local path to the downloaded TS file.
  //         console.log(`Downloaded: ${path}`);
  //         ToastAndroid.show(`Downloaded: ${path}`,  ToastAndroid.SHORT)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error downloading M3U8:', error);
  //   }
  // };

  useEffect(() => {
    // Uncomment the following line to trigger the download when the component mounts.
    // downloadM3U8();
  }, []);

  return (
    <View>
      <Text>React Native M3U8 Downloader</Text>
      <Button title="Download M3U8" onPress={downloadM3U8} />
    </View>
  );
}

export default SetLinks