/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-25 15:37:08
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import Transition, { TAProperty, TAIOptions } from './transition';
import Transform, { type TransformRaw } from './transform';
import {
  ratioOffset,
  performDamping,
  revokeDamping,
  isBetween,
  between,
  execute,
  easeOutQuad,
  easeOutQuart,
} from './adjust';

function transition(
  this: ImageView,
  transformRaw: TransformRaw,
  options: TAIOptions = {},
) {
  const deltaValue: TransformRaw = {};
  const precision: TransformRaw = {};
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  const { a, k, x, y } = transformRaw;
  if (typeof a === 'number') {
    deltaValue.a = (this._transform.a = a) - ta;
    // 角度精度按照屏幕尺寸一般暂时设置为0.001
    precision.a = 0.001;
  }
  if (typeof k === 'number') {
    deltaValue.k = (this._transform.k = k) - tk;
    // 缩放精度按照屏幕尺寸一般暂时设置为0.001
    precision.k = 0.001;
  }
  if (typeof x === 'number') {
    deltaValue.x = (this._transform.x = x) - tx;
    // 像素精度都在1px
    precision.x = 1;
  }
  if (typeof y === 'number') {
    deltaValue.y = (this._transform.y = y) - ty;
    // 像素精度都在1px
    precision.y = 1;
  }
  return this._transition
    .apply(deltaValue, {
      precision,
      duration: 400,
      easing: easeOutQuart,
      cancel: true,
      ...options,
    })
    .then((value) => {
      if (!this._transition.transitioning()) {
        // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
        this._transition.bind(this._transform.toRaw());
      }
      return value;
    });
}
const touchStart = function touchStart(this: ImageView, e: GEvent) {
  if (e.sourceEvent.touches.length > 1) {
    // 当单指未触发移动，接着放了另外的手指，则认为开启了双指操作，手指为2个
    if (this._fingers === 0) {
      this._fingers = 2;
    }
  }
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  this._transition.cancel().forEach((value) => {
    // 取消动画（返回值是动画未执行的部分）后应该把this._transform内的值减掉还未执行的部分
    Object.keys(value).forEach((key) => {
      const val = value[key];
      if (key === 'a') {
        this._transform.a = ta - val;
      } else if (key === 'k') {
        this._transform.k = tk - val;
      } else if (key === 'x') {
        this._transform.x = tx - val;
      } else if (key === 'y') {
        this._transform.y = ty - val;
      }
    });
    // 曲线救国 1：
    // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
    // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
    this._gesture._firstPoint = null;
    this._gesture._preventSingleTap = true;
  });
};
const touchMove = function touchMove(this: ImageView, e: GEvent) {
  if (e.sourceEvent.touches.length === 1 && this._fingers === 0) {
    // 当触发移动时，若只有一个手指在界面上，就认为一直只有一个手指，即使后面再放手指
    this._fingers = 1;
  }
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { point, angle = 0, scale = 1, deltaX = 0, deltaY = 0 } = e;
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  const { rotation, scalation, translation } = this;
  const [translationX, translationY] = translation;
  let transformRaw: TransformRaw = {};
  if (this._fingers === 1) {
    // _fingers为1的时候，只进行位移，不进行旋转和缩放，相当于单指移动
    // 曲线救国 2：
    // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
    // 这里拿出来是为了阻止双指移动时改变了_rotateAngle类型，仅仅是让touchEnd的时候可以取消动画
    this._gesture._rotateAngle = null;
    let adjustTranlate = between;
    let _tx = tx;
    let _ty = ty;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('translate')) {
      _tx = revokeDamping(tx, execute(translationX, tk));
      _ty = revokeDamping(ty, execute(translationY, tk));
      adjustTranlate = performDamping;
    }
    transformRaw = {
      a: ta,
      k: tk,
      x: adjustTranlate(_tx + deltaX, execute(translationX)),
      y: adjustTranlate(_ty + deltaY, execute(translationY)),
    };
  } else {
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    let adjustRotate = between;
    let _ta = ta;
    if (this.isDamping('rotate')) {
      _ta = revokeDamping(ta, execute(rotation));
      adjustRotate = performDamping;
    }
    let adjustScale = between;
    let _tk = tk;
    if (this.isDamping('scale')) {
      _tk = revokeDamping(tk, execute(scalation), true);
      adjustScale = performDamping;
    }
    let adjustTranlate = between;
    let _tx = tx;
    let _ty = ty;
    if (this.isDamping('translate')) {
      _tx = revokeDamping(tx, execute(translationX, tk));
      _ty = revokeDamping(ty, execute(translationY, tk));
      adjustTranlate = performDamping;
    }
    // 把原值进行各项变化，再进行总体阻尼计算
    const a = adjustRotate(_ta + angle, execute(rotation));
    const k = adjustScale(_tk * scale, execute(scalation), true);
    const [ox, oy] = this.getCenterOffset(point, k);
    const x = adjustTranlate(_tx + ox + deltaX, execute(translationX, k));
    const y = adjustTranlate(_ty + oy + deltaY, execute(translationY, k));
    transformRaw = { a, k, x, y };
  }
  // 这里移动时不需要动画，可以直接进行绑定赋值
  this._transform = new Transform(transformRaw);
  this._transition.bind(transformRaw);
};
const touchEnd = function touchEnd(this: ImageView, e: GEvent) {
  if (e.sourceEvent.touches.length === 0 && this._fingers !== 0) {
    // 手指全部抬起时，手指数目置为0
    this._fingers = 0;
  }
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { rotation, scalation, translation } = this;
  const [translationX, translationY] = translation;
  let { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
  // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
  if (this.isDamping('rotate')) {
    ta = revokeDamping(ta, execute(rotation));
  }
  if (this.isDamping('scale')) {
    tk = revokeDamping(tk, execute(scalation), true);
  }
  if (this.isDamping('translate')) {
    tx = revokeDamping(tx, execute(translationX, tk));
    ty = revokeDamping(ty, execute(translationY, tk));
  }
  this.transformTo(
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
      cancel: typeof this._gesture._rotateAngle !== 'number',
    },
  );
};
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { dblScale, scalation } = this;
  const { value, adjust } = execute(dblScale);
  // 这三个比例都是用保留三位小数的结果进行比较
  // 其实这里的3应该用1/屏幕的宽高算出的小数位数
  // 此刻比例和位移
  const tk = this._transform.k || 1;
  // 双击变化的比例
  const dk = between(value, execute(scalation));
  // 再次双击恢复的比例（初始比例）
  const bk = between(1, execute(scalation));
  // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
  // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
  if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
    if (adjust) {
      // 需要调整的情况，自己算偏移量，并且旋转置为0
      const [ox, oy] = this.getCenterOffset(e.point, dk, adjust);
      const { x: tx = 0, y: ty = 0 } = this._transform;
      this.transformTo({ a: 0, k: dk, x: tx + ox, y: ty + oy });
    } else {
      // 交给transformTo
      this.transformTo({ k: dk }, e.point);
    }
  } else {
    // 再次双击恢复
    if (adjust) {
      // 需要调整的情况，置为初始状态
      this.transformTo({ a: 0, k: bk, x: 0, y: 0 });
    } else {
      // 交给transformTo
      this.transformTo({ k: bk }, e.point);
    }
  }
};
const swipe = function swipe(this: ImageView, e: GEvent) {
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    const { width, height } = this.getContainerSize();
    const { k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    // 减速度为 0.003，这个需要测微信
    const { duration, stretchX, stretchY } = swipeComputed(
      0.003,
      velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
    );
    const _duration = Math.max(1200, Math.min(duration, 2500));
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationX = execute(this.translation[0], tk);
    if (isBetween(tx, translationX)) {
      let x = tx + stretchX;
      let t = _duration;
      if (!isBetween(x, translationX)) {
        x = between(x, translationX);
        let ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        if (this.isDamping('translate')) {
          const v = ratio * ((2 * Math.abs(stretchX)) / duration);
          x += width * Math.min(v / 20, 1 / 4) * (stretchX > 0 ? 1 : -1);
          ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        }
        t = Math.max(t * (1 - ratio), 400);
      }
      // x方向进行惯性位移
      transition
        .apply(this, [{ x }, { easing: easeOutQuad, duration: t }])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!isBetween(x, translationX)) {
            transition.apply(this, [{ x: between(x, translationX) }]);
          }
        });
    } else {
      // 直接归位
      transition.apply(this, [{ x: between(tx, translationX) }]);
    }
    // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationY = execute(this.translation[1], tk);
    if (isBetween(ty, translationY)) {
      let y = ty + stretchY;
      let t = _duration;
      if (!isBetween(y, translationY)) {
        y = between(y, translationY);
        let ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        if (this.isDamping('translate')) {
          const v = ratio * ((2 * Math.abs(stretchY)) / duration);
          y += height * Math.min(v / 20, 1 / 4) * (stretchY > 0 ? 1 : -1);
          ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        }
        t = Math.max(t * (1 - ratio), 400);
      }
      // y方向进行惯性位移
      transition
        .apply(this, [{ y }, { easing: easeOutQuad, duration: t }])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!isBetween(y, translationY)) {
            transition.apply(this, [{ y: between(y, translationY) }]);
          }
        });
    } else {
      // 直接归位
      transition.apply(this, [{ y: between(ty, translationY) }]);
    }
  }
};

