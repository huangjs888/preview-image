<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 11:00:25
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

### Native

```javascript

import previewImage from '@huangjs888/previewImage';

const imgDoms = document.querySelectorAll('.img');
const imgUrls = [];
imgDoms.forEach((a) => {
  const current = a.src;
  imgUrls.push(current);
  a.onclick = () => {
    const { left, top, width, height } = a.getBoundingClientRect();
    previewImage({
      current,
      urls: imgUrls,
      showMenu: () => {
        alert('native');
      },
      originRect: { left, top, width, height },
    });
  };
});
  
```
### React

```javascript

import React from 'react';
import PreviewImage from '@huangjs888/preview-image/react';

const list = ['/http/maxAgeImage', 'xxx.jpg', 'yyy.png'];

function App() {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('');
  const [originBox, setOriginBox] = React.useState<{
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  }>();
  const click = (e) => {
    const origin = e.target;
    const { left, top, width, height } = origin.getBoundingClientRect();
    setOriginBox({ left, top, width, height });
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
        showMenu={() => alert('react')}
        current={current}
        urls={list}
        originBox={originBox}
      />
    </div>
  );
}
  
```

在线预览地址:[https://huangjs888.github.io/preview-image/](https://huangjs888.github.io/preview-image/ "预览")
