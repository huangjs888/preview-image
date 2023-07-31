<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 17:22:35
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
  const current = a.src;
  imgUrls.push(current);
  a.onclick = () => {
    previewImage({
      urls: imgUrls,
      current,
      showMenu: () => {
        alert('showMenu');
      },
    });
  };
});
  
```

在线预览地址:[https://huangjs888.github.io/previewImage/](https://huangjs888.github.io/previewImage/ "预览")
