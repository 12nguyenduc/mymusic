import React, { FunctionComponent as Component, useEffect, useState } from "react"
import {
  View,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
  ScrollView, FlatList,
} from "react-native"
import { useNavigation, CommonActions, } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { commonStyles } from "../CommonStyles"
import listMusicStore from "./ListMusicStore"
import FastImage from 'react-native-fast-image'
import { ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"

export const ListMusic: Component = observer(function Splash() {
  const navigation = useNavigation()

  const nextScreen = async () => {
  }

  useEffect(() => {
    listMusicStore.getAllMusic()
  }, [])

  const renderItem = (item, index) => {
    return (
      <View>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <FastImage source={item.thumbnail ? { uri: item.thumbnail } : ICHeadPhone}/>
        </View>
      </View>
    )
  }

  return (
    <View style={[commonStyles.fill, { backgroundColor: 'red' }]}>
      <SafeAreaView style={commonStyles.fill}>
        <MText>My Music</MText>
        <View style={commonStyles.fill}>
          {/*<FlatList*/}
          {/*  data={listMusicStore.musics}*/}
          {/*  renderItem={({ item, index }) => renderItem(item, index)}*/}
          {/*  keyExtractor={(item, index) => '#' + index}*/}
          {/*/>*/}
        </View>
      </SafeAreaView>
    </View>
  )
})
