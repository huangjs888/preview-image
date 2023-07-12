/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-12 17:12:46
 * @Description: ******
 */
import { Swiper, Container } from '../src';
import './index.less';

const swiper = document.querySelector('.swiper') as HTMLElement;
const s = new Swiper({
  element: swiper,
  imageUrls: ['/http/maxAgeImage', '/http/maxAgeImage', '/http/maxAgeImage'],
  activeIndex: 1,
  // direction: 'vertical',
});
const container = document.querySelector('.container') as HTMLElement;
const c = new Container({
  element: container,
  url: '/http/maxAgeImage',
});
(document.querySelector('#click') as HTMLElement).onclick = () => {
  //s.next();
  /* if (c._image) {
    c._image.transformTo({ k: 8 });
  } */
};
(document.querySelector('#clear') as HTMLElement).onclick = () => {
  //s.prev();
  //c.destory();
  (document.querySelector('#log') as HTMLElement).innerHTML = '';
};

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
