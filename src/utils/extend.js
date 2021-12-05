export default function(custom, defaults) {
  let key, value
  for (key in defaults) {
    value = defaults[key]
    if (value) {
      custom[key] = value
    }
  }
  return custom
}
