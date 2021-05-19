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
import { ICBack, ICDownload, ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"
import { requestMultiple, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import TrackPlayer, { usePlaybackState } from "react-native-track-player"
import { ScreenNames } from "../../navigation"

export const ListMusic: Component = observer(function ListMusic(props) {
  const navigation = useNavigation()
  const playbackState = usePlaybackState()

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

  async function setup() {
    await TrackPlayer.setupPlayer({})
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    })
  }

  useEffect(() => {
    setup()
    requestPermission()
    listMusicStore.getAllMusic()
  }, [])

  const playMusic = async (item) => {
    const state = await TrackPlayer.getState()
    if (state === TrackPlayer.STATE_PLAYING) {
      console.log('The player is playing')
    };

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: item.url,
      title: item.albumName,
      artist: item.artist,
    })

    // Start playing it
    await TrackPlayer.play()
  }

  const goDownload = () => {
    navigation.push(ScreenNames.DownloadMusic)
  }

  const renderItem = (item, index) => {
    return (
      <MButton
        onPress={() => playMusic(item)}
      >
        <View style={[commonStyles.alignCenter, commonStyles.row, { paddingHorizontal: 16 }]}>
          <View source={ICHeadPhone} style={[commonStyles.alignCenter, commonStyles.justifyCenter, { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ff910080' }]}>
            <FastImage source={ICHeadPhone} style={{ width: 24, height: 24, }}/>
          </View>
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <MText style={{ color: 'black' }}>{item.albumName}</MText>
            <MText style={{ color: 'black', marginTop: 2, fontSize: 12 }}>{item.artist}</MText>
          </View>
        </View>
      </MButton>
    )
  }

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <MText style={[commonStyles.fill, { paddingLeft: 50, textAlign: 'center' }]}>My Music</MText>
          <View>
            <MButton
              onPress={goDownload}
              style={commonStyles.button}>
              <Image source={ICDownload} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
            </MButton>
          </View>
        </View>
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
