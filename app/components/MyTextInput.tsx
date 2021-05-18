import React, { useState } from "react"
import { View } from "react-native"
import { color } from "../theme"
import { MText, MTextInput } from "./index"

export const MyTextInput = React.forwardRef((props, ref) => {
  const [isFocus, setIsFocus] = useState(false)
  const error = props.error
  return (
    <View>
      <View style={{ backgroundColor: error ? '#FFF6F6' : '#F8F8F8', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: error ? '#DC2626' : isFocus ? color.primary : 'transparent' }}>
        <MTextInput
          ref={ref}
          {...props}
          onFocus={() => {
            setIsFocus(true)
            if (props.onFocus) props.onFocus()
          }}
          onBlur={() => {
            setIsFocus(false)
            if (props.onBlur) props.onBlur()
          }}/>
      </View>
      {
        error &&
    <MText style={{ color: '#A60303', paddingTop: 7, fontSize: 12 }}>{error}</MText>
      }
    </View>
  )
})
