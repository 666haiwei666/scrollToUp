export default function(obj) {
  let str = ''
  Object.entries(obj).forEach(([key, val]) => {
    str += `${key}:${val};`
  })
  return str
}
