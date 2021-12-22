import { throttle } from 'throttle-debounce'
import extend from './utils/extend'
import attr from './utils/attr'
import eventListener from './utils/eventListener'
import isBrowser from './utils/isBrowser'
import isSupportCSS from './utils/isSupportCSS'
import isNode from './utils/isNode'
import styleStr from './utils/styleStr'
import easingfunc from './utils/easingfunc'
import createScrollButton from './createScrollButton'

const t = 0.5
let context = null

class scrollToUp {
  defaultOptions = {
    scrolTarget: null,
    scrollContainer: null,
    scrollButtonDistance: 100,
    scrollButtonBottom: 20,
    scrollButtonRight: 20,
    scrollButtonText: '回到顶部',
    easingType: 'linear',
    keyframesIn: 'fadeIn',
    keyframesOut: 'fadeOut',
    customScrollButton: '',
    mobile: false,
    startScrollCallBack: null,
    endScrollCallBack: null,
    scrollingCallBack: null
  }

  clickListenr = null
  containerScrollListenr = null
  windowScrollListenr = null
  container = null
  buttonNode = null
  scrollY = 0
  constructor(options = {}) {
    if (!isBrowser) {
      throw new Error('The current environment is not a browser environment')
    }
    if (!isSupportCSS('animation')) {
      console.warn('The current browser does not support "tranfrom" properties, so easingType, keyframes, animationDelay and animationDuration cannot be used ')
    }

    if (!window.scrollEle) {
      context = this
      this.defaultOptions = extend(this.defaultOptions, options)
      this._onInit()
    }
  }

  _onInit() {
    this._createElement()
    const { animationDuration } = this.defaultOptions
    const throttleClickFunc = throttle(animationDuration, this.clickEvent)
    this.clickListenr = eventListener(this.buttonNode, 'click', throttleClickFunc)
    if (this.container !== window) {
      this.containerScrollListenr = eventListener(this.container, 'scroll', this._onScrollButtonAni)
      this.windowScrollListenr = eventListener(window, 'scroll', this._onScrollButtonAni)
    } else {
      this.containerScrollListenr = eventListener(this.container, 'scroll', this._onScrollButtonAni)
    }
  }

  _createElement() {
    const { scrollContainer } = this.defaultOptions
    this.buttonNode = createScrollButton(this.defaultOptions)
    window.scrollEle = this.buttonNode

    if (Object.prototype.toString.call(scrollContainer) === '[object String]') {
      if (scrollContainer.startsWith('.')) {
        const container = document.querySelectorAll(scrollContainer)
        container[0].appendChild(this.buttonNode)
        this.container = container[0]
        attr.set(this.container, 'style', 'position: relative;')
      } else if (scrollContainer.startsWith('#')) {
        const container = document.querySelector(scrollContainer)
        container.appendChild(this.buttonNode)
        this.container = container
        attr.set(this.container, 'style', 'position: relative;')
      } else {
        console.warn('The element does not exist on the current page')
      }
    } else if (isNode(scrollContainer)) {
      scrollContainer.appendChild(this.buttonNode)
      attr.set(this.container, 'style', 'position: relative')

      this.container = scrollContainer
    } else {
      this.defaultOptions.scrollContainer = window
      document.body.appendChild(this.buttonNode)
      this.container = window
    }
    const { isShowButton } = this.onJudgeShowButton()
    this.buttonNode.style.display = isShowButton ? 'block' : 'none'
  }

  async _scrollEvent() {
    const container = context.container === window ? document.documentElement || document.body : context.container
    const { easingType, scrollTarget, scrollingCallBack, endScrollCallBack } = context.defaultOptions
    const beginVal = container.scrollTop
    const endVal = scrollTarget || beginVal
    // 优化
    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
    const frameFunc = () => {
      const normalSpeed = (beginVal * easingfunc[easingType](t)) / 10
      const curInter = container.scrollTop - endVal <= 0 ? endVal : container.scrollTop - endVal
      const speed = curInter < normalSpeed ? curInter : normalSpeed
      container.scrollTop -= speed
      if (scrollingCallBack) {
        scrollingCallBack(context.defaultOptions, context.buttonNode)
      }
      if (beginVal - container.scrollTop <= endVal && container.scrollTop !== 0) {
        rAF(frameFunc)
      } else {
        if (endScrollCallBack) {
          endScrollCallBack(context.defaultOptions, context.buttonNode)
        }
      }
    }
    rAF(frameFunc)
  }

  _onScrollButtonAni() {
    const { keyframesIn, keyframesOut, scrollButtonBottom, scrollButtonRight } = context.defaultOptions
    const { isShowButton, scrollTop } = context.onJudgeShowButton()
    const direction = context.getDirection(scrollTop)
    let style = {
      display: 'block'
    }
    if (isShowButton && direction === 'down') {
      style = Object.assign(style, { 'animation-name': keyframesIn })
      attr.set(context.buttonNode, 'style', context.buttonNode.style.cssText + styleStr(style))
    } else if (!isShowButton && direction === 'up') {
      style = Object.assign(style, { 'animation-name': keyframesOut })
      attr.set(context.buttonNode, 'style', context.buttonNode.style.cssText + styleStr(style))
    }
    const { bottom, right } = context.container === window ? {} : context.container.getBoundingClientRect()
    context.buttonNode.style.bottom = context.container === window ? scrollButtonBottom + 'px' : window.innerHeight - bottom + scrollButtonBottom + 'px'
    context.buttonNode.style.right = window.innerWidth - right + scrollButtonRight + 'px'
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
    const startScrollCallBack = context.defaultOptions.startScrollCallBack
    if (startScrollCallBack) {
      startScrollCallBack(context.defaultOptions, context.buttonNode)
    }
    context._scrollEvent()
  }

  destroyed() {
    const { scrollContainer } = this.defaultOptions
    scrollContainer.removeChild(this.buttonNode)
    this.clickListenr.remove()
    this.containerScrollListenr.remove()
    this.windowScrollListenr.remove()
    this.buttonNode = null
    window.scrollToUp = null
    window.scrollEle = null
  }
}
window.scrollToUp = scrollToUp
export default scrollToUp
