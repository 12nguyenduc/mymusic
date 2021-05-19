import { observable, action } from 'mobx'
import { myLog } from "../../utils/log"
import { MusicFiles } from 'react-native-get-music-files'
import { DeviceEventEmitter, NativeModules, Platform } from "react-native"
const { RNAndroidStore, RNReactNativeGetMusicFiles } = NativeModules

class DownloadMusicStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable musics = [];

    @observable currentPage = 0;

    @action
    async downloadMusic() {
    }
}

const downloadMusicStore = new DownloadMusicStore()

export default downloadMusicStore
