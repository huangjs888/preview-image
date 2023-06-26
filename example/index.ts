/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-26 10:38:55
 * @Description: ******
 */
import ImageView from '../src/index';
import Swiper from '../src/swiper';
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
  img.src = require('./image/ok.jpg');
  view.appendChild(img);
  const image = new ImageView({
    container: view,
    element: img,
    // damping: ['rotate', 'scale', 'translate'],
    // rotation: [-90, 90],
    // scalation: [0.1, 10],
    /* translation: [
      [-Infinity, Infinity],
      [-Infinity, Infinity],
    ], */
  });
  /* (document.querySelector('#stop') as HTMLElement).onclick = () => {
    image._transition._animation[0].animation.stop();
  };
  (document.querySelector('#end') as HTMLElement).onclick = () => {
    image._transition._animation[0].animation.end();
  };
  (document.querySelector('#restart') as HTMLElement).onclick = () => {
    image._transition._animation[0].animation.restart();
  };
  (document.querySelector('#sleep') as HTMLElement).onclick = () => {
    image._transition._animation[0].animation.sleep(3000);
  }; */
  let swiper: Swiper | null = null;
  (document.querySelector('#click') as HTMLElement).onclick = () => {
    if (swiper) {
      swiper.destory();
      swiper.element.style.zIndex = '-1';
      swiper = null;
    }
    /* image._transition.apply(
      { x: 410 },
      {
        delay: -3000,
        duration: 10000,
        easing: function (t: number) {
          return t;
        },
        cancel: false,
      },
    ); */
    // image.transform({ k: 2, x: 100, y: 100 }, [0, 252]);

    image.transformTo({ k: 6.544 });

    // image.transformTo({  });
    // image.transformTo({ k: 3 }, [307, 394]);
    /* image.transformOK({ x: 100 });
    image.transformOK({ y: 50 });
    setTimeout(() => {
      image.transformOK({ x: 50 });
      image.transformOK({ y: 100 });
    }, 2600); */
  };
  (document.querySelector('#clear') as HTMLElement).onclick = () => {
    const v1 = view.cloneNode() as HTMLElement;
    v1.appendChild(img.cloneNode());
    v1.classList.remove('image-view');
    const v2 = view.cloneNode() as HTMLElement;
    v2.appendChild(img.cloneNode());
    v2.classList.remove('image-view');
    const v3 = view.cloneNode() as HTMLElement;
    v3.appendChild(img.cloneNode());
    v3.classList.remove('image-view');
    swiper = new Swiper({
      container: document.querySelector('.swiper') as HTMLElement,
      children: [v1, v2, v3],
    });
    swiper.element.style.zIndex = '1';
    setTimeout(() => {
      swiper && swiper.slide(1);
    }, 1000);
    (document.querySelector('#log') as HTMLElement).innerHTML = '';
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
