import { observable, action } from 'mobx'
import { myLog } from "../../utils/log"
import { MusicFiles } from 'react-native-get-music-files'
import { DeviceEventEmitter, NativeModules, Platform } from "react-native"
const { RNAndroidStore, RNReactNativeGetMusicFiles } = NativeModules

class ListMusicStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable musics = [];

    @observable currentPage = 0;

    @action
    async requestPermissions() {

    }

    @action
    async getAllMusic() {
      RNReactNativeGetMusicFiles.getAll({
        blured: true, // works only when 'cover' is set to true
        artist: true,
        duration: true, // default : true
        cover: false, // default : true,
        genre: true,
        title: true,
        // minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
        fields: ['title', 'albumTitle', 'genre', 'lyrics', 'artwork', 'duration'] // for iOs Version
      }, (tracks) => {
        if (tracks.length > 0) {
          myLog(tracks)
        } else {
          myLog("Error, you don't have any tracks")
        }
      })
    }
}

const listMusicStore = new ListMusicStore()

export default listMusicStore
