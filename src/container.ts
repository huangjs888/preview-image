import Gesture, { type GEvent } from './gesture';
import Image from './image';
import { setStyle, proxyImage, loadImage } from './adjust';

proxyImage();

const touchStart = function touchStart(this: Container, e: GEvent) {
  const { toucheIds } = e;
  if (this._fgBehavior === 0 && toucheIds.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  let cancelNumber = 0;
  // 取消动画
  const image = this._image;
  if (image) {
    cancelNumber += image.transitionCancel();
  }
  if (cancelNumber > 0 && this._gesture) {
    // 如果有动画停止，则本次点击或略，阻止所有单指点击相关事件
    // 曲线救国 1：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPoint = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
};
const touchMove = function touchMove(this: Container, e: GEvent) {
  const { toucheIds } = e;
  if (this._fgBehavior === 0 && toucheIds.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  const image = this._image;
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    let oneFinger = false;
    if (toucheIds.length === 1 || this._fgBehavior === 1) {
      // 此时的多指move，视作单指move
      // 曲线救国 2：这里使用注入设置，以达到使_rotateAngle不为number，避免了双指旋转
      if (this._gesture) {
        this._gesture._rotateAngle = null;
      }
      oneFinger = true;
    }
    const { point, angle = 0, scale = 1, deltaX = 0, deltaY = 0 } = e;
    if (oneFinger) {
      // 实现单指move
      image.move(point, 0, 1, deltaX, deltaY);
    } else {
      // 双指move
      image.move(point, angle, scale, deltaX, deltaY);
    }
  }
};
const touchEnd = function touchEnd(this: Container, e: GEvent) {
  const { toucheIds } = e;
  if (toucheIds.length === 0) {
    // 抬起最后一根手指时，重置_fgBehavior
    this._fgBehavior = 0;
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    return;
  }
  const image = this._image;
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    // image.reset内部会做isTransitioning的判断
    // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否为双指
    image.reset(
      e.point,
      !!this._gesture && typeof this._gesture._rotateAngle === 'number',
    );
  }
};
const doubleTap = function doubleTap(this: Container, e: GEvent) {
  const image = this._image;
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    image.dblScale(e.point);
  }
};
const swipe = function swipe(this: Container, e: GEvent) {
  const image = this._image;
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    const { velocity = 0, swipeComputed } = e;
    if (velocity > 0 && swipeComputed) {
      const { duration, stretchX, stretchY } = swipeComputed(
        0.003,
        velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
      );
      image.swipe(duration, stretchX, stretchY);
    }
  }
};

class Container {
  element: HTMLElement;
  _image: Image | null = null;
  _gesture: Gesture | null = null; // 手势对象
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _removeResize: (() => void) | null = null;
  constructor({ element, url }: COption) {
    let tempElement: HTMLElement | null;
    try {
      if (typeof element === 'string') {
        tempElement = document.querySelector(element);
      } else {
        tempElement = element;
      }
    } catch (e) {
      tempElement = null;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    tempElement.innerHTML = '';
    this.element = setStyle(tempElement, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    });
    // 绑定手势
    const gesture = new Gesture(this.element);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    let naturalWidth = 0;
    let naturalHeight = 0;
    const resize = () => {
      if (this._image) {
        const { left, top, width, height } =
          this.element.getBoundingClientRect();
        this._image.setRectSize({
          containerCenter: [left + width / 2, top + height / 2],
          containerWidth: width,
          containerHeight: height,
          naturalWidth,
          naturalHeight,
        });
        const { elementHeight } = this._image.getRectSize();
        if (elementHeight > height) {
          setStyle(this.element, {
            alignItems: 'flex-start',
          });
        }
      }
    };
    const tip = setStyle(document.createElement('div'), {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.5)',
      color: '#fff',
      fontSize: 18,
    });
    this.element.appendChild(tip);
    loadImage(url, (v) => {
      // 这里可以加一个进度条提示
      // 如果需要进度，必须在初始化的时候执行 proxyImage
      tip.innerHTML = `${Math.round(v * 100)}%`;
    })
      .then((ele) => {
        naturalWidth = ele.naturalWidth;
        naturalHeight = ele.naturalHeight;
        this._image = new Image({ element: ele });
        setStyle(tip, { display: 'none' });
        this.element.appendChild(ele);
        resize();
      })
      .catch((e) => {
        // 这里可以加一个错误的提示
        console.error(e);
        tip.innerHTML = '加载失败';
      });
    window.addEventListener('resize', resize);
    this._removeResize = () => {
      window.removeEventListener('resize', resize);
    };
  }
  destory() {
    this._image = null;
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
    if (this._removeResize) {
      this._removeResize();
      this._removeResize = null;
    }
  }
}

export type COption = {
  element: HTMLElement | string;
  url: string;
};

export default Container;
