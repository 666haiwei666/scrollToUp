import events from 'events'
import { throttle } from 'throttle-debounce'
import extend from './utils/extend'
import attr from './utils/attr'
import eventListener from './utils/eventListener'
import isBrowser from './utils/isBrowser'
import isSupportCSS from './utils/isSupportCSS'
import isNode from './utils/isNode'
import styleStr from './utils/styleStr'
import easingfunc from './utils/easingfunc'
import isMobile from './utils/isMobile'

import './index.css'

const unit = 'ms'
const field = 'scrollToUp'
const t = 0.5

let context = null
let elementNode = null

class scrollToUp extends events {
  defaultOptions = {
    scrollTarget: null,
    scrollContainer: null,
    scrollButtonDistance: 100,
    scrollButtonBottom: 20,
    scrollButtonRight: 20,
    // scrollDirection: 'top', // left, right, top, bottom
    scrollButtonText: '回到顶部',
    easingType: 'linear',
    keyframesIn: 'fadeIn',
    keyframesOut: 'fadeOut',
    animationDelay: 0,
    animationDuration: 200,
    customScrollButton: '',
    zIndex: 2147483647,
    mobile: false
  }

  clickListenr = null
  containerScrollListenr = null
  windowScrollListenr = null
  container = null
  scrollY = 0
  constructor(options = {}) {
    super()
    if (!isBrowser) {
      throw new Error('The current environment is not a browser environment')
    }
    if (!isSupportCSS('animation')) {
      console.warn('The current browser does not support "tranfrom" properties, so easingType, keyframes, animationDelay and animationDuration cannot be used ')
    }

    const conditionOne = this.container && this.container === window && attr.get(document.body, field)
    const conditionTwo = this.container && this.container === window && attr.get(document.body, field)

    if (!conditionOne || !conditionTwo) {
      context = this
      this.defaultOptions = extend(this.defaultOptions, options)
      this._onInit()
    }
  }

  _onInit() {
    this._createElement()
    const { animationDuration } = this.defaultOptions
    const throttleClickFunc = throttle(animationDuration, this.clickEvent)
    this.clickListenr = eventListener(elementNode, 'click', throttleClickFunc)
    if (this.container !== window) {
      this.containerScrollListenr = eventListener(this.container, 'scroll', this._onScrollButtonAni)
      this.windowScrollListenr = eventListener(window, 'scroll', this._onScrollButtonAni)
    } else {
      this.containerScrollListenr = eventListener(this.container, 'scroll', this._onScrollButtonAni)
    }
  }

  _createElement() {
    const { scrollContainer, customScrollButton, scrollButtonText, mobile } = this.defaultOptions
    const scrollButton = document.createElement('div')
    const buttonAttrs = {
      title: 'scroll to up',
      id: 'scroll-default-button',
      class: isMobile(navigator.userAgent) ? (mobile ? 'scrollDefaultButtonStyle' : 'mobile scrollDefaultButtonStyle') : 'scrollDefaultButtonStyle'
    }
    for (const key in buttonAttrs) {
      attr.set(scrollButton, key, buttonAttrs[key])
    }

    scrollButton.innerHTML = customScrollButton || scrollButtonText
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
    elementNode = scrollButton
    const { isShowButton } = this.onJudgeShowButton()
    elementNode.style.display = isShowButton ? 'block' : 'none'
    this._setAnimation()
  }

  async _scrollEvent() {
    const container = context.container === window ? document.documentElement || document.body : context.container
    const { easingType, scrollTarget } = context.defaultOptions
    // const beginTime = Date.now()
    const beginVal = container.scrollTop
    const endVal = scrollTarget || beginVal
    // 优化
    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
    const frameFunc = () => {
      const normalSpeed = (beginVal * easingfunc[easingType](t)) / 10
      const curInter = container.scrollTop - endVal <= 0 ? endVal : container.scrollTop - endVal
      const speed = curInter < normalSpeed ? curInter : normalSpeed
      container.scrollTop -= speed
      context.emit('on-scrolling', this.defaultOptions, elementNode)
      if (beginVal - container.scrollTop <= endVal && container.scrollTop !== 0) {
        rAF(frameFunc)
      } else {
        context.emit('on-end-scroll', this.defaultOptions, elementNode)
      }
    }
    rAF(frameFunc)
  }

  _onScrollButtonAni() {
    const { keyframesIn, keyframesOut, scrollButtonBottom, scrollButtonRight } = context.defaultOptions
    const { isShowButton, pageScrollTop, scrollTop } = context.onJudgeShowButton()
    const direction = context.getDirection(scrollTop)
    let style = {
      display: 'block'
    }
    if (isShowButton && direction === 'down') {
      style = Object.assign(style, { 'animation-name': keyframesIn })
      attr.set(elementNode, 'style', elementNode.style.cssText + styleStr(style))
    } else if (!isShowButton && direction === 'up') {
      style = Object.assign(style, { 'animation-name': keyframesOut })
      attr.set(elementNode, 'style', elementNode.style.cssText + styleStr(style))
    }
    const { bottom, right } = context.container === window ? {} : context.container.getBoundingClientRect()
    elementNode.style.bottom = context.container === window ? scrollButtonBottom + 'px' : document.documentElement.scrollHeight - pageScrollTop - bottom + scrollButtonBottom + 'px'
    elementNode.style.right = window.innerWidth - right + scrollButtonRight + 'px'
  }

  onJudgeShowButton() {
    const { scrollButtonDistance } = context.defaultOptions
    const pageScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const elScrollTop = context.container ? context.container.scrollTop : 0
    const scrollTop = context.container === window ? pageScrollTop : elScrollTop
    const dis = scrollButtonDistance || 300
    return {
      pageScrollTop,
      elScrollTop,
      scrollTop,
      isShowButton: scrollTop >= dis
    }
  }

  _setAnimation() {
    const { animationDelay, animationDuration, easingType, zIndex, scrollButtonRight, scrollButtonBottom } = context.defaultOptions
    const style = {
      'z-Index': zIndex,
      'animation-duration': animationDuration + unit,
      'animation-timing-function': easingType,
      'animation-delay': animationDelay + unit,
      bottom: scrollButtonBottom + 'px',
      right: scrollButtonRight + 'px'
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
    context._scrollEvent()
  }

  destroyed() {
    elementNode = null
    const { scrollContainer } = this.defaultOptions
    scrollContainer.removeChild(elementNode)
    this.clickListenr.remove()
    this.containerScrollListenr.remove()
    this.windowScrollListenr.remove()
  }
}
window.scrollToUp = scrollToUp
export default scrollToUp
