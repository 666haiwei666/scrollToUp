## 说明
  
  目前只支持“top”方向的滚动，对于其他方向的滚动，后面会陆续更新。



## CDN 引入

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/scrolltoup@0.0.5/dist/index.css" />
<script src="https://cdn.jsdelivr.net/npm/scrolltoup@0.0.5/dist/index.js"></script>
```

## 安装

```bash
npm install scrolltoup --save
```

## npm 引入

```bash
import scrollToUp from 'scrolltoup'
```

## 如何使用

```js
let scrollToUp = new scrollToUp()
```

## 基本配置

| 配置项             | 数据类型                   | 描述                                             |
| ------------------ | -------------------------- | ------------------------------------------------ |
| scrollTarget       | null（默认值）或 Number    | 每次滚动的距离，如果不设置，默认滚动到头部       |
| scrollContainer    | null （默认值）或 dom 节点 | 滚动的容器，如果不设置，默认滚动是 window        |
| scrollButtonDistance | Number                 | 当滚动到多少距离时，按钮开始显示，默认300 |
| scrollButtonBottom | Number                     | 按钮的 btttom 值                                 |
| scrollButtonRight | Number                     | 按钮的 right值 值                                 |
| scrollButtonText   | String                     | 默认是`回到顶部`, 按钮的文字，如需自定义，请设置 |
| easingType         | String                     | 默认是`linear`,如需自定义，请参考下方列表        |
| keyframesIn        | String                     | 默认是`fadeIn`, 按钮渐入动画                     |
| keyframesOut       | String                     | 默认是`fadeOut`, 按钮渐出动画                    |
| animationDelay     | Number                     | 默认是 0, 按钮渐入和渐出延迟时间                 |
| customScrollButton | dom 元素或类名，id 名      | 默认是``,如需自定义，请设置                      |
| zIndex             | Number                     | 按钮层级，默认是 2147483647,如需自定义，请设置   |
| mobile             | Boolean                    | 是否在移动端显示                                 |

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

| 事件名称        | 描述     |
| --------------- | -------- |
| on-start-scroll | 开始滚动 |
| on-scrolling    | 正在滚动 |
| on-end-scroll   | 结束滚动 |


## 兼容性
对于区域滚动，使用getBoundingClientRect 进行定位，因此请配合该API的兼容性
对于页面滚动，则无兼容性要求

