## 说明

目前只支持“top”方向的滚动，对于其他方向的滚动，后面会陆续更新。
一个页面只支持使用一次滚动节点 


## CDN 引入


```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/scrollToUp@0.0.8/dist/index.css" />
<script src="https://cdn.jsdelivr.net/npm/scrollToUp@0.0.8/dist/index.js"></script>
```

## 安装
 

```bash
npm install scroll-to-up --save
```
 


## npm 引入
 

```bash
import scrollToUp from 'scroll-to-up'
```
 


## 如何使用


```js
let scrollToUp =  new scrollToUp({
  scrollContainer: '.container',
  startScrollCallBack: function (options) {
    console.log('start')
  },
  scrollingCallBack: function (options) {
    console.log('scrolling')
  },
  endScrollCallBack: function (options) {
    console.log('end')
  },
})
```
 


## 基本配置
 

| 配置项               | 数据类型                   | 描述                                             |
| -------------------- | -------------------------- | ------------------------------------------------ |
| scrollTarget         | null（默认值）或 Number    | 每次滚动的距离，如果不设置，默认滚动到头部       |
| scrollContainer      | null （默认值）或 dom 节点 | 滚动的容器，如果不设置，默认滚动是 window        |
| scrollButtonDistance | Number                     | 当滚动到多少距离时，按钮开始显示，默认 300       |
| scrollButtonBottom   | Number                     | 按钮的 btttom 值                                 |
| scrollButtonRight    | Number                     | 按钮的 right 值 值                               |
| scrollButtonText     | String                     | 默认是`回到顶部`, 按钮的文字，如需自定义，请设置 |
| easingType           | String                     | 默认是`linear`,如需自定义，请参考下方列表        |
| keyframesIn          | String                     | 默认是`fadeIn`, 按钮渐入动画                     |
| keyframesOut         | String                     | 默认是`fadeOut`, 按钮渐出动画                    |
| customScrollButton   | dom 元素或类名，id 名      | 默认是``,如需自定义，请设置                      |
| mobile               | Boolean                    | 是否在移动端显示                                 |

## 可选的 easingType 列表（https://www.xuanfengge.com/easeing/easeing/)）
 


| 配置项         | 描述                   |
| -------------- | ---------------------- |
| linear         | 线性过渡               |
| easeInQuad     | 从零速度加速。         |
| easeOutQuad    | 减速到零速度           |
| easeInOutQuad  | 加速到一半，然后减速   |
| easeInCubic    | 从零速度加速。         |
| easeOutCubic   | 减速到零速度           |
| easeInOutCubic | 加速到一半，然后减速   |
| easeInQuart    | 从零速度加速。         |
| easeOutQuart   | 减速到零速度           |
| easeInOutQuart | 加速到一半，然后减速。 |
| easeInQuint    | 从零速度加速。         |
| easeOutQuint   | 减速到零速度           |
| easeInOutQuint | 加速到一半，然后减速。 |
 


## 销毁
 

```
scrollToUp.destroyed()
```
 


## 回调事件
 

| 事件名称            | 描述     | 参数                                        |
| ------------------- | -------- | ------------------------------------------- |
| startScrollCallBack | 开始滚动 | (1)defaultOptions 基本配置 （2）buttom 节点 |
| endScrollCallBack   | 正在滚动 | (1)defaultOptions 基本配置 （2）buttom 节点 |
| endScrollCallBack   | 结束滚动 | (1)defaultOptions 基本配置 （2）buttom 节点 |
