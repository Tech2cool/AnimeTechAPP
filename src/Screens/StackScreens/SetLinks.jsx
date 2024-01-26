import { View, Text, Share, Linking, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SetLinks = () => {
    const [myLink, setMyLink]= useState("")
    async function buildLink() {
        const link = await dynamicLinks().buildLink({
          link: 'https://animetechapp.page.link/testing',
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: 'https://animetechapp.page.link',
          // optional setup which updates Firebase analytics campaign
          // "banner". This also needs setting up before hand
          android:{
            packageName:"com.animetech"
          },
        //   analytics: {
        //     campaign: 'banner',
        //   },
        }, dynamicLinks.ShortLinkType.DEFAULT);
        // console.log(link)
        setMyLink(link)
        return link;
      }
    async function shareMYLink(){
        try {
            const getLink = await buildLink()
            Share.share({
                message:getLink,
            })
        } catch (error) {
            // console.log(error)
            ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
        }
    }
  const episode={
    id:'ishura-episode-4',
    number:'4',
  }
  const animeId= "ishura";
  const deepLink = `animeTech://video/${animeId}/${encodeURIComponent(JSON.stringify(episode))}`;
  const generateDeepLink = () => {
    // Replace 123 with the actual animeId value
    const animeId = "ishura";

    // Replace { id: 1, number: 250 } with your actual object
    const oneEpisode = { id:'ishura-episode-4', number:'4', };

    const serializedObject = encodeURIComponent(JSON.stringify(oneEpisode));

    const deepLink = `animeTech://video/${animeId}/${serializedObject}`;

    // Open the deep link
    Linking.openURL(deepLink).catch((error) => {
      console.error('Error opening deep link:', error);
      // Handle the error as needed
    });
    };
    const generateDeepLink2 = async () => {
      try {
        await Linking.openURL(`animeTech://testing/125`);
      } catch (error) {
        console.error('Error opening deep link:', error);
      }
    };
    
  return (
    <View style={{justifyContent:"center",}}>
      <Text style={{color:"black"}}>{myLink}</Text>
      <Text style={{color:"black"}}>{myLink}</Text>
      <TouchableOpacity onPress={generateDeepLink} style={{backgroundColor:"gray", padding:20}}>
        <Text style={{color:"black"}}>generate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={generateDeepLink2} style={{backgroundColor:"gray", padding:20}}>
        <Text style={{color:"black"}}>gogot 2</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SetLinks