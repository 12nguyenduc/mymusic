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
import { requestMultiple, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"

export const DownloadMusic: Component = observer(function DownloadMusic() {
  const navigation = useNavigation()

  const requestPermission = async () => {
    request(Platform.OS === "android" ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.MEDIA_LIBRARY).then(result => {
      myLog(result)
      switch (result) {
        case RESULTS.GRANTED:
          listMusicStore.getAllMusic()
          break
      }
    }
    )
  }

  useEffect(() => {
    requestPermission()
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
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <MText style={{ textAlign: 'center' }}>My Music</MText>
        <MButton
          style={{ padding: 16, backgroundColor: 'green' }}
          onPress={requestPermission}
        >
          <MText>Request Permission
          </MText>
        </MButton>
        <View style={commonStyles.fill}>
          <FlatList
            data={listMusicStore.musics}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => '#' + index}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
