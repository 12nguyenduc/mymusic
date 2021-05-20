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
  ScrollView, FlatList, Animated,
  Share
} from "react-native"
import { useNavigation, CommonActions, } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { commonStyles } from "../CommonStyles"
import listMusicStore from "./ListMusicStore"
import FastImage from 'react-native-fast-image'
import { ICDownload, ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import TrackPlayer, { usePlaybackState } from "react-native-track-player"
import { ScreenNames } from "../../navigation"
import Player from "../player"

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
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ]
    })
  }

  async function skipToNext() {
    try {
      await TrackPlayer.skipToNext()
    } catch (_) {}
  }

  async function skipToPrevious() {
    try {
      await TrackPlayer.skipToPrevious()
    } catch (_) {}
  }

  useEffect(() => {
    setup()
    TrackPlayer.addEventListener('remote-pause', async () => {
      try {
        await TrackPlayer.pause()
      } catch (e) {

      }
    })
    TrackPlayer.addEventListener('remote-play', async () => {
      try {
        await TrackPlayer.play()
      } catch (e) {

      }
    })
    TrackPlayer.addEventListener('remote-seek', async (position) => {
      try {
        await TrackPlayer.seekTo(position.position)
      } catch (e) {

      }
    })
    TrackPlayer.addEventListener('remote-next', async () => {
      skipToNext()
    })
    TrackPlayer.addEventListener('remote-previous', async () => {
      skipToPrevious()
    })
    requestPermission()
    listMusicStore.getAllMusic()
  }, [])

  const playMusic = async (item) => {
    console.log('play', item.albumName)
    console.log('play', encodeURI(item.url))
    try {
      // Add a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: encodeURI(item.url),
        title: item.albumName,
        artist: item.artist,
      })

      // Start playing it
      await TrackPlayer.play()
    } catch (e) {
      myLog(e)
    }
  }

  const goDownload = () => {
    navigation.push(ScreenNames.DownloadMusic)
  }

  const goDownloadYoutube = () => {
    navigation.push(ScreenNames.DownloadYoutube)
  }

  const share = (item) => {
    const shareImage = {
      title: 'Scanner Image',
      message: 'Scanner Image',
      url: item.url,
    }
    Share.share(shareImage).catch(err => console.log(err))
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
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, flex: 1 }}>
            <MText style={{ color: 'black' }}>{item.title}</MText>
            <MText style={{ color: 'black', marginTop: 2, fontSize: 12 }}>{item.artist}</MText>
          </View>
          <MButton
            onPress={() => share(item)}
            style={{ width: 24, height: 24, resizeMode: 'contain' }}>
            <Image source={ICHeadPhone} style={{ width: 24, height: 24, resizeMode: 'contain' }}/>
          </MButton>
        </View>
      </MButton>
    )
  }

  const togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack()
    if (currentTrack == null) {
      await TrackPlayer.reset()
      await TrackPlayer.add(listMusicStore.musics.map(track => ({
        id: 'trackId',
        url: encodeURI(track.url),
        title: track.albumName,
        artist: track.artist,
      })))
      // await TrackPlayer.add({
      //   id: "local-track",
      //   url: localTrack,
      //   title: "Pure (Demo)",
      //   artist: "David Chavez",
      //   artwork: "https://i.picsum.photos/id/500/200/200.jpg",
      //   duration: 28
      // });
      await TrackPlayer.play()
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play()
      } else {
        await TrackPlayer.pause()
      }
    }
  }

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <MText style={[commonStyles.fill, { paddingLeft: 50, textAlign: 'center' }]}>My Music</MText>
          <MButton
            onPress={goDownloadYoutube}
            style={commonStyles.button}>
            <Image source={ICDownload} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
          </MButton>

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
            onRefresh={() => listMusicStore.getAllMusic()}
            refreshing={listMusicStore.isLoading}
            data={listMusicStore.musics}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => '#' + index}
          />
          <Player
            onNext={skipToNext}
            onPrevious={skipToPrevious}
            onTogglePlayback={togglePlayback}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