class ImageView {
  container: HTMLElement;
  element: HTMLElement;
  damping: Damping[] = []; // 可以进行阻尼的变换
  dblScale: DblScale | (() => DblScale) = {}; // 双击放大比例和是否调整放大时的中心点
  rotation: number[] | (() => number[]) = []; // 旋转范围
  scalation: number[] | (() => number[]) = []; // 缩放范围
  translation: (number[] | (() => number[]))[] = []; // 平移范围
  _fingers: number = 0; // 当单指放上去移动之后，再放手指移动，不会出现双指缩放旋转，会连续移动（一种感觉效果而已）
  _gesture: Gesture; // 手势对象
  _transform: Transform; // 当前手势操作之后的变换对象
  _transition: Transition; // 当前渐变对象
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
    const a = between(0, execute(this.rotation)); // 初始角度a
    const k = between(1, execute(this.scalation)); // 初始比例k
    const x = between(0, execute(this.translation[0], k)); // 初始位移x
    const y = between(0, execute(this.translation[1], k)); //初始位移y
    this._transform = new Transform({ a, k, x, y });
    // 创建过渡
    this._transition = new Transition({
      element: this.element,
      propertyName: 'transform',
      propertyValue: new (class extends TAProperty {
        toString() {
          // 这里注意，在不存在任何过渡动画的时候，这里的this.value应该和上面的this._transform内的每项值应该是相等的
          // 但是由于 0.1+0.2!==0.3 的问题，导致经过各种计算后，其值并不是完全相等，存在极小的精度问题
          return new Transform(this.value).toString();
        }
      })(this._transform.toRaw()),
    });
    // 绑定手势
    const gesture = new Gesture(this.container);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
  }
  destory() {
    // 销毁手势事件
    this._gesture.destory();
  }
  isDamping(key: Damping) {
    return this.damping && this.damping.indexOf(key) !== -1;
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
    if (typeof k === 'number' && k > 0) {
      this.dblScale = {
        adjust: false,
        value: k,
      };
      return;
    }
    let adjust = true;
    if (k && typeof k !== 'number') {
      // 如果传入对象，且value是数字，那么adjust为传入的!!adjust，value为传入的value
      if (typeof k.value === 'number' && k.value > 0) {
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
    if (
      a &&
      typeof a[0] === 'number' &&
      typeof a[1] === 'number' &&
      a[1] >= a[0]
    ) {
      this.rotation = a; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，是不给旋转的
    this.rotation = () => [0, 0]; // 如果设置不合理，则取默认
  }
  setScalation(k?: number[]) {
    if (
      k &&
      typeof k[0] === 'number' &&
      typeof k[1] === 'number' &&
      k[1] >= k[0] &&
      k[0] > 0
    ) {
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
    if (
      x &&
      typeof x[0] === 'number' &&
      typeof x[1] === 'number' &&
      x[1] >= x[0]
    ) {
      this.translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this.translation[0] = (k: number = this._transform.k || 1) => {
      const { width: cw } = this.getContainerSize();
      const { width: ew } = this.getElClientSize();
      const bx = Math.max((ew * k - cw) / 2, 0);
      return [-bx, bx];
    };
  }
  setYTranslation(y?: number[]) {
    if (
      y &&
      typeof y[0] === 'number' &&
      typeof y[1] === 'number' &&
      y[1] >= y[0]
    ) {
      this.translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this.translation[1] = (k: number = this._transform.k || 1) => {
      const { height: ch } = this.getContainerSize();
      const { height: eh } = this.getElClientSize();
      const by = Math.max((eh * k - ch) / 2, 0);
      return [-by, by];
    };
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
  getCenterOffset(point: number[], k: number, adjust: boolean = false) {
    const { k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
    const dk = k / tk;
    const [cx, cy] = this.getContainerCenter();
    let ox = point[0] - (cx + tx);
    let oy = point[1] - (cy + ty);
    if (adjust) {
      // 思路：对元素进行划线分界
      // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
      // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
      // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
      // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
      // 5，元素左右计算方式如同上下方式一样得到ox
      // 测微信得到的结论
      // 这个偏移量需要要向着边缘点发散
      const { width: cw, height: ch } = this.getContainerSize();
      const { width, height } = this.getElClientSize();
      const ew = width / tk;
      const eh = height / tk;
      ox =
        between(ew - (cw - ew) / (dk - 1), [0, ew]) *
        ratioOffset(ox / ew, dk, between(cw / ew, [1, 2]));
      oy =
        between(eh - (ch - eh) / (dk - 1), [0, eh]) *
        ratioOffset(oy / eh, dk, between(ch / eh, [1, 2]));
    }
    ox *= 1 - dk;
    oy *= 1 - dk;
    return [ox, oy];
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
  transform(
    transformRaw: TransformRaw,
    point?: number[] | TAIOptions,
    options?: TAIOptions,
  ) {
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
    let { a, k, x, y } = transformRaw;
    if (typeof a === 'number') {
      a += ta;
    }
    if (typeof k === 'number') {
      k *= tk;
    }
    if (typeof x === 'number') {
      x += tx;
    }
    if (typeof y === 'number') {
      y += ty;
    }
    return this.transformTo({ a, k, x, y }, point, options);
  }
  transformTo(
    transformRaw: TransformRaw,
    point?: number[] | TAIOptions,
    options?: TAIOptions,
  ) {
    let _point = point;
    let _options = options;
    if (!options && !Array.isArray(point)) {
      _options = point;
      _point = undefined;
    }
    const { rotation, scalation, translation } = this;
    const [translationX, translationY] = translation;
    const { a: _a, k: _k, x: _x, y: _y } = transformRaw;
    const _transformRaw: TransformRaw = {};
    if (typeof _a === 'number') {
      _transformRaw.a = between(_a, execute(rotation));
    }
    if (typeof _k === 'number') {
      const k = (_transformRaw.k = between(_k, execute(scalation)));
      if (Array.isArray(_point)) {
        const [ox, oy] = this.getCenterOffset(_point, k);
        const { x: tx = 0, y: ty = 0 } = this._transform;
        _transformRaw.x = between(
          (typeof _x === 'number' ? _x : tx) + ox,
          execute(translationX, k),
        );
        _transformRaw.y = between(
          (typeof _y === 'number' ? _y : ty) + oy,
          execute(translationY, k),
        );
      } else {
        if (typeof _x === 'number') {
          _transformRaw.x = between(_x, execute(translationX, k));
        }
        if (typeof _y === 'number') {
          _transformRaw.y = between(_y, execute(translationY, k));
        }
      }
    } else {
      if (typeof _x === 'number') {
        _transformRaw.x = between(_x, execute(translationX));
      }
      if (typeof _y === 'number') {
        _transformRaw.y = between(_y, execute(translationY));
      }
    }
    return transition.apply(this, [
      _transformRaw,
      {
        cancel: false,
        ...(_options || {}),
      },
    ]);
  }
  transforming() {
    return this._transition.transitioning();
  }
}

export type Damping = 'rotate' | 'scale' | 'translate';
export type DblScale = { adjust?: boolean; value?: number };
export type IOption = {
  container: HTMLElement;
  element: HTMLElement;
  dblScale?: number | DblScale; // 双击放大比例
  damping?: Damping[]; // 哪些操作超出边界可以进行阻尼效果，如果对rotate,scale,translate设置了无边界限制(Infinity)，则阻尼无效
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转20度和顺时针可旋转10度
};

export default ImageView;
