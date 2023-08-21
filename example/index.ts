/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 14:36:29
 * @Description: ******
 */
import previewImage /* , { Gallery, Picture } */ from '../es';
import './index.less';

const sendMessage = (data: any) => {
  ((window as any).ReactNativeWebView || window).postMessage(JSON.stringify(data));
  // eslint-disable-next-line no-alert
  window.alert(data);
};

const imgDoms = document.querySelectorAll('.img');
const imgUrls: string[] = [require('./image/1.jpg')];
imgDoms.forEach((a) => {
  const current = (a as HTMLImageElement).src;
  imgUrls.push(current);
  (a as HTMLElement).onclick = () => {
    const { left, top, width, height } = a.getBoundingClientRect();
    previewImage({
      urls: imgUrls,
      current,
      showMenu: () => {
        sendMessage('showMenu');
      },
      originRect: { left, top, width, height },
    });
  };
});

/* const swiper = document.querySelector('.swiper') as HTMLElement;
const s = new Gallery({
  container: swiper,
  imageUrls: [
    '/http/maxAgeImage?' + new Date().getTime(),
    'https://github.githubassets.com/images/modules/site/home/globe.jpg',
    'https://greensock.com/images/testimonial-bg.gif?' + new Date().getTime(),
    'https://cloud.githubusercontent.com/assets/2395166/20168869/48a75b02-a75f-11e6-89aa-503d65c8ad8e.png?' +
      new Date().getTime(),
    '/http/maxAgeImagePPP',
  ],
  activeIndex: 1,
  direction: 'vertical',
  isLazy: false,
  longPress: () => {
    sendMessage({ type: 'longPress' });
  },
  press: () => {
    sendMessage({ type: 'press' });
  },
});
s.open();
const container = document.querySelector('.container') as HTMLElement;
const c = new Picture({
  container,
  url: require('./image/ok.jpg'),
  longPress: () => {
    sendMessage({ type: 'longTap' });
  },
  press: () => {
    sendMessage({ type: 'singleTap' });
    c.close();
  },
  options: {
    rotation: [-180, 180],
    damping: ['rotate', 'scale', 'translate'],
  },
});
c.open();

(document.querySelector('#test') as HTMLElement).onclick = () => {
  const c_image = c._image && c._image.entity;
  if (c_image) {
    c_image.setTranslation([
      [-Infinity, Infinity],
      [-Infinity, Infinity],
    ]);
    c_image.transformTo(
      { y: -141 },
      {
        easing: (v) => v,
        duration: 3000,
        before: (progress) => {
          let _progress = 0;
          if (progress <= 0.2) {
            _progress = 0 - progress / 0.2;
          } else if (progress <= 0.8) {
            _progress = progress / 0.2 - 2;
          } else if (progress <= 1) {
            _progress = 6 - progress / 0.2;
          }
          return _progress;
        },
      },
    );
    setTimeout(() => {
      c_image.transformTo(
        { y: 0 },
        {
          easing: (x) => {
            const n1 = 7.5625;
            const d1 = 2.75;

            if (x < 1 / d1) {
              return n1 * x * x;
            } else if (x < 2 / d1) {
              return n1 * (x -= 1.5 / d1) * x + 0.75;
            } else if (x < 2.5 / d1) {
              return n1 * (x -= 2.25 / d1) * x + 0.9375;
            } else {
              return n1 * (x -= 2.625 / d1) * x + 0.984375;
            }
          },
          duration: 1000,
        },
      );
    }, 4000);
  }
};
(document.querySelector('#switch') as HTMLElement).onclick = () => {
  if (s._container && c._container) {
    s._container.style.zIndex = `${-s._container.style.zIndex}`;
    c._container.style.zIndex = `${-c._container.style.zIndex}`;
    (document.querySelector('#switch') as HTMLElement).innerHTML = `swicth-${
      +s._container.style.zIndex > 0 ? 'c' : 's'
    }`;
  }
};
(document.querySelector('#prev') as HTMLElement).onclick = () => {
  s.prev();
};
(document.querySelector('#next') as HTMLElement).onclick = () => {
  s.next();
};
(document.querySelector('#zoom') as HTMLElement).onclick = () => {
  const c_image = c._image && c._image.entity;
  if (c_image) {
    c_image.scaleTo(4);
  }
  const s_image = s._images && s._images[s._activeIndex].entity;
  if (s_image) {
    s_image.scaleTo(4);
  }
};
(document.querySelector('#drop') as HTMLElement).onclick = () => {
  c.close();
  s.close();
};

(document.querySelector('#clear') as HTMLElement).onclick = () => {
  logDom.innerHTML = '';
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
 */
