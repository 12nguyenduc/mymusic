export const myLog = (key, value?: string) => {
  if (__DEV__) {
    if (value !== undefined) {
      console.log(key, value)
    } else { console.log(key) }
  }
}
