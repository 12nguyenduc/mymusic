import { observable, action } from 'mobx'
import { myLog } from "../../utils/log"
import { LIST_MUSIC, load } from "../../utils/storage"

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
      const localMusic = await load(LIST_MUSIC)
        myLog(localMusic)
      if (localMusic !== null) {
        this.musics = localMusic
      }
    }
}

const listMusicStore = new ListMusicStore()

export default listMusicStore
