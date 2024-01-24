import { View, Text, Share } from 'react-native'
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
        console.log(link)
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
            console.log(error)
        }
    }
  return (
    <View>
      <Text style={{color:"black"}}>{myLink}</Text>
      <TouchableOpacity onPress={()=> shareMYLink()} style={{backgroundColor:"gray", padding:20}}>
        <Text style={{color:"black"}}>generate</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SetLinks