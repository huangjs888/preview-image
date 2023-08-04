<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 16:37:47
 * @Description: ******
-->
## previewImage
H5 预览图片
### 使用方法
```html
  <body>
    <div class="imglist">
      <img class="img" src="/http/maxAgeImage" />
    </div>
  </body>
```
```javascript

import previewImage from '@huangjs888/previewImage';

const imgDoms = document.querySelectorAll('.img');
const imgUrls = [];
imgDoms.forEach((a) => {
  const { left, top, width, height } = a.getBoundingClientRect();
  const current = a.src;
  imgUrls.push(current);
  a.onclick = () => {
    previewImage({
      urls: imgUrls,
      current,
      showMenu: () => {
        alert('showMenu');
      },
      originRect: { left, top, width, height },
    });
  };
});
  
```

在线预览地址:[https://huangjs888.github.io/previewImage/](https://huangjs888.github.io/previewImage/ "预览")
