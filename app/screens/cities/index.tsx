import React, { useEffect } from "react"
import { View, SafeAreaView, Image, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { commonStyles } from "../CommonStyles"
import MButton from "../../components/MButton"
import { ICBack } from "../../../assets/icons"
import { MText } from "../../components/MText"
import citiesStore from "./CitiesStore"
import { toJS } from "mobx"

export const Cities = observer(function Cities(props) {
  const navigation = useNavigation()

  useEffect(() => {
    citiesStore.GetCities()
  }, [])

  const goBack = () => {
    navigation.pop()
  }

  const selectItem = (item) => {
    props.route.params.callback(item)
    navigation.pop()
  }

  const renderItem = (item, index) => {
    return (
      <MButton
        onPress={() => { selectItem(toJS(item)) }}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <MText>{item.Name}</MText>
      </MButton>
    )
  }

  return (
    <View style={commonStyles.fill}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <MButton
            onPress={goBack}
            style={commonStyles.button}>
            <Image source={ICBack} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
          </MButton>
          <MText style={[commonStyles.fill, { paddingRight: 50, textAlign: 'center' }]}>Cities</MText>
        </View>
        <FlatList
          data={citiesStore.data}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => '#' + index}/>
      </SafeAreaView>
    </View>
  )
})
