import isMobile from '../utils/isMobile'
import attr from '../utils/attr'
import styleStr from '../utils/styleStr'

import '../index.css'

const pixelUnit = 'px'
const title = 'scroll to up'
const id = 'scroll-default-button'

function customElementButton(config, cssText, className) {
  class ScrollButton extends HTMLElement {
    constructor() {
      super()
      this.onInit()
    }

    onInit() {
      const { customScrollButton, scrollButtonText } = config || {}
      this.title = title
      this.id = id
      this.className = className
      this.innerHTML = customScrollButton || scrollButtonText
      this.style = cssText
    }
  }
  customElements.define('scroll-button', ScrollButton)

  const Component = customElements.get('scroll-button')
  const scrollButton = new Component()
  return scrollButton
}

function createDivElement(config, cssText, className) {
  const { customScrollButton, scrollButtonText } = config || {}
  const scrollButton = document.createElement('div')
  const attrs = {
    title,
    id,
    class: className
  }
  for (const key in attrs) {
    attr.set(scrollButton, key, attrs[key])
  }
  scrollButton.innerHTML = customScrollButton || scrollButtonText
  scrollButton.style = cssText
  return scrollButton
}

export default function(config) {
  const { scrollButtonBottom, scrollButtonRight, mobile } = config
  const style = {
    bottom: scrollButtonBottom + pixelUnit,
    right: scrollButtonRight + pixelUnit
  }
  const cssText = styleStr(style)
  const className = isMobile(navigator.userAgent) ? (mobile ? 'scrollDefaultButtonStyle' : 'mobile scrollDefaultButtonStyle') : 'scrollDefaultButtonStyle'
  if (customElements) {
    return customElementButton(config, cssText, className)
  } else {
    return createDivElement(config, cssText, className)
  }
}
