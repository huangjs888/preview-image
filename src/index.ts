/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-30 15:20:31
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import { matrix3d, identity, each, type Transform } from './transform';
import Animation, { type Easing } from './animation';
import {
  ratioOffset,
  swipeDamping,
  performDamping,
  revokeDamping,
  isBetween,
  between,
  isNumber,
  execute,
  easingOptions,
} from './adjust';

function transition(
  this: ImageView,
  stop: boolean,
  transform: Transform,
  duration: number = easingOptions.bounce.duration,
  easing: Easing = easingOptions.bounce.fn,
) {
  return new Promise<void>((resolve) => {
    const sTransform = { ...(this._transform || {}) };
    // 先检查是否要进行动画（如果动画后的值和动画前完全一样，没必要进行过渡）
    let isAnimate = false;
    each(transform, (key, value) => {
      const sValue = sTransform[key];
      if (isNumber(sValue, value) && sValue !== value) {
        // 一旦判断可以执行动画，退出循环
        isAnimate = true;
        return false;
      }
    });
    if (isAnimate && this._animation) {
      const animation = new Animation({ duration, easing });
      this._animation.push({ animation, stop });
      animation.start((progress) => {
        each(transform, (key, value) => {
          const sValue = sTransform[key];
          if (this._transform && isNumber(sValue, value)) {
            this._transform[key] =
              ((value as number) - (sValue as number)) * progress +
              (sValue as number);
          }
        });
        this.element.style.setProperty(
          'transform',
          matrix3d(this._transform || {}),
        );
        if (progress === 1) {
          // 动画结束后删除
          if (this._animation) {
            const index = this._animation.findIndex(
              (a) => animation === a.animation,
            );
            this._animation.splice(index, 1);
          }
          resolve();
        }
      });
    }
  });
}

function adjustOffset(
  this: ImageView,
  ox: number,
  oy: number,
  vk: number,
  tk: number,
) {
  // 测微信得到的结论
  // 这个偏移量需要要向着边缘点发散
  const { width: cw, height: ch } = this.getContainerSize();
  const { width, height } = this.getElClientSize();
  const ew = width / tk;
  const eh = height / tk;
  const k = vk / tk;
  return [
    between(ew - (cw - ew) / (k - 1), [0, ew]) *
      ratioOffset(ox / ew, k, between(cw / ew, [1, 2])),
    between(eh - (ch - eh) / (k - 1), [0, eh]) *
      ratioOffset(oy / eh, k, between(ch / eh, [1, 2])),
  ];
  // 思路：对元素进行划线分界
  // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例k(eh/2k)作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
  // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去eh/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
  // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
  // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
  // 5，元素左右计算方式如同上下方式一样得到ox
}

