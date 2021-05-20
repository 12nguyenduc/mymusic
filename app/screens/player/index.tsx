import React, { useState } from "react"
import PropTypes from "prop-types"
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player"
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native"

function ProgressBar() {
  const progress = useTrackPlayerProgress()

  return (
    <View style={styles.progress}>
      <View style={{ flex: progress.position, backgroundColor: "red" }} />
      <View
        style={{
          flex: progress.duration - progress.position,
          backgroundColor: "grey"
        }}
      />
    </View>
  )
}

function ControlButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
      <Text style={styles.controlButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

ControlButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}

export default function Player(props) {
  const playbackState = usePlaybackState()
  const [trackTitle, setTrackTitle] = useState("")
  const [trackArtwork, setTrackArtwork] = useState()
  const [trackArtist, setTrackArtist] = useState("")
  useTrackPlayerEvents(["playback-track-changed"], async event => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack)
      const { title, artist, artwork } = track || {}
      setTrackTitle(title)
      setTrackArtist(artist)
      setTrackArtwork(artwork)
    }
  })

  const { style, onNext, onPrevious, onTogglePlayback } = props

  let middleButtonText = "Play"

  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    middleButtonText = "Pause"
  }

  return (
    <View style={[styles.card, style]}>
      <Image style={styles.cover} source={{ uri: trackArtwork }} />
      <ProgressBar />
      <Text style={styles.title}>{trackTitle}</Text>
      <Text style={styles.artist}>{trackArtist}</Text>
      <View style={styles.controls}>
        <ControlButton title={"<<"} onPress={onPrevious} />
        <ControlButton title={middleButtonText} onPress={onTogglePlayback} />
        <ControlButton title={">>"} onPress={onNext} />
      </View>
    </View>
  )
}

Player.propTypes = {
  style: ViewPropTypes.style,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onTogglePlayback: PropTypes.func.isRequired
}

Player.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  artist: {
    fontWeight: "bold"
  },
  card: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: "80%"
  },
  controlButtonContainer: {
    flex: 1
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: "center"
  },
  controls: {
    flexDirection: "row",
    marginVertical: 20
  },
  cover: {
    backgroundColor: "grey",
    height: 140,
    marginTop: 20,
    width: 140
  },
  progress: {
    flexDirection: "row",
    height: 1,
    marginTop: 10,
    width: "90%"
  },
  title: {
    marginTop: 10
  }
})
