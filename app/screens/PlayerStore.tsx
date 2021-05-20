import { observable, action } from 'mobx'
import TrackPlayer from "react-native-track-player"
import { myLog } from "../utils/log"
import { Platform } from "react-native"

class PlayerStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable musics = [];

    @observable currentPage = 0;

    @action
    async downloadMusic() {
    }

    async setup() {
      // console.log('audioStore initialized')
      TrackPlayer.getState().then((status) => {
        console.log('Initial audio Player State:', status)
        // this.state = status
      })

      TrackPlayer.addEventListener('playback-state', (data) => {
        console.log('playback-state:', data.state)
        // this.state = data.state
        if (data.state === TrackPlayer.STATE_PLAYING) {
          TrackPlayer.getRate().then((data) => {
            // if (data !== this.audioPlayRate) {
            //   this.setAudioPlayerRate(this.audioPlayRate, (Platform.OS === 'ios' ? 0 : 0))
            // }
          }, (error) => {
            myLog(error)
          })
        }
      })

      TrackPlayer.addEventListener('playback-track-changed', (trackData) => {
        const { nextTrack } = trackData
        myLog(trackData)
        // if (this.tracks) {
        //   const queueIndex = findIndex(this.tracks, { id: nextTrack })
        //   this.setCurrentTrack(this.tracks[queueIndex], queueIndex)
        //   this.setTracksIndexDetails(this.tracks, queueIndex)
        // } else {
        //   TrackPlayer.getQueue().then((data) => {
        //     const queueIndex = findIndex(data, { id: nextTrack })
        //     this.setCurrentTrack(data[queueIndex], queueIndex)
        //     this.setTracksIndexDetails(data, queueIndex)
        //   }, (error) => {
        //
        //   })
        // }
        // this.setAudioPlayerRate(this.audioPlayRate, (Platform.OS === 'ios' ? 2000 : 0))
      })

      TrackPlayer.addEventListener('playback-queue-ended', (data) => {
        console.log('playback-queue-ended =================', data)
        if (Platform.OS === 'ios') {
          // if (this.currentTrack !== null && this.state === TrackPlayer.STATE_PAUSED) {
          // TrackPlayer.seekTo(0)
          // }
          // this.stopAudio()
        } else {
          if (data.position !== 0 && data.track !== null) {
            // this.stopAudio()
          }
        }
      })
    }

    async playMusic(item) {
      console.log('play', item.albumName)
      console.log('play', encodeURI(item.url))
      try {
        // Add a track to the queue
        await TrackPlayer.add({
          id: 'trackId',
          url: encodeURI(item.url),
          title: item.albumName,
          artist: item.artist,
        })

        // Start playing it
        await TrackPlayer.play()
      } catch (e) {
        myLog(e)
      }
    }
}

const playerStore = new PlayerStore()

export default playerStore
