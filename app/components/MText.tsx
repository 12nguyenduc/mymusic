import React from 'react'
import { View, Text, TextInput } from "react-native"

export const MText = (props) => {
  return (
    <Text {...props} style={[{ fontFamily: 'Nunito', color: '#211F1F', fontSize: 14 }, props.style]}/>
  )
}

export const MTextInput = React.forwardRef((props, ref) => (
  <TextInput ref={ref} {...props} style={[{ fontFamily: 'Nunito', color: '#211F1F', fontSize: 14 }, props.style]}/>
))
