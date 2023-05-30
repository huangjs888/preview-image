/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-30 15:14:24
 * @Description: ******
 */
import ImageView from '../src/index';
import './index.less';

const view = document.querySelector('.image-view') as HTMLElement;
if (view) {
  const img = document.createElement('img');
  img.onload = (e) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    const { width: boxWidth, height: boxHeight } = view.getBoundingClientRect();
    const aspectRatio = naturalWidth / naturalHeight;
    const boxAspectRatio = boxWidth / boxHeight;
    let width = naturalWidth;
    if (aspectRatio >= boxAspectRatio) {
      width = boxWidth;
    } else if (aspectRatio >= 1 / 2.2) {
      // 0.4545454545...
      //微信iphone横竖屏和微信android竖屏时
      width = boxHeight * aspectRatio;
    } /* else if (aspectRatio >= 0.4) {
      // 微信android横屏时
      width = boxHeight * aspectRatio;
    } */ else {
      // 微信iphone是取boxWidth和naturalWidth最小值
      width = Math.min(boxWidth, naturalWidth);
      // 微信android直接是取boxWidth;
      // width = boxWidth;
    }
    const height = width / aspectRatio;
    if (height > boxHeight) {
      view.style.alignItems = 'flex-start';
    }
    target.width = width;
    target.height = height;
    img.onload = null;
  };
  img.src = require('./image/552.png');
  view.appendChild(img);
  const image = new ImageView({
    container: view,
    element: img,
  });
  (document.querySelector('#click') as HTMLElement).onclick = () => {
    image.scaleTo(2);
    /* const a = image.translateYTo(100);
    setTimeout(() => {
      if (!b) console.log('正在进行动画');
    }, 500); */
    /* image.scaleTo(2);
    setTimeout(() => {
      image.translateXTo(10);
      image.translateYTo(100);
    }, 5000); */
    /* image.translateXTo(10);
    image.translateYTo(100);
    setTimeout(() => {
      image.scaleTo(2, [307, 394]);
    }, 5000); */
  };

  /*
  gesture.on('pan', pan.bind(this)); // 单指平移，随手指左右平移到一定距离切换图片，向上平移不操作，向下平移随手指关闭图片;
  gesture.on('multiPan', multiPan.bind(this)); // 双指平移，随手指变形图片;
  gesture.on('swipe', swipe.bind(this)); // 单指快速滑动，左右动画切换图片，向上不操作，向下动画关闭图片;
  gesture.on('pinch', pinch.bind(this)); // 双指拿捏，随手指缩放图片操作
  gesture.on('rotate', rotate.bind(this)); // 双指旋转，随手指旋转图片
  gesture.on('singleTap', singleTap.bind(this)); // 单指单点（有延迟，双点时不触发），动画关闭图片
  gesture.on('doubleTap', doubleTap.bind(this)); // 单指双点，动画放大2倍和动画恢复正常
  gesture.on('longTap', longTap.bind(this)); // 单指长按，触发外层菜单操作（比如删除，分享，转发）
*/
  /* image.scale();
  image.rotate();
  image.translate();
  image.close();*/
}

const logDom = document.querySelector('#log') as HTMLElement;
window.log = function log(...v: string[]) {
  let innerHTML = '';
  v.forEach((s) => {
    innerHTML += `<span>${s}</span>&nbsp;`;
  });
  logDom.innerHTML += innerHTML + '<br/>';
};
window.replacelog = function replacelog(...v: string[]) {
  let innerHTML = '';
  v.forEach((s) => {
    innerHTML += `<span>${s}</span>&nbsp;`;
  });
  logDom.innerHTML = innerHTML;
};
