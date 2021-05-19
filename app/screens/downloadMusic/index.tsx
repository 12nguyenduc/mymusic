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
import { ICBack, ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"
import { requestMultiple, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import WebView from "react-native-webview"
import RNFetchBlob from 'rn-fetch-blob'
import { showMessage, hideMessage } from "react-native-flash-message"
import MediaMeta from 'react-native-media-meta'
import { LIST_MUSIC, load, save } from "../../utils/storage"
const RNFS = require('react-native-fs')

export const DownloadMusic: Component = observer(function DownloadMusic() {
  const navigation = useNavigation()
  const webViewRef = useRef(null)

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

  const handleUrlWithMusic = (input) => {
    // check if have another download
    if (
      // this.state.downloadStart == true ||
      input.url.toLowerCase().includes('.mp3') == false) {
      return
    } else {
      // this.setState({ downloadStart: true, showModalLoading: true })
      myLog('downloadStart')
    }

    const directoryFile = RNFS.CachesDirectoryPath

    // Creating folder
    if (RNFS.exists(directoryFile)) {
      RNFS.unlink(directoryFile)
        .then(() => {
          console.log('FOLDER/FILE DELETED')
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          console.log('CANT DELETE', err.message)
          // this.setState({ showError: true })
        })

      RNFS.mkdir(directoryFile)
    }

    // If folder is created
    if (input) {
      // Verifing if the url have a .zip file
      if (input.url.toLowerCase().includes('.mp3')) {
        const urlDownload = input.url

        let fileName
        try {
          fileName = urlDownload.substr(urlDownload.lastIndexOf('/')).replace('.mp3', '') + '.mp3'
        } catch (e) {
          console.log(e)
          fileName = 'example.mp3'
        }

        console.log('URL = ' + urlDownload)

        // Downloading the file on a folder
        const dirs = directoryFile + '/' + fileName
        RNFetchBlob
          .config({
            // response data will be saved to this path if it has access right.
            path: dirs
          })
          .fetch('GET', urlDownload, {
            // some headers ..
          })
          .progress((received, total) => {
            console.log('progress', received / total)
          })
          .then((res) => {
            MediaMeta.get(res.path())
              .then(async metadata => {
                myLog(metadata)
                let listMusic = []
                try {
                  const localMusic = await load(LIST_MUSIC)
                  if (localMusic !== null) {
                    listMusic = localMusic
                  }
                  myLog('listMusic', listMusic)
                } catch (e) {
                  myLog(e)
                }
                listMusic.push({ ...metadata, ...{ url: res.path(), thumb: undefined } })
                listMusicStore.musics.push({ ...metadata, ...{ url: res.path(), thumb: undefined } })
                save(LIST_MUSIC, listMusic)
              })
              .catch(err => console.error(err))
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log('The file saved to ', res.path())
            showMessage({
              message: "Download Success",
              // description: "This is our second message",
              type: "success",
            })
            // Acabou o download do arquivo
            // this.setState({
            //   downloadStart: false,
            //   showModalLoading: false,
            //   showFileExplorer: true,
            //   startFolder: directoryFile
            // })
            myLog('directoryFile', directoryFile)
          })
      }
    }
  }

  const goback = () => {
    if(webViewRef.current.canGoBack){
      webViewRef.current.goBack()
    }else{
      navigation.pop()
    }
  }

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <View>
            <MButton
              onPress={goback}
              style={commonStyles.button}>
              <Image source={ICBack} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
            </MButton>
            <MText style={[commonStyles.fill, { paddingRight: 50, textAlign: 'center' }]}>My Music</MText>
          </View>
        </View>

        <View style={commonStyles.fill}>
          <WebView
            ref={webViewRef}
            source={{ uri: "https://chiasenhac.vn/" }}
            style={{}}
            injectedJavaScript={`document.getElementsByTagName("video")[0].removeAttribute("autoplay");document.getElementsByTagName("video")[1].removeAttribute("autoplay");`}
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
            onNavigationStateChange={(result) => handleUrlWithMusic(result)}
            onShouldStartLoadWithRequest={(request) => {
              // Only allow navigating within this website
              return request.url.includes('chiasenhac')
            }}
          />

        </View>
      </SafeAreaView>
    </View>
  )
})
