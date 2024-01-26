import { View, Text } from 'react-native'
import React from 'react'

const Testing = ({route}) => {
  const {id}= route.params
  return (
    <View>
      <Text style={{color:"red", fontSize:50}}>Testing</Text>
      <Text style={{color:"red", fontSize:50}}>id:{id}</Text>
    </View>
  )
}

export default Testing