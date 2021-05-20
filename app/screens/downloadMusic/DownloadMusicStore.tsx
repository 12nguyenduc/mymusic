import { observable, action } from 'mobx'

class DownloadMusicStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable musics = [];

    @observable currentPage = 0;

    @action
    async downloadMusic() {
    }

    @action
    async downloaded(music) {
      this.musics.push(music)
      this.musics = [...this.musics]
    }
}

const downloadMusicStore = new DownloadMusicStore()

export default downloadMusicStore
