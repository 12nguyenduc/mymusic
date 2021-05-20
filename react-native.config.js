module.exports = {
  assets: ["./assets/fonts/"],
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
  },
}
