<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 15:14:07
 * @Description: ******
-->
## preview-image

H5 预览图片

## 使用方法

### Html
```html
  <body>
    <div class="imglist">
      <img class="img" src="/http/maxAgeImage" />
      <img class="img" src="xxx.jpg" />
      <img class="img" src="yyy.png" />
    </div>
  </body>
```

### Rawjs

```js

import { previewImage } from '@huangjs888/previewImage';

const imgDoms = document.querySelectorAll('.img');
const imgUrls = [];
imgDoms.forEach((a) => {
  const current = a.src;
  imgUrls.push(current);
  a.onclick = () => {
    const { left, top, width, height } = a.getBoundingClientRect();
    const clickPosition = { x: left + width / 2, y: top + height / 2, w: width, h: height };
    previewImage({
      current,
      urls: imgUrls,
      // 预览图片时，图片将从该位置打开
      clickPosition,
      // 移动端长按或web端右键可以在此弹出自定义菜单操作
      onContextMenu: () => {
        alert('rawjs');
      },
    });
  };
});

  
```
### React

```js

import React from 'react';
import { PreviewImage } from '@huangjs888/preview-image/react';

const list = ['/http/maxAgeImage', 'xxx.jpg', 'yyy.png'];

function App() {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('');
  const [clickPosition, setClickPosition] = React.useState();
  const click = (e) => {
    const origin = e.target;
    const { left, top, width, height } = origin.getBoundingClientRect();
    const position = { x: left + width / 2, y: top + height / 2, w: width, h: height };
    // 如果不是缩略图，此时可以获取点击位置
    /* const position = {
      x: (e.touches ?? [e])[0]?.pageX,
      y: (e.touches ?? [e])[0]?.pageY,
    }; */
    setClickPosition(position);
    setCurrent(origin.src);
    setOpen(true);
  };
  return (
    <div className="App">
      <div className="imglist">
        {list.map((url, index) => (
          <img key={index} onClick={click} className="img" src={url} alt="" />
        ))}
      </div>
      <PreviewImage
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        urls={list}
        // 预览图片时，图片将从该位置打开
        clickPosition={clickPosition}
        // 长按或右键可以在此弹出自定义菜单操作
        onContextMenu={() => alert('react')}
      />
    </div>
  );
}
  
```

在线预览地址：[https://huangjs888.github.io/preview-image/](https://huangjs888.github.io/preview-image/ "预览")
