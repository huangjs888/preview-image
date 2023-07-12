/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-12 17:49:12
 * @Description: ******
 */
import { Swiper, Container } from '../src';
import './index.less';

const swiper = document.querySelector('.swiper') as HTMLElement;
const s = new Swiper({
  element: swiper,
  imageUrls: [
    require('./image/552.png'),
    '/http/maxAgeImage',
    require('./image/552-3.png'),
  ],
  activeIndex: 1,
  // direction: 'vertical',
});
const container = document.querySelector('.container') as HTMLElement;
const c = new Container({
  element: container,
  url: '/http/maxAgeImage',
});
(document.querySelector('#click') as HTMLElement).onclick = () => {
  s.next();
  const i = s._images[s._activeIndex].image;
  if (i) {
    i.transformTo({ k: 8 });
  }
  if (c._image) {
    c._image.transformTo({ k: 8 });
  }
};
(document.querySelector('#clear') as HTMLElement).onclick = () => {
  s.prev();
  const i = s._images[s._activeIndex].image;
  if (i) {
    i.transformTo({ k: 1 });
  }
  c.destory();
  (document.querySelector('#log') as HTMLElement).innerHTML = '';
};

const logDom = document.querySelector('#log') as HTMLElement;

(window as any).log = function log(...v: string[]) {
  let innerHTML = '';
  v.forEach((str) => {
    innerHTML += `<span>${str}</span>&nbsp;`;
  });
  logDom.innerHTML += innerHTML + '<br/>';
};
(window as any).replacelog = function replacelog(...v: string[]) {
  let innerHTML = '';
  v.forEach((str) => {
    innerHTML += `<span>${str}</span>&nbsp;`;
  });
  logDom.innerHTML = innerHTML;
};