const touchStart = function touchStart(this: ImageView) {
  this._startMoving = null;
  this._animation = (this._animation || []).filter(({ animation, stop }) => {
    // swipe的动画立即停止
    if (stop) {
      animation.stop();
      // 停止后过滤掉（即删除）
      return false;
    }
    // 不需要停止的动画会在动画结束后被删除
    return true;
  });
};
const touchMove = function touchMove(this: ImageView, e: GEvent) {
  if ((this._animation || []).length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const {
    point,
    moveAngle: _a = 0,
    moveScale: _k = 1,
    moveX: _x = 0,
    moveY: _y = 0,
  } = e;
  const { damping, rotation, scalation, translation } = this;
  const [translationX, translationY] = translation || [];
  const isRotateDamping = damping && damping.indexOf('rotate') !== -1;
  const isScaleDamping = damping && damping.indexOf('scale') !== -1;
  const isTranslateDamping = damping && damping.indexOf('translate') !== -1;
  let offset, transform;
  if (!this._startMoving) {
    const [cx, cy] = this.getContainerCenter();
    const {
      a: ta = 0,
      k: tk = 1,
      x: tx = 0,
      y: ty = 0,
    } = this._transform || {};
    offset = [point[0] - (cx + tx), point[1] - (cy + ty)];
    // 如果进入move的时候，元素正处于超出边界的状态，
    // 那么超出边界部分是做了Damping的，这里要恢复出原值，
    // 如此，move时，总超出部分进行总体Damping计算更准确。
    transform = {
      a: isRotateDamping ? revokeDamping(ta, execute(rotation)) : ta,
      k: isScaleDamping ? revokeDamping(tk, execute(scalation), true) : tk,
      x: isTranslateDamping ? revokeDamping(tx, execute(translationX, tk)) : tx,
      y: isTranslateDamping ? revokeDamping(ty, execute(translationY, tk)) : ty,
    };
    this._startMoving = { offset, transform };
  } else {
    offset = this._startMoving.offset;
    transform = this._startMoving.transform;
  }
  const { a: sa = 0, k: sk = 1, x: sx = 0, y: sy = 0 } = transform;
  const adjustRotate = isRotateDamping ? performDamping : between;
  const a = adjustRotate(sa + _a, execute(rotation));
  const adjustScale = isScaleDamping ? performDamping : between;
  const k = adjustScale(sk * _k, execute(scalation), true);
  const t = 1 - k / sk;
  const adjustTranlate = isTranslateDamping ? performDamping : between;
  const x = adjustTranlate(sx + offset[0] * t + _x, execute(translationX, k));
  const y = adjustTranlate(sy + offset[1] * t + _y, execute(translationY, k));
  transition.apply(this, [false, { a, k, x, y }, 0]);
};
const touchEnd = function touchEnd(this: ImageView, e: GEvent) {
  this._startMoving = null;
  if ((this._animation || []).length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const [cx, cy] = this.getContainerCenter();
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform || {};
  const offset = [e.point[0] - (cx + tx), e.point[1] - (cy + ty)];
  const { damping, rotation, scalation, translation } = this;
  const [translationX, translationY] = translation || [];
  const isTranslateDamping = damping && damping.indexOf('translate') !== -1;
  const a = between(ta, execute(rotation));
  const k = between(tk, execute(scalation));
  const d = 1 - k / tk;
  const x = between(
    (isTranslateDamping ? revokeDamping(tx, execute(translationX, tk)) : tx) +
      offset[0] * d,
    execute(translationX, k),
  );
  const y = between(
    (isTranslateDamping ? revokeDamping(ty, execute(translationY, tk)) : ty) +
      offset[1] * d,
    execute(translationY, k),
  );
  transition.apply(this, [false, { a, k, x, y }]);
};
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  if ((this._animation || []).length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { dblScale, rotation, scalation, translation } = this;
  const [translationX, translationY] = translation || [];
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform || {};
  const [cx, cy] = this.getContainerCenter();
  let ox = e.point[0] - (cx + tx);
  let oy = e.point[1] - (cy + ty);
  const { value, adjust } = execute(dblScale);
  const dk = between(value, execute(scalation));
  const bk = between(1, execute(scalation));
  let transform = identity();
  if (adjust) {
    if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
      [ox, oy] = adjustOffset.apply(this, [ox, oy, dk, tk]);
      const t = 1 - dk / tk;
      transform = {
        a: ta,
        k: dk,
        x: between(tx + ox * t, execute(translationX, dk)),
        y: between(ty + oy * t, execute(translationY, dk)),
      };
    } else {
      transform = {
        a: between(0, execute(rotation)),
        k: bk,
        x: between(0, execute(translationX, 1)),
        y: between(0, execute(translationY, 1)),
      };
    }
  } else {
    const k = (dk > bk && tk <= bk) || (dk < bk && tk >= bk) ? dk : bk;
    const t = 1 - k / tk;
    transform = {
      a: ta,
      k,
      x: between(tx + ox * t, execute(translationX, k)),
      y: between(ty + oy * t, execute(translationY, k)),
    };
  }
  transition.apply(this, [false, transform]);
};
const swipe = function swipe(this: ImageView, e: GEvent) {
  if ((this._animation || []).length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    const { width, height } = this.getContainerSize();
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    // 减速度为 0.003，这个需要测微信
    const { duration, inertiaX, inertiaY } = swipeComputed(0.003);
    const { damping, translation } = this;
    const [translation0, translation1] = translation || [];
    const isTranslateDamping = damping && damping.indexOf('translate') !== -1;
    const { k = 1, x = 0, y = 0 } = this._transform || {};
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationX = execute(translation0, k);
    if (isBetween(x, translationX)) {
      // 如果x在translationX范围内，那么x值一定是不含damping过的部分，可以直接使用
      // 调整x方向最终的惯性距离
      const swipeX = isTranslateDamping
        ? swipeDamping(
            x + inertiaX, // x方向最终位移
            (2 * inertiaX) / duration, // x方向初始速度
            translationX, // x方向位移范围
            width,
          )
        : between(x + inertiaX, translationX);
      // 判断惯性位移后是否超出边界
      const inBoundary = isBetween(swipeX, translationX);
      // 根据是否超出边界使用不同的easingOption
      const eOption = easingOptions[inBoundary ? 'swipe' : 'swipeBounce'];
      // x方向进行惯性位移
      transition
        .apply(this, [true, { x: swipeX }, eOption.duration, eOption.fn])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!inBoundary) {
            transition.apply(this, [
              true,
              { x: between(swipeX, translationX) },
            ]);
          }
        });
    } else {
      // 已经超出边界，不再进行惯性位移，直接归位
      transition.apply(this, [true, { x: between(x, translationX) }]);
    }
    // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationY = execute(translation1, k);
    if (isBetween(y, translationY)) {
      // 如果y在translationY范围内，那么y值一定是不含damping过的部分，可以直接使用
      // 调整y方向最终的惯性距离
      const swipeY = isTranslateDamping
        ? swipeDamping(
            y + inertiaY, // y方向最终位移
            (2 * inertiaY) / duration, // y方向初始速度
            translationY, // y方向位移范围
            height,
          )
        : between(y + inertiaY, translationY);
      // 判断惯性位移后是否超出边界
      const inBoundary = isBetween(swipeY, translationY);
      // 根据是否超出边界使用不同的easingOption
      const eOption = easingOptions[inBoundary ? 'swipe' : 'swipeBounce'];
      /// y方向进行惯性位移
      transition
        .apply(this, [true, { y: swipeY }, eOption.duration, eOption.fn])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!inBoundary) {
            transition.apply(this, [
              true,
              { y: between(swipeY, translationY) },
            ]);
          }
        });
    } else {
      // 如果已经在范围之外，就不再进行惯性位移，直接归位
      transition.apply(this, [true, { y: between(y, translationY) }]);
    }
  }
};

