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
    // console.log('audioStore initialized')
    TrackPlayer.getState().then((status) => {
      console.log('Initial audio Player State:', status)
      // this.state = status
    })

    TrackPlayer.addEventListener('playback-state', (data) => {
      console.log('playback-state:', data.state)
      // this.state = data.state
      if (data.state === TrackPlayer.STATE_PLAYING) {
        TrackPlayer.getRate().then((data) => {
          // if (data !== this.audioPlayRate) {
          //   this.setAudioPlayerRate(this.audioPlayRate, (Platform.OS === 'ios' ? 0 : 0))
          // }
        }, (error) => {
          myLog(error)
        })
      }
    })

    TrackPlayer.addEventListener('playback-track-changed', (trackData) => {
      const { nextTrack } = trackData
      myLog(trackData)
      // if (this.tracks) {
      //   const queueIndex = findIndex(this.tracks, { id: nextTrack })
      //   this.setCurrentTrack(this.tracks[queueIndex], queueIndex)
      //   this.setTracksIndexDetails(this.tracks, queueIndex)
      // } else {
      //   TrackPlayer.getQueue().then((data) => {
      //     const queueIndex = findIndex(data, { id: nextTrack })
      //     this.setCurrentTrack(data[queueIndex], queueIndex)
      //     this.setTracksIndexDetails(data, queueIndex)
      //   }, (error) => {
      //
      //   })
      // }
      // this.setAudioPlayerRate(this.audioPlayRate, (Platform.OS === 'ios' ? 2000 : 0))
    })

    TrackPlayer.addEventListener('playback-queue-ended', (data) => {
      console.log('playback-queue-ended =================', data)
      if (Platform.OS === 'ios') {
        // if (this.currentTrack !== null && this.state === TrackPlayer.STATE_PAUSED) {
        // TrackPlayer.seekTo(0)
        // }
        // this.stopAudio()
      } else {
        if (data.position !== 0 && data.track !== null) {
          // this.stopAudio()
        }
      }
    })
  }

  useEffect(() => {
    setup()
    requestPermission()
    listMusicStore.getAllMusic()
  }, [])

  const playMusic = async (item) => {
    console.log('play', item.albumName)
    console.log('play', 'file://' + item.url)
    try {
      // Add a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: item.url,
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
            onRefresh={() => listMusicStore.getAllMusic()}
            refreshing={listMusicStore.isLoading}
            data={listMusicStore.musics}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => '#' + index}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
