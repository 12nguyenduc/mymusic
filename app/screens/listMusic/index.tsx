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
import listMusicStore from "./DownloadMusicStore"
import FastImage from 'react-native-fast-image'
import { ICHeadPhone } from "../../../assets/icons"
import { MText } from "../../components/MText"
import { requestMultiple, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import WebView from "react-native-webview"
import RNFetchBlob from 'rn-fetch-blob'
const RNFS = require('react-native-fs')

export const ListMusic: Component = observer(function ListMusic() {
  const navigation = useNavigation()

  const requestPermission = async () => {
    request(Platform.OS === "android" ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
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
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log('The file saved to ', res.path())

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

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <MText style={{ textAlign: 'center' }}>My Music</MText>
        <View style={commonStyles.fill}>
          <WebView
            source={{ uri: "https://chiasenhac.vn/" }}
            style={{}}
            startInLoadingState={true}
            allowUniversalAccessFromFileURLs={true}
            javaScriptEnabled={true}
            mixedContentMode={'always'}
            onNavigationStateChange={(result) => handleUrlWithMusic(result)}
          />

        </View>
      </SafeAreaView>
    </View>
  )
})
