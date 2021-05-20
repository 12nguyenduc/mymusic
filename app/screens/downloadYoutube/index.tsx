import React, { FunctionComponent as Component, useEffect, useRef, useState } from "react"
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
  ScrollView, FlatList, ActivityIndicator,
} from "react-native"
import { useNavigation, CommonActions, } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { commonStyles } from "../CommonStyles"
import listMusicStore from "./DownloadMusicStore"
import FastImage from 'react-native-fast-image'
import { ICBack, ICDownload, ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"
import { requestMultiple, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import WebView from "react-native-webview"
import RNFetchBlob from 'rn-fetch-blob'
import { showMessage, hideMessage } from "react-native-flash-message"
import MediaMeta from 'react-native-media-meta'
import { LIST_MUSIC, load, save } from "../../utils/storage"
import ytdl from "react-native-ytdl"
const RNFS = require('react-native-fs')

export const DownloadYoutube: Component = observer(function DownloadYoutube() {
  const navigation = useNavigation()
  const webViewRef = useRef(null)
  const [currentPage, setCurrentPage] = useState('')

  const requestPermission = async () => {
    request(Platform.OS === "android" ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.MEDIA_LIBRARY).then(result => {
      myLog(result)
      switch (result) {
        case RESULTS.GRANTED:

          break
      }
    }
    )
  }

  useEffect(() => {
    requestPermission()
  }, [])

  const goback = () => {
    if (webViewRef.current.canGoBack) {
      webViewRef.current.goBack()
    } else {
      navigation.pop()
    }
  }

  const download = async () => {
    const urls = await ytdl('https://www.youtube.com/watch?v=kUOtzXiyXcc', { quality: 'highestaudio' })
    myLog(urls)
  }

  const onNavigationStateChange = (webViewState) => {
    myLog(webViewState.url)
    setCurrentPage(webViewState.url)
  }

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <MButton
            onPress={goback}
            style={commonStyles.button}>
            <Image source={ICBack} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
          </MButton>
          <MText style={[commonStyles.fill, { paddingRight: 50, textAlign: 'center' }]}>My Music</MText>
          <MButton
            onPress={download}
            style={commonStyles.button}>
            <Image source={ICDownload} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
          </MButton>
        </View>

        <View style={commonStyles.fill}>
          <WebView
            ref={webViewRef}
            source={{ uri: "https://m.youtube.com" }}
            style={{}}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
              </View>
            )}
            allowsBackForwardNavigationGestures
            allowUniversalAccessFromFileURLs={true}
            javaScriptEnabled={true}
            mixedContentMode={'always'}
            onNavigationStateChange={onNavigationStateChange}
          />

        </View>
      </SafeAreaView>
    </View>
  )
})