class ImageView {
  container: HTMLElement;
  element: HTMLElement;
  damping: Damping[] | null = null;
  dblScale: DblScale | (() => DblScale) | null = null; // 双击放大比例，如果是函数，调用函数获取
  rotation: number[] | (() => number[]) | null = null; // 旋转范围
  scalation: number[] | (() => number[]) | null = null; // 缩放范围
  translation: (number[] | (() => number[]))[] | null = null; // 平移范围
  _animation: Array<{ animation: Animation; stop: boolean }> | null = null; // 此刻正在进行的动画,stop:当前动画在触摸时是否可以停止
  _transform: Transform | null = null; // 手势操作时的变换对象
  _gesture: Gesture | null = null; // 手势对象
  _startMoving: {
    offset: number[]; // 初始偏移量
    transform: Transform; // 初始变换
  } | null = null; // 触摸移动时存储的初始值
  constructor({
    container,
    element,
    damping,
    dblScale,
    rotation,
    scalation,
    translation,
  }: IOption) {
    this.container = container;
    this.element = element;
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
    const gesture = new Gesture(this.container);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    this._transform = identity();
    this._animation = [];
    const [translationX, translationY] = this.translation || [];
    transition.apply(this, [
      false,
      {
        a: between(0, execute(this.rotation)),
        k: between(1, execute(this.scalation)),
        x: between(0, execute(translationX)),
        y: between(0, execute(translationY)),
      },
      0,
    ]);
  }
  destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
    this._startMoving = null;
    this._animation = null;
    this._transform = null;
    this.damping = null;
    this.dblScale = null;
    this.rotation = null;
    this.scalation = null;
    this.translation = null;
  }
  setDamping(damping?: Damping[]) {
    if (damping) {
      this.damping = damping;
      return;
    }
    this.damping = ['scale', 'translate']; // 如果不设置，默认只对缩放比例和位移进行阻尼
  }
  setDblScale(k?: DblScale | number) {
    // 如果直接传入数字，那么adjust为false，value为传入的数字
    if (k && isNumber(k) && k > 0) {
      this.dblScale = {
        adjust: false,
        value: +k,
      };
      return;
    }
    let adjust = true;
    if (k && typeof k !== 'number') {
      // 如果传入对象，且value是数字，那么adjust为传入的!!adjust，value为传入的value
      if (k.value && isNumber(k.value) && k.value > 0) {
        this.dblScale = {
          adjust: !!k.adjust,
          value: k.value,
        };
        return;
      }
      // 如果传入对象，且value不是数字，那么adjust只有传入false才是false，其它都是true
      adjust = k.adjust !== false;
    }
    // 如果传入的不是数字也不是对象，或者传入对象，但是对象里的value不是数字，那么value取下面的计算
    // adjust取上面的adjust（即除非对象里adjust确切传入了false，否则都默认为true）
    // 测微信得到的结论，双击放大比例是
    // 1，元素宽与容器宽之比，元素高与容器高之比的最大值
    // 2，元素实际宽与元素宽之比，元素实际高与元素高之比的最小值
    // 3，在1、2两个值和数值2这三个之中的最大值
    this.dblScale = () => {
      const { width: cw, height: ch } = this.getContainerSize();
      const { width: ew, height: eh } = this.getElClientSize();
      const { width: nw, height: nh } = this.getElNaturalSize();
      return {
        adjust,
        value: Math.max(
          2,
          Math.max(cw / ew, ch / eh),
          Math.min(nw / cw, nh / ch),
        ),
      };
    };
  }
  setRotation(a?: number[]) {
    if (a && isNumber(...a) && a[1] >= a[0]) {
      this.rotation = a; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，是不给旋转的
    this.rotation = () => [0, 0]; // 如果设置不合理，则取默认
  }
  setScalation(k?: number[]) {
    if (k && isNumber(...k) && k[1] >= k[0] && k[0] > 0) {
      this.scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
    this.scalation = () => [1, 2 * execute(this.dblScale).value]; // 如果设置不合理，则取默认
  }
  setTranslation(xy?: number[][]) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  }
  setXTranslation(x?: number[]) {
    if (!this.translation) {
      this.translation = [];
    }
    if (x && isNumber(...x) && x[1] >= x[0]) {
      this.translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this.translation[0] = (k: number = (this._transform || {}).k || 1) => {
      const { width: cw } = this.getContainerSize();
      const { width: ew } = this.getElClientSize();
      const bx = Math.max((ew * k - cw) / 2, 0);
      return [-bx, bx];
    };
  }
  setYTranslation(y?: number[]) {
    if (!this.translation) {
      this.translation = [];
    }
    if (y && isNumber(...y) && y[1] >= y[0]) {
      this.translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this.translation[1] = (k: number = (this._transform || {}).k || 1) => {
      const { height: ch } = this.getContainerSize();
      const { height: eh } = this.getElClientSize();
      const by = Math.max((eh * k - ch) / 2, 0);
      return [-by, by];
    };
  }
  isAnimating() {
    return (this._animation || []).length > 0;
  }
  getElClientSize() {
    // 获取目标元素初始化设置的宽高（不是进行缩放后的宽高，也不是原始宽高）
    const { clientWidth, clientHeight } = this.element;
    return { width: clientWidth, height: clientHeight };
  }
  getElNaturalSize() {
    // 获取目标元素的实际原始宽高（一般是img元素才有的）
    let { element } = this;
    if ('naturalWidth' in element && 'naturalHeight' in element) {
      return {
        width: (element as HTMLImageElement).naturalWidth,
        height: (element as HTMLImageElement).naturalHeight,
      };
    }
    return this.getElClientSize();
  }
  getContainerSize() {
    // 获取容器元素的原始宽高
    const { clientWidth, clientHeight } = this.container;
    return { width: clientWidth, height: clientHeight };
  }
  getContainerCenter() {
    // 获取容器中心点位置
    const { left, top, width, height } = this.container.getBoundingClientRect();
    return [left + width / 2, top + height / 2];
  }
  // 负数顺时针，正数逆时针
  rotate(a: number) {
    // 在原来的基础上再旋转 a
    return this.transform({ a });
  }
  // 负数顺时针，正数逆时针
  rotateTo(a: number) {
    // 直接旋转到 a
    return this.transformTo({ a });
  }
  scale(k: number, point?: number[]) {
    // 在原来的基础上相对 point 点缩放 k
    return this.transform({ k }, point);
  }
  scaleTo(k: number, point?: number[]) {
    // 直接相对 point 点缩放到 k
    return this.transformTo({ k }, point);
  }
  translate(x: number, y: number) {
    // 在原来的基础上平移 x, y
    return this.transform({ x, y });
  }
  translateTo(x: number, y: number) {
    // 直接平移到 x, y
    return this.transformTo({ x, y });
  }
  translateX(x: number) {
    // 在原来的基础上横向平移 x
    return this.transform({ x });
  }
  translateXTo(x: number) {
    // 直接横向平移到 x
    return this.transformTo({ x });
  }
  translateY(y: number) {
    // 在原来的基础上竖向平移  y
    return this.transform({ y });
  }
  translateYTo(y: number) {
    // 直接竖向平移到 y
    return this.transformTo({ y });
  }
  transform(transform: Transform, point?: number[]) {
    // 以point为聚焦点，在原来的基础上变换transform
    const {
      a: ta = 0,
      k: tk = 1,
      x: tx = 0,
      y: ty = 0,
    } = this._transform || {};
    let { a, k, x, y } = transform;
    if (isNumber(a)) {
      a = (a as number) + ta;
    }
    if (isNumber(k)) {
      k = (k as number) * tk;
    }
    if (isNumber(x)) {
      x = (x as number) + tx;
    }
    if (isNumber(y)) {
      y = (y as number) + ty;
    }
    return this.transformTo({ a, k, x, y }, point);
  }
  transformTo(transform: Transform, point?: number[]) {
    if ((this._animation || []).length > 0) {
      // 若存在正在进行的渐变动画，则不做任何操作
      return;
    }
    // 以point为聚焦点，直接变换到transform
    const { k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform || {};
    const { rotation, scalation, translation } = this;
    const [translationX, translationY] = translation || [];
    let { a, k, x, y } = transform;
    if (isNumber(a)) {
      a = between(a as number, execute(rotation));
    }
    if (isNumber(k)) {
      k = between(k as number, execute(scalation));
      const [cx, cy] = this.getContainerCenter();
      let offset = [0, 0];
      if (point && isNumber(...point)) {
        offset = [point[0] - (cx + tx), point[1] - (cy + ty)];
      }
      const d = 1 - k / tk;
      const ox = offset[0] * d;
      const oy = offset[1] * d;
      if (isNumber(x)) {
        x = between((x as number) + ox, execute(translationX, k));
      } else {
        x = between(tx + ox, execute(translationX, k));
      }
      if (isNumber(y)) {
        y = between((y as number) + oy, execute(translationY, k));
      } else {
        y = between(ty + oy, execute(translationY, k));
      }
    } else {
      if (isNumber(x)) {
        x = between(x as number, execute(translationX, tk));
      }
      if (isNumber(y)) {
        y = between(y as number, execute(translationY, tk));
      }
    }
    return transition.apply(this, [false, { a, k, x, y }]);
  }
}
export type Damping = 'rotate' | 'scale' | 'translate';
export type DblScale = { adjust?: boolean; value?: number };
export type IOption = {
  container: HTMLElement;
  element: HTMLElement;
  dblScale?: number | DblScale; // 双击放大比例
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  damping?: Damping[]; // 哪些操作超出边界可以进行阻尼效果，如果对rotate,scale,translate设置了无边界限制(Infinity)，则阻尼无效
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转20度和顺时针可旋转10度
};

export default ImageView;
