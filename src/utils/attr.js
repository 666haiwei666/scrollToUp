export default {
  get: (element, attributeName) => {
    return element.getAttribute(attributeName)
  },
  set: (element, name, value) => {
    element.setAttribute(name, value)
  },
  remove: (element, attrName) => {
    element.removeAttribute(attrName)
  }
}
