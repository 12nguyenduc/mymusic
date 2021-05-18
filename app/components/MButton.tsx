import React from 'react'
import { TouchableOpacity } from 'react-native'

export default class MButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        {...this.props}
        activeOpacity={0.9}
        onPress={() => {
          if (this.disable !== true && this.props.onPress !== undefined) {
            this.disable = true
            this.props.onPress()
            setTimeout(() => {
              this.disable = false
            }, 100)
          }
        }}
      />
    )
  }
}
