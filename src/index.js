import events from 'events'
import { throttle } from 'throttle-debounce'
import extend from './utils/extend'
import attr from './utils/attr'
import eventListener from './utils/eventListener'
import isBroswer from './utils/isBroswer'
import isSupportCSS from './utils/isSupportCSS'
import isNode from './utils/isNode'
import styleStr from './utils/styleStr'
import easingfunc from './utils/easingfunc'

import './index.css'

const unit = 'ms'
const field = 'scrollToUp'

let context = null
let elementNode = null

class scrollToUp extends events {
  defaultOptions = {
    scrollTarget: null,
    scrollContainer: null,
    scrollButtonName: '.scrollUp',
    scrollButtonDistance: 100,
    scrollButtonBottom: 20,
    // scrollDirection: 'top', // left, right, top, bottom
    scrollContent: 'Scroll to top',
    easingType: 'linear',
    keyframesIn: 'fadeIn',
    keyframesOut: 'fadeOut',
    animationDelay: 0,
    animattionDuration: 200,
    customScrollButton: '',
    zIndex: 2147483647
  }

  container = null
  scrollY = 0
  constructor(options = {}) {
    super()
    if (!isBroswer) {
      throw new Error('The current environment is not a browser environment')
    }
    if (!isSupportCSS('animation')) {
      console.warn('The current browser does not support "tranfrom" properties, so easingType, keyframes, animationDelay and animattionDuration cannot be used ')
    }

    const conditionOne = this.container && this.container === window && attr.get(document.body, field)
    const conditionTwo = this.container && this.container === window && attr.get(document.body, field)

    if (!conditionOne || !conditionTwo) {
      context = this
      this.defaultOptions = extend(this.defaultOptions, options)
      this.onInit()
    }
  }

  onInit() {
    this.createElement()
    const { animattionDuration } = this.defaultOptions
    const throttleClickFunc = throttle(animattionDuration, this.clickEvent)
    this.clickListenr = eventListener(elementNode, 'click', throttleClickFunc)
    this.scrollListenr = eventListener(this.container, 'scroll', this.onScrollButtonAni)
  }

  createElement() {
    const { scrollContainer, customScrollButton, scrollContent } = this.defaultOptions
    const scrollButton = document.createElement('div')
    const buttonAttrs = {
      title: scrollContent,
      id: 'scrollDefaultButton',
      class: 'scrollDefaultButtonStyle'
    }
    for (const key in buttonAttrs) {
      attr.set(scrollButton, key, buttonAttrs[key])
    }

    scrollButton.innerHTML = customScrollButton || this.defaultOptions.scrollContent
    elementNode = scrollButton
    elementNode.style.display = 'none'
    if (Object.prototype.toString.call(scrollContainer) === '[object String]') {
      if (scrollContainer.startsWith('.')) {
        const container = document.querySelectorAll(scrollContainer)
        container[0].appendChild(scrollButton)
        this.container = container[0]
        attr.set(this.container, field, true)
        attr.set(this.container, 'style', 'position: relative;')
      } else if (scrollContainer.startsWith('#')) {
        const container = document.querySelector(scrollContainer)
        container.appendChild(scrollButton)

        this.container = container
        attr.set(this.container, field, true)
        attr.set(this.container, 'style', 'position: relative;')
      } else {
        console.warn('The element does not exist on the current page')
      }
    } else if (isNode(scrollContainer)) {
      scrollContainer.appendChild(scrollButton)
      attr.set(this.container, 'style', 'position: relative')

      this.container = scrollContainer
      attr.set(this.container, field, true)
    } else {
      this.defaultOptions.scrollContainer = window
      document.body.appendChild(scrollButton)
      this.container = window
      attr.set(document.body, field, true)
    }

    this.setAnimation()
  }

  async scrollEvent() {
    const container = context.container === window ? document.documentElement || document.body : context.container
    const { easingType, scrollTarget } = context.defaultOptions
    const beginTime = Date.now()
    const beginVal = container.scrollTop
    const endVal = scrollTarget || beginVal
    // 优化
    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
    const frameFunc = () => {
      const normalSpeed = beginVal * easingfunc[easingType]((Date.now() - beginTime) / 500)
      const curInter = container.scrollTop - endVal <= 0 ? endVal : container.scrollTop - endVal
      const speed = curInter < normalSpeed ? curInter : normalSpeed
      const curbottom = Number(elementNode.style.bottom.replace(/px/, ''))
      container.scrollTop -= speed
      context.emit('on-scrolling', this.defaultOptions, elementNode)
      if (context.container !== window) {
        elementNode.style.bottom = curbottom + speed + 'px'
      }
      if (beginVal - container.scrollTop <= endVal && container.scrollTop !== 0) {
        rAF(frameFunc)
      } else {
        elementNode.style.bottom = '20px'
        context.emit('on-end-scroll', this.defaultOptions, elementNode)
      }
    }
    rAF(frameFunc)
  }

  onScrollButtonAni() {
    const { scrollContainer, scrollButtonDistance, keyframesIn, keyframesOut, scrollButtonBottom } = context.defaultOptions
    const scrollTop = context.container === window ? document.documentElement.scrollTop || document.body.scrollTop : context.container.scrollTop
    const dis = scrollButtonDistance || 300
    const direction = context.getDirection(scrollTop)
    let style = {
      position: !scrollContainer || scrollContainer === window ? '' : 'absolute',
      display: 'block'
    }
    if (scrollTop >= dis && direction === 'down') {
      style = Object.assign(style, { 'animation-name': keyframesIn })
      attr.set(elementNode, 'style', elementNode.style.cssText + styleStr(style))
    } else if (scrollTop < dis && direction === 'up') {
      style = Object.assign(style, { 'animation-name': keyframesOut })
      attr.set(elementNode, 'style', elementNode.style.cssText + styleStr(style))
    }
    if (context.container !== window) {
      elementNode.style.bottom = scrollButtonBottom - scrollTop + 'px'
    }
  }

  setAnimation() {
    const { animationDelay, animattionDuration, easingType, zIndex, scrollContainer, scrollButtonBottom } = context.defaultOptions
    const style = {
      'z-Index': zIndex,
      'animation-duration': animattionDuration + unit,
      'animation-timing-function': easingType,
      'animation-delay': animationDelay + unit,
      position: !scrollContainer || scrollContainer === window ? '' : 'absolute',
      bottom: scrollButtonBottom + 'px'
    }
    attr.set(elementNode, 'style', styleStr(style) + elementNode.style.cssText)
  }

  getDirection(scrollTop) {
    if (scrollTop - context.scrollY > 0) {
      context.scrollY = scrollTop
      return 'down'
    } else if (scrollTop - context.scrollY < 0) {
      context.scrollY = scrollTop
      return 'up'
    }
  }

  clickEvent() {
    context.emit('on-start-scroll', this.defaultOptions, elementNode)
    context.scrollEvent()
  }

  destroyed() {
    const { scrollContainer } = this.defaultOptions
    scrollContainer.removeChild(elementNode)
    elementNode = null
    this.clickListenr.remove()
  }
}
window.scrollToUp = scrollToUp
export default scrollToUp
