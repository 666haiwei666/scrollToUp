const prefixs = ['moz', 'webkit', 'o', 'ms']
export default function(property) {
  return prefixs.some(prefix => {
    const prop = property.replace(/^./, str => {
      return str.toUpperCase()
    })
    const cssProperty = prefix + prop
    return property in document.documentElement.style || cssProperty in document.documentElement.style
  })
}
