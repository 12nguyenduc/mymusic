import { observable, action } from 'mobx'
import { myLog } from "../../utils/log"
import { LIST_MUSIC, load } from "../../utils/storage"
import MusicFiles from 'react-native-get-music-files'

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
      this.isLoading = true
      this.musics = []
      const localMusic = await load(LIST_MUSIC)
      myLog(localMusic)
      if (localMusic !== null) {
        this.musics = localMusic
      }
      MusicFiles.getAll({
        id: true,
        blured: true,
        artist: true,
        duration: true, // default : true
        cover: true, // default : true,
        title: true,
        batchNumber: 5, // get 5 songs per batch
        minimumSongDuration: 10000, // in miliseconds,
        fields: ['title', 'artwork', 'duration', 'artist', 'genre', 'lyrics', 'albumTitle', 'assetUrl']
      }).then(tracks => {
        // do your stuff...
        myLog(tracks)
        this.musics = [...this.musics, ...tracks.map(track => ({
          albumName: track.albumTitle,
          artist: track.artist,
          title: track.title,
          url: track.assetUrl,
        }))]
      }).catch(error => {
        // catch the error
        myLog(error)
      })
      this.isLoading = false
    }
}

const listMusicStore = new ListMusicStore()

export default listMusicStore
