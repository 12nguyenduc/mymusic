import { observable, action } from 'mobx'
import { Api } from "../../services/api"
import { myLog } from "../../utils/log"
import MusicFiles from 'react-native-get-music-files'
import { Platform } from "react-native"

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
      if (Platform.OS === 'android') {

      } else {
        MusicFiles.getAll({
          blured: true, // works only when 'cover' is set to true
          artist: true,
          duration: true, // default : true
          cover: false, // default : true,
          genre: true,
          title: true,
          cover: true,
          minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
          fields: ['title', 'albumTitle', 'genre', 'lyrics', 'artwork', 'duration'] // for iOs Version
        }).then(tracks => {
          // do your stuff...
          myLog(tracks)
        }).catch(error => {
          myLog(error)
        })
      }
    }
}

const listMusicStore = new ListMusicStore()

export default listMusicStore
