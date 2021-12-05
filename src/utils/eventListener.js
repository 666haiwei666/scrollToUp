export default function(targetDomElement, eventName, callback, options) {
  if (targetDomElement.addEventListener) {
    targetDomElement.addEventListener(eventName, callback, options)
    return {
      remove() {
        targetDomElement.removeEventListener(eventName, callback, options)
      }
    }
  } else if (targetDomElement.attachEvent) {
    targetDomElement.attachEvent('on' + eventName, callback)
    return {
      remove() {
        targetDomElement.detachEvent('on' + eventName, callback)
      }
    }
  }
}
