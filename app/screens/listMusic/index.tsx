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
  ScrollView,
} from "react-native"
import { useNavigation, CommonActions, } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import {clear, FIRST_KEY, load, save, USER} from "../../utils/storage"
import CodePush from "react-native-code-push"
import DeviceInfo from 'react-native-device-info'
import { ScreenNames } from "../../navigation"
import { myLog } from "../../utils/log"
import splashStore from "./SplashStore"
import loginStore from "../login/LoginStore"
import Logo from '../../assets/logo.svg'
import BGLogin from '../../assets/img_splash.svg'
import Constants from "../../constants"
import { commonStyles } from "../CommonStyles"
import { MText } from "../../components"
import { Api } from "../../services/api"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}

export const Splash: Component = observer(function Splash() {
  const navigation = useNavigation()
  // const [codePush, setCodePush] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const gotoScreen = (screen) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: screen },
        ],
      })
    )
  }

  const nextScreen = async () => {
    // if(__DEV__){
    //   gotoScreen(ScreenNames.Main);
    //   return;
    // }

    const isFirst  =  await load(FIRST_KEY)
    if(!isFirst){
      gotoScreen(ScreenNames.Intro)
      return;
    }

    const user = await load(USER)
    myLog('user', user)
    if (user) {
      splashStore.checkToken(user.Id, user.Token, (token) => {
        user.Token = token
        Api.getInstance().setToken(token)
        loginStore.data = user
        save(USER, user)
        gotoScreen(ScreenNames.Main)
      }, () => {
        clear()
        gotoScreen(ScreenNames.Main)
      })
    } else {
      gotoScreen(ScreenNames.Main)
    }
  }

  const onSyncStatusChange = (syncStatus) => {
    console.log(syncStatus)
    // this.setState({ stateCodePush: SyncStatus })
    switch (syncStatus) {
      case CodePush.SyncStatus.UP_TO_DATE:
      case CodePush.SyncStatus.UNKNOWN_ERROR:
      case CodePush.SyncStatus.UPDATE_IGNORED:
        if (Platform.OS === 'android') {
          if (DeviceInfo.getVersion() !== '1.0.1') {
            Alert.alert(
              'Thông báo',
              'Hiện tại đã có bản cập nhật mới. Vui lòng cập nhật ứng dụng!',
              [
                {
                  text: 'Đồng ý',
                  onPress: () => {
                    Linking.openURL('market://details?id=tima.ai.vaynhanh')
                  },
                },
              ],
            )
          } else {
            nextScreen()
          }
        } else {
          if (DeviceInfo.getVersion() !== '1.0.1') {
            Alert.alert(
              'Thông báo',
              'Hiện tại đã có bản cập nhật mới. Vui lòng cập nhật ứng dụng!',
              [
                {
                  text: 'Đồng ý',
                  onPress: () => {
                    Linking.openURL(
                      'itms-apps://itunes.apple.com/us/app/1497299208?mt=8',
                    )
                  },
                },
              ],
            )
          } else {
            nextScreen()
          }
        }
        break
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        if (!downloading) {
          setDownloading(true)
        }
        break
    }
  }

  const onError = (error) => {
    console.log('An error occurred. ' + error)
  }

  const onDownloadProgress = (downloadProgress) => {
    if (downloadProgress) {
      if (__DEV__) {
        console.log(
          'Downloading ' +
            downloadProgress.receivedBytes +
            ' of ' +
            downloadProgress.totalBytes,
        )
      }
      const p = Math.round(
        (downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100,
      )
      if (p !== progress) {
        setProgress(p)
      }
    }
  }

  const loadCodePush = () => {
    CodePush.sync(
      {
        updateDialog: null,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      onSyncStatusChange,
      onDownloadProgress,
      onError,
    )
  }

  useEffect(() => {
    // loadCodePush()
    nextScreen()
  }, [])

  return (
    <View testID="Login" style={[commonStyles.fill, { backgroundColor: '#fff' }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[FULL, CONTAINER]}>
          {/* <Logo width={Constants.widthDevice * 0.5} height={Constants.widthDevice * 0.5 * 46 / 197}/> */}
          <Image
            source={require('../../assets/logo.png')}
            style={{
              // marginTop: 40 / 667 * Constants.heightDevice,
              width: Constants.widthDevice * 0.5,
              height: Constants.widthDevice * 0.5 * 589 / 1025,
              resizeMode: 'contain'
            }}/>

          <BGLogin width={Constants.widthDevice * 0.85} height={Constants.widthDevice * 0.85 * 163 / 319} style={{ marginTop: 23 / Constants.widthDevice * Constants.widthDevice }}/>
        </View>
        {
          downloading &&
          <MText style={{ paddingVertical: 16, textAlign: 'center' }}>{`Đang tải bản cập nhật ${progress}%`}</MText>
        }
      </SafeAreaView>
    </View>
  )
})
