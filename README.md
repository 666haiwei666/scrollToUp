## CDN 引入

```html
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/scrolltoup@0.0.4/dist/index.css" />
  <script src="https://cdn.jsdelivr.net/npm/scrolltoup@0.0.4/dist/index.js"></script>
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
|  配置项   | 数据类型  |  描述 |
|  ----  | ----  | ----  |
| scrollTarget  | null（默认值）或 Number |  每次滚动的距离，如果不设置，默认滚动到头部|
| scrollContainer  | null （默认值）或 dom节点 | 滚动的容器，如果不设置，默认滚动是window
| scrollButtonText  | String | 默认是`Scroll to top`, 按钮的文字，如需自定义，请设置
| easingType  | String | 默认是`linear`,如需自定义，请参考缓动函数 (http://easings.net/)
| keyframesIn  | String | 默认是`fadeIn`, 按钮渐入动画
| keyframesOut  | String | 默认是`fadeOut`, 按钮渐出动画
| animationDelay  | Number | 默认是0, 按钮渐入和渐出延迟时间
| customScrollButton  | dom元素或类名，id名 | 默认是``,如需自定义，请设置
| zIndex  | Number | 按钮层级，默认是2147483647,如需自定义，请设置
| mobile  | Boolean | 是否在移动端显示


## 销毁

```
scrollToUp.destroyed()
```
## 回调事件

|  事件名称   |   描述 |
|  ----  | ----  | 
| on-start-scroll  | 开始滚动 | 
| on-scrolling  | 正在滚动 | 
| on-end-scroll  | 结束滚动 | 



