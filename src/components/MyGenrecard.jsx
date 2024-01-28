import { View, Text } from 'react-native'
import React, { memo } from 'react'
import ThemeColors from '../Utils/ThemeColors';
const color = ThemeColors.DARK;
const clr_code = [color.AccentBlue, color.Orange, color.AccentGreen, color.Cyan, color.Red]

const MyGenrecard = memo(({Title}) => {
  return (
    <View style={{
        borderColor:clr_code[Math.floor(Math.random() * 5)], 
        borderWidth:1, 
        flex:0, 
        alignSelf: 'flex-start', 
        padding:5,
        borderRadius:10,
        margin:1,
        }}>
        <Text style={{color:color.White}}>{Title}</Text>
      </View>
    )
})

export default MyGenrecard