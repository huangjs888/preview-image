/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-25 13:08:28
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import { matrix3d, identity, each, type Transform } from './transform';
import Animation, { type Easing } from './animation';
import {
  adjustOffset,
  swipeDamping,
  performDamping,
  revokeDamping,
  isBetween,
  between,
  isNumber,
  execute,
  easingOptions,
} from './adjust';

// 应该使用增量来计算，不应该使用一步到位的量
// 因为多个操作应该是累计的结果，不应该是覆盖
function transition(
  this: ImageView,
  stop: boolean,
  transform: Transform, // 增量transform
  duration: number = easingOptions.bounce.duration,
  easing: Easing = easingOptions.bounce.fn,
) {
  return new Promise<void>((resolve) => {
    let isAnimate = true;
    // 先检查是否要进行动画（如果transform内的值都是0或者不存在，或者是个无效的参数，那就没必要进行动画）
    each(transform, (key, value) => {
      const _value = this._transform[key];
      if (_value && value && value !== 0) {
        isAnimate = true;
        return false;
      }
    });

    if (isAnimate) {
      const animation = new Animation({ duration, easing });
      this._animation.push({ animation, stop });
      animation.start((progress) => {
        each(transform, (key, value) => {
          const _value = this._transform[key];
          if (_value && value && value !== 0) {
            this._transform[key] += value * progress;
          }
        });
        this.element.style.setProperty('transform', matrix3d(this._transform));
        if (progress === 1) {
          // 动画结束后删除
          const index = this._animation.findIndex(
            (a) => animation === a.animation,
          );
          this._animation.splice(index, 1);
          resolve();
        }
        console.log(animation.kkk, this._transform);
        console.log(document.images[0].getBoundingClientRect());
      });
    }
  });
}

