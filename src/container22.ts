import Gesture, { type GEvent } from './gesture';
import Image from './image';
import {
  setStyle,
  proxyImage,
  loadImage,
  performDamping,
  revokeDamping,
  isBetween,
  between,
  easeOutQuad,
} from './adjust';

proxyImage();

const touchStart = function touchStart(this: Container, e: GEvent) {
  const { _image: image, _gesture: gesture } = this;
  if (!image || !gesture) {
    return;
  }
  if (e.sourceEvent.touches.length > 1 && this._fingers === 0) {
    // 当单指未触发移动，接着放了另外的手指，则认为开启了双指操作，手指为2个
    this._fingers = 2;
  }
  if (image.transitionCancel() > 0) {
    // 曲线救国 1：
    // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
    // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
    gesture._firstPoint = null;
    gesture._preventSingleTap = true;
  }
};
const touchMove = function touchMove(this: Container, e: GEvent) {
  const { _image: image, _gesture: gesture } = this;
  if (!image || !gesture) {
    return;
  }
  if (e.sourceEvent.touches.length === 1 && this._fingers === 0) {
    // 当触发移动时，若只有一个手指在界面上，就认为一直只有一个手指，即使后面再放手指
    this._fingers = 1;
  }
  if (image.isTransitioning()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { point, angle = 0, scale = 1, deltaX = 0, deltaY = 0 } = e;
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = image.getTransform();
  let transformRaw = {};
  if (this._fingers === 1) {
    // _fingers为1的时候，只进行位移，不进行旋转和缩放，相当于单指移动
    // 曲线救国 2：
    // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
    // 这里拿出来是为了阻止双指移动时改变了_rotateAngle类型，仅仅是让touchEnd的时候可以取消动画
    gesture._rotateAngle = null;
    let adjustTranlate = between;
    let _tx = tx;
    let _ty = ty;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (image.isDamping('translate')) {
      _tx = revokeDamping(tx, image.getXTranslation());
      _ty = revokeDamping(ty, image.getYTranslation());
      adjustTranlate = performDamping;
    }
    transformRaw = {
      a: ta,
      k: tk,
      x: adjustTranlate(_tx + deltaX, image.getXTranslation()),
      y: adjustTranlate(_ty + deltaY, image.getYTranslation()),
    };
  } else {
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    let adjustRotate = between;
    let _ta = ta;
    if (image.isDamping('rotate')) {
      _ta = revokeDamping(ta, image.getRotation());
      adjustRotate = performDamping;
    }
    let adjustScale = between;
    let _tk = tk;
    if (image.isDamping('scale')) {
      _tk = revokeDamping(tk, image.getScalation(), true);
      adjustScale = performDamping;
    }
    let adjustTranlate = between;
    let _tx = tx;
    let _ty = ty;
    if (image.isDamping('translate')) {
      _tx = revokeDamping(tx, image.getXTranslation());
      _ty = revokeDamping(ty, image.getYTranslation());
      adjustTranlate = performDamping;
    }
    // 把原值进行各项变化，再进行总体阻尼计算
    const a = adjustRotate(_ta + angle, image.getRotation());
    const k = adjustScale(_tk * scale, image.getScalation(), true);
    const [ox, oy] = image.computeOffset(point, k);
    const x = adjustTranlate(_tx + ox + deltaX, image.getXTranslation(k));
    const y = adjustTranlate(_ty + oy + deltaY, image.getYTranslation(k));
    transformRaw = { a, k, x, y };
  }
  image.transitionRun(transformRaw, { duration: 0 });
};
const touchEnd = function touchEnd(this: Container, e: GEvent) {
  const { _image: image, _gesture: gesture } = this;
  if (!image || !gesture) {
    return;
  }
  if (e.sourceEvent.touches.length === 0 && this._fingers !== 0) {
    // 手指全部抬起时，手指数目置为0
    this._fingers = 0;
  }
  if (image.isTransitioning()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  let { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = image.getTransform();
  // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
  if (image.isDamping('rotate')) {
    ta = revokeDamping(ta, image.getRotation());
  }
  if (image.isDamping('scale')) {
    tk = revokeDamping(tk, image.getScalation(), true);
  }
  if (image.isDamping('translate')) {
    tx = revokeDamping(tx, image.getXTranslation());
    ty = revokeDamping(ty, image.getYTranslation());
  }
  image.transformTo(
    {
      a: ta,
      k: tk,
      x: tx,
      y: ty,
    },
    e.point,
    {
      // 曲线救国 3：
      // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
      // 这里拿出来是为了判断抬起之前是否进行过双指移动行为（如果未移动或单指是null），从而判断是否可以取消动画
      cancel: typeof gesture._rotateAngle !== 'number',
    },
  );
};
const doubleTap = function doubleTap(this: Container, e: GEvent) {
  const { _image: image, _gesture: gesture } = this;
  if (!image || !gesture) {
    return;
  }
  if (image.isTransitioning()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  // 这三个比例都是用保留三位小数的结果进行比较
  // 其实这里的3应该用1/屏幕的宽高算出的小数位数
  // 此刻比例和位移
  const tk = image.getTransform().k || 1;
  // 双击变化的比例
  const dk = between(image.getDblScale(), image.getScalation());
  // 再次双击恢复的比例（初始比例）
  const bk = between(1, image.getScalation());
  // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
  // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
  if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
    if (image.getDblAdjust()) {
      // 需要调整的情况，自己算偏移量，并且旋转置为0
      const [ox, oy] = image.computeOffset(e.point, dk, image.getDblAdjust());
      const { x: tx = 0, y: ty = 0 } = image.getTransform();
      image.transformTo(
        { a: 0, k: dk, x: tx + ox, y: ty + oy },
        { cancel: false },
      );
    } else {
      // 交给transformTo
      image.transformTo({ k: dk }, e.point, { cancel: false });
    }
  } else {
    // 再次双击恢复
    if (image.getDblAdjust()) {
      // 需要调整的情况，置为初始状态
      image.transformTo({ a: 0, k: bk, x: 0, y: 0 }, { cancel: false });
    } else {
      // 交给transformTo
      image.transformTo({ k: bk }, e.point, { cancel: false });
    }
  }
};
const swipe = function swipe(this: Container, e: GEvent) {
  const { _image: image, _gesture: gesture } = this;
  if (!image || !gesture) {
    return;
  }
  if (image.isTransitioning()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    const { clientWidth, clientHeight } = this.element;
    const { x: tx = 0, y: ty = 0 } = image.getTransform();
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    // 减速度为 0.003，这个需要测微信
    const { duration, stretchX, stretchY } = swipeComputed(
      0.003,
      velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
    );
    const _duration = Math.max(1200, Math.min(duration, 2500));
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationX = image.getXTranslation();
    if (isBetween(tx, translationX)) {
      let x = tx + stretchX;
      let t = _duration;
      if (!isBetween(x, translationX)) {
        x = between(x, translationX);
        let ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        if (image.isDamping('translate')) {
          const v = ratio * ((2 * Math.abs(stretchX)) / duration);
          x += clientWidth * Math.min(v / 20, 1 / 4) * (stretchX > 0 ? 1 : -1);
          ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        }
        t = Math.max(t * (1 - ratio), 400);
      }
      // x方向进行惯性位移
      image
        .transitionRun({ x }, { easing: easeOutQuad, duration: t })
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!isBetween(x, translationX)) {
            image.transitionRun({ x: between(x, translationX) });
          }
        });
    } else {
      // 直接归位
      image.transitionRun({ x: between(tx, translationX) });
    }
    // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationY = image.getYTranslation();
    if (isBetween(ty, translationY)) {
      let y = ty + stretchY;
      let t = _duration;
      if (!isBetween(y, translationY)) {
        y = between(y, translationY);
        let ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        if (image.isDamping('translate')) {
          const v = ratio * ((2 * Math.abs(stretchY)) / duration);
          y += clientHeight * Math.min(v / 20, 1 / 4) * (stretchY > 0 ? 1 : -1);
          ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        }
        t = Math.max(t * (1 - ratio), 400);
      }
      // y方向进行惯性位移
      image
        .transitionRun({ y }, { easing: easeOutQuad, duration: t })
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!isBetween(y, translationY)) {
            image.transitionRun({ y: between(y, translationY) });
          }
        });
    } else {
      // 直接归位
      image.transitionRun({ y: between(ty, translationY) });
    }
  }
};

class Container {
  element: HTMLElement;
  _image: Image | null = null;
  _gesture: Gesture | null = null; // 手势对象
  _fingers: number = 0; // 当单指放上去移动之后，再放手指移动，不会出现双指缩放旋转，会连续移动（一种感觉效果而已）
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
