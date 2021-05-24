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
import { ICBack } from "../../../assets/icons"
import { MText } from "../../components/MText"
import MButton from "../../components/MButton"
import { myLog } from "../../utils/log"
import WebView from "react-native-webview"
import { ScreenNames } from "../../navigation"

export const Webview: Component = observer(function Webview() {
  const navigation = useNavigation()
  const webViewRef = useRef(null)

  useEffect(() => {
  }, [])

  const goBack = () => {
    navigation.pop()
  }

  const selectCity = () => {
    navigation.push(ScreenNames.Cities, {
      callback: city => {
        myLog(city)
        webViewRef.current.injectJavaScript(`
                   (function() {  window.MyWebview.setDeparturePoint(
                   {
                    station: '${city.Name}',
                    province: '${city.Name}'
                   }
                   ); })();
                    true;
                `)
      }
    })
  }

  return (
    <View style={[commonStyles.fill, { }]}>
      <SafeAreaView style={commonStyles.fill}>
        <View style={[commonStyles.alignCenter, commonStyles.row]}>
          <MButton
            onPress={goBack}
            style={commonStyles.button}>
            <Image source={ICBack} style={{ width: 18, height: 18, resizeMode: 'contain' }}/>
          </MButton>
          <MText style={[commonStyles.fill, { paddingRight: 50, textAlign: 'center' }]}>WebView Inject</MText>
          <MButton
            onPress={() => {
              webViewRef.current.injectJavaScript(`
                   (function() {  window.MyWebview.setDeparturePoint({
                    station: 'Sài Gòn',
                    province: 'Hồ Chí Minh'
                   }); })();
                    true;
                `)
            }}
            style={commonStyles.button}>
            <MText>Inject</MText>
          </MButton>
        </View>

        <View style={commonStyles.fill}>
          <WebView
            ref={webViewRef}
            source={{ uri: __DEV__ ? "http://localhost:3000?token=089858237497" : 'https://nuxtjsbooking.vercel.app/?token=089858237497' }}
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
            onMessage={(event) => {
              try {
                myLog(JSON.parse(event.nativeEvent.data))
                const eventParse = JSON.parse(event.nativeEvent.data)
                if (eventParse.type === 'departurePoint') {
                  selectCity()
                }
              } catch (e) {
                myLog(e)
              }
            }}
          />

        </View>
      </SafeAreaView>
    </View>
  )
})