const touchStart = function touchStart(this: ImageView) {
  this._startMoving = null;
  this._animation = this._animation.filter(({ animation, stop }) => {
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
  if (this._animation.length > 0) {
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
  const { rotation, scalation, translation } = this;
  const [translationX, translationY] = translation;
  let offset, transform;
  if (!this._startMoving) {
    const [cx, cy] = this.getContainerCenter();
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
    offset = [point[0] - (cx + tx), point[1] - (cy + ty)];
    // 如果进入move的时候，元素正处于超出边界的状态，
    // 那么超出边界部分是做了Damping的，这里要恢复出原值，
    // 如此，move时，总超出部分进行总体Damping计算更准确。
    transform = {
      a: revokeDamping(ta, rotation),
      k: revokeDamping(tk, scalation, true),
      x: revokeDamping(tx, execute(translationX, tk)),
      y: revokeDamping(ty, execute(translationY, tk)),
    };
    this._startMoving = { offset, transform };
  } else {
    offset = this._startMoving.offset;
    transform = this._startMoving.transform;
  }
  const { a: sa = 0, k: sk = 1, x: sx = 0, y: sy = 0 } = transform;
  // 这里对a做一个特殊处理：即禁止旋转时，不做Damping效果
  const a = performDamping(sa + _a, rotation);
  const k = performDamping(sk * _k, scalation, true);
  const d = 1 - k / sk;
  const x = performDamping(sx + offset[0] * d + _x, execute(translationX, k));
  const y = performDamping(sy + offset[1] * d + _y, execute(translationY, k));
  transition.apply(this, [false, { a, k, x, y }, 0]);
};
const touchEnd = function touchEnd(this: ImageView, e: GEvent) {
  this._startMoving = null;
  if (this._animation.length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const [cx, cy] = this.getContainerCenter();
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  const offset = [e.point[0] - (cx + tx), e.point[1] - (cy + ty)];
  const { rotation, scalation, translation } = this;
  const [translationX, translationY] = translation;
  const a = between(ta, rotation);
  const k = between(tk, scalation);
  const d = 1 - k / tk;
  const x = between(
    revokeDamping(tx, execute(translationX, tk)) + offset[0] * d,
    execute(translationX, k),
  );
  const y = between(
    revokeDamping(ty, execute(translationY, tk)) + offset[1] * d,
    execute(translationY, k),
  );
  transition.apply(this, [false, { a, k, x, y }]);
};
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  if (this._animation.length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { dblScale, rotation, scalation, translation } = this;
  const [translationX, translationY] = translation;
  const k = between(execute(dblScale), scalation);
  let transform = identity();
  // 只有双击缩放比例和当前缩放比例相反的时候才进行双击操作，否则为归位操作
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  if ((k > 1 && tk <= 1) || (k < 1 && tk >= 1)) {
    const [cx, cy] = this.getContainerCenter();
    const { width: cw, height: ch } = this.getContainerSize();
    // 这个偏移量需要要向着边缘点发散
    // 1/3是占比这个值还需要测测微信，似乎与宽高比有关，并不是固定的，这个需要测微信
    const ox = adjustOffset(
      e.point[0] - (cx + tx),
      (cx * tk) / 6,
      (cw * tk) / 2,
    );
    const oy = adjustOffset(
      e.point[1] - (cy + ty),
      (cx * tk) / 6,
      (ch * tk) / 2,
    );
    const d = 1 - k / tk;
    const x = between(tx + ox * d, execute(translationX, k));
    const y = between(ty + oy * d, execute(translationY, k));
    transform = { a: ta, k, x, y };
  } else {
    transform = {
      a: between(0, rotation),
      k: between(1, scalation),
      x: between(0, execute(translationX, 1)),
      y: between(0, execute(translationY, 1)),
    };
  }
  transition.apply(this, [false, transform]);
};
const swipe = function swipe(this: ImageView, e: GEvent) {
  if (this._animation.length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    const { width, height } = this.getContainerSize();
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    // 减速度为 0.003，这个需要测微信
    const { duration, inertiaX, inertiaY } = swipeComputed(0.003);
    const { k = 1, x = 0, y = 0 } = this._transform;
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationX = execute(this.translation[0], k);
    if (isBetween(x, translationX)) {
      // 如果x在translationX范围内，那么x值一定是不含damping过的部分，可以直接使用
      // 调整x方向最终的惯性距离
      const swipeX = swipeDamping(
        x + inertiaX, // x方向最终位移
        (2 * inertiaX) / duration, // x方向初始速度
        translationX, // x方向位移范围
        width,
      );
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
    const translationY = execute(this.translation[1], k);
    if (isBetween(y, translationY)) {
      // 如果y在translationY范围内，那么y值一定是不含damping过的部分，可以直接使用
      // 调整y方向最终的惯性距离
      const swipeY = swipeDamping(
        y + inertiaY, // y方向最终位移
        (2 * inertiaY) / duration, // y方向初始速度
        translationY, // y方向位移范围
        height,
      );
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
  dblScale: number | (() => number) = 1; // 双击放大比例，如果是函数，调用函数获取
  rotation: number[] = []; // 旋转范围
  scalation: number[] = []; // 缩放范围
  translation: (number[] | ((k: number) => number[]))[] = []; // 平移范围
  _animation: Array<{ animation: Animation; stop: boolean }> = []; // 此刻正在进行的动画,stop:当前动画在触摸时是否可以停止
  _transform: Transform = identity(); // 手势操作时的变换对象
  _gesture: Gesture | null = null; // 手势对象
  _startMoving: {
    offset: number[]; // 初始偏移量
    transform: Transform; // 初始变换
  } | null = null; // 触摸移动时存储的初始值
  constructor({
    container,
    element,
    dblScale,
    rotation,
    scalation,
    translation,
  }: IOption) {
    this.container = container;
    this.element = element;
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移
    const gesture = new Gesture(this.container);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    transition.apply(this, [
      false,
      {
        a: between(0, this.rotation),
        k: between(1, this.scalation),
        x: between(0, execute(this.translation[0], 1)),
        y: between(0, execute(this.translation[1], 1)),
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
  }
  setDblScale(k?: number) {
    if (k && isNumber(k) && k > 0) {
      this.dblScale = k;
      return;
    }
    this.dblScale = () => {
      const { width: cw, height: ch } = this.getContainerSize();
      const { width: ew, height: eh } = this.getElementSize();
      // 比例 3，这个需要测微信
      return Math.max(3, cw / ew, ch / eh);
    };
  }
  setRotation(a?: number[]) {
    if (a && isNumber(...a)) {
      const a0 = a[0] % 360;
      const a1 = a[1] % 360;
      if (a1 >= a0) {
        this.rotation = [a0, a1]; // 最大范围 -360 到 +360
        return;
      }
    }
    this.rotation = [0, 0]; // 如果设置不合理，则取默认
  }
  setScalation(k?: number[]) {
    if (k && isNumber(...k) && k[1] >= k[0] && k[0] > 0) {
      this.scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 比例1没疑问，比例 6，这个需要测微信
    this.scalation = [1, 6]; // 如果设置不合理，则取默认
  }
  setTranslation(xy?: number[][]) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  }
  setXTranslation(x?: number[]) {
    if (x && isNumber(...x) && x[1] >= x[0]) {
      this.translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 根据给定的缩放比例计算x边界范围
    this.translation[0] = (k: number) => {
      const { width: cw } = this.getContainerSize();
      const { width: ew } = this.getElementSize();
      const bx = Math.max((ew * k - cw) / 2, 0);
      return [-bx, bx];
    };
  }
  setYTranslation(y?: number[]) {
    if (y && isNumber(...y) && y[1] >= y[0]) {
      this.translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 根据给定的缩放比例计算y边界范围
    this.translation[1] = (k: number) => {
      const { height: ch } = this.getContainerSize();
      const { height: eh } = this.getElementSize();
      const by = Math.max((eh * k - ch) / 2, 0);
      return [-by, by];
    };
  }
  getElementSize() {
    // 获取目标元素的原始宽高（不是缩放后的宽高）
    const { clientWidth, clientHeight } = this.element;
    return { width: clientWidth, height: clientHeight };
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
  rotate(a: number) {
    // 在原来的基础上再旋转 a
    return this.transform({ a });
  }
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
    this.transform({ x, y });
  }
  translateTo(x: number, y: number) {
    // 直接平移到 x, y
    this.transformTo({ x, y });
  }
  translateX(x: number) {
    // 在原来的基础上横向平移 x
    this.transform({ x });
  }
  translateXTo(x: number) {
    // 直接横向平移到 x
    this.transformTo({ x });
  }
  translateY(y: number) {
    // 在原来的基础上竖向平移  y
    this.transform({ y });
  }
  translateYTo(y: number) {
    // 直接竖向平移到 y
    this.transformTo({ y });
  }
  transformTo(transform: Transform, point?: number[]) {
    // 直接变换到transform，此时要停止正在变换的对象
    // 以point为聚焦点，在原来的基础上变换transform
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
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
    this.transformTo({ a, k, x, y }, point);
  }
  transform(transform: Transform, point?: number[]) {
    // 以point为聚焦点，直接变换到transform
    const [cx, cy] = this.getContainerCenter();
    const { k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
    let offset = [0, 0];
    if (point && isNumber(...point)) {
      offset = [point[0] - (cx + tx), point[1] - (cy + ty)];
    }
    const { rotation, scalation, translation } = this;
    const [translationX, translationY] = translation;
    let { a, k, x, y } = transform;
    if (isNumber(a)) {
      a = between(a as number, rotation);
    }
    /* if (isNumber(k)) {
      k = between(k as number, scalation);
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
    } */
    let kkk = [0, 0];
    if (isNumber(k)) {
      k = between(k as number, scalation);
      const d = 1 - k / tk;
      kkk = [offset[0] * d, offset[1] * d];
    }
    if (isNumber(x)) {
      x = between(x as number, execute(translationX, tk));
    }
    if (isNumber(y)) {
      y = between(y as number, execute(translationY, tk));
    }

    transition.apply(this, [
      false,
      { a, k, x, y },
      easingOptions.bounce.duration,
      easingOptions.bounce.fn,
      kkk,
    ]);
  }
}

export type IOption = {
  container: HTMLElement;
  element: HTMLElement;
  dblScale?: number; // 双击放大比例
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转10度和顺时针可旋转20度
};

export default ImageView;
