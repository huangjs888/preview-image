/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 15:34:16
 * @Description: ******
 */

import Transition, {
  TAProperty,
  TAIOptions,
  easeOutQuad,
  easeOutQuart,
  type EaseFn,
} from '@huangjs888/transition';
import Transform, { type TransformRaw } from '@huangjs888/transform';
import { revokeDamping, performDamping } from '@huangjs888/damping';
import { between, isBetween, effectuate, ratioOffset } from './utils';

class Entity {
  _element: HTMLElement;
  _transform: Transform; // 当前手势操作之后的变换对象
  _transition: Transition; // 当前渐变对象
  _dblAdjust: boolean = true;
  _dblScale: number | (() => number) = 0; // 双击放大比例和是否调整放大时的中心点
  _damping: Damping[] = []; // 可以进行阻尼的变换
  _rotation: number[] | (() => number[]) = []; // 旋转范围
  _scalation: number[] | (() => number[]) = []; // 缩放范围
  _translation: (number[] | ((v: number) => number[]))[] = []; // 平移范围
  _sizeInfo: SizeInfo & {
    elementWidth: number;
    elementHeight: number;
  } = {
    containerCenter: [0, 0],
    containerWidth: 0,
    containerHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    elementWidth: 0,
    elementHeight: 0,
  };
  constructor({
    element,
    sizeInfo,
    dblAdjust,
    dblScale,
    damping,
    rotation,
    scalation,
    translation,
  }: IOption) {
    let _element: HTMLElement | null | undefined;
    try {
      if (typeof element === 'string') {
        _element = document.querySelector(element) as HTMLElement;
      } else {
        _element = element;
      }
    } catch (e) {
      _element = null;
    }
    if (!_element || !(_element instanceof HTMLElement)) {
      _element = document.createElement('div');
    }
    _element.style.opacity = '0';
    _element.innerHTML = '';
    this._element = _element;
    this._transform = new Transform({ a: 0, k: 1, x: 0, y: 0 });
    // 创建过渡
    this._transition = new Transition({
      element: this._element,
      propertyName: 'transform',
      propertyValue: new (class extends TAProperty {
        toString() {
          // 这里注意，在不存在任何过渡动画的时候，这里的this.value应该和上面的this._transform内的每项值应该是相等的
          // 但是由于 0.1+0.2!==0.3 的问题，导致经过各种计算后，其值并不是完全相等，存在极小的精度问题
          return new Transform(this.value).toString();
        }
      })(this._transform.toRaw()),
    });
    this.setSizeInfo(sizeInfo); // 设置尺寸
    this.setDblAdjust(dblAdjust); // 设置双击是否调整中心点
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
  }
  getElement() {
    return this._element;
  }
  getTransform() {
    return this._transform;
  }
  getSizeInfo() {
    return this._sizeInfo;
  }
  setSizeInfo(sizeInfo?: SizeInfo) {
    if (sizeInfo) {
      const {
        containerCenter,
        containerWidth,
        containerHeight,
        naturalWidth,
        naturalHeight,
      } = sizeInfo;
      const aspectRatio = naturalWidth / naturalHeight;
      const boxAspectRatio = containerWidth / containerHeight;
      let width = naturalWidth;
      if (aspectRatio >= boxAspectRatio) {
        width = containerWidth;
      } else if (aspectRatio >= 1 / 2.2) {
        // 0.4545454545...
        //微信 iphone 横竖屏和微信 android 竖屏时
        width = containerHeight * aspectRatio;
      } /* else if (aspectRatio >= 0.4) {
        // 微信 android 横屏时
        width = containerHeight * aspectRatio;
      } */ else {
        // 微信 iphone 是取 containerWidth 和 naturalWidth 最小值
        width = Math.min(containerWidth, naturalWidth);
        // 微信 android 直接是取 containerWidth;
        // width = containerWidth;
      }
      const height = width / aspectRatio;
      this._element.style.opacity = '1';
      this._element.style.width = `${width}px`;
      this._element.style.height = `${height}px`;
      this._sizeInfo = {
        containerCenter,
        containerWidth,
        containerHeight,
        naturalWidth,
        naturalHeight,
        elementWidth: width,
        elementHeight: height,
      };
      this.reset();
    }
  }
  setRotation(a?: number[]) {
    if (
      a &&
      typeof a[0] === 'number' &&
      typeof a[1] === 'number' &&
      a[1] >= a[0]
    ) {
      // 最大范围 -Infinity 到 + Infinity
      this._rotation = a;
      return;
    }
    // 测微信得到的结论，是不给旋转的
    // 如果设置不合理，则取默认
    this._rotation = () => [0, 0];
  }
  getRotation() {
    return effectuate(this._rotation);
  }
  setScalation(k?: number[]) {
    if (
      k &&
      typeof k[0] === 'number' &&
      typeof k[1] === 'number' &&
      k[1] >= k[0] &&
      k[0] > 0
    ) {
      this._scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
    // 如果设置不合理，则取默认
    this._scalation = () => [1, 2 * this.getDblScale()];
  }
  getScalation() {
    return effectuate(this._scalation);
  }
  setTranslation(xy?: number[][]) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  }
  getTranslation(k?: number) {
    return [this.getXTranslation(k), this.getYTranslation()];
  }
  setXTranslation(x?: number[]) {
    if (
      x &&
      typeof x[0] === 'number' &&
      typeof x[1] === 'number' &&
      x[1] >= x[0]
    ) {
      this._translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this._translation[0] = (k: number) => {
      const { containerWidth, elementWidth } = this.getSizeInfo();
      const bx = Math.max((elementWidth * k - containerWidth) / 2, 0);
      return [-bx, bx];
    };
  }
  getXTranslation(k?: number) {
    return effectuate(this._translation[0], k || this._transform.k || 1);
  }
  setYTranslation(y?: number[]) {
    if (
      y &&
      typeof y[0] === 'number' &&
      typeof y[1] === 'number' &&
      y[1] >= y[0]
    ) {
      this._translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this._translation[1] = (k: number) => {
      const { containerHeight, elementHeight } = this.getSizeInfo();
      const by = Math.max((elementHeight * k - containerHeight) / 2, 0);
      return [-by, by];
    };
  }
  getYTranslation(k?: number) {
    return effectuate(this._translation[1], k || this._transform.k || 1);
  }
  setDblScale(k?: number) {
    if (typeof k === 'number' && k > 0) {
      this._dblScale = k;
      return;
    }
    // 测微信得到的结论，双击放大比例是
    // 1，容器宽/元素宽 和 容器高/元素高 的最大值
    // 2，元素实际宽/容器宽 和 元素实际高/容器高 的最小值
    // 3，在1、2两个值和数值2这三个之中的最大值
    this._dblScale = () => {
      const {
        containerWidth,
        containerHeight,
        naturalWidth,
        naturalHeight,
        elementWidth,
        elementHeight,
      } = this.getSizeInfo();
      return (
        Math.max(
          2,
          Math.max(
            containerWidth / elementWidth,
            containerHeight / elementHeight,
          ),
          Math.min(
            naturalWidth / containerWidth,
            naturalHeight / containerHeight,
          ),
        ) || 1
      );
    };
  }
  getDblScale() {
    return effectuate(this._dblScale);
  }
  setDblAdjust(aj: boolean = true) {
    this._dblAdjust = aj;
  }
  getDblAdjust() {
    return this._dblAdjust;
  }
  isDamping(key: Damping) {
    return this._damping && this._damping.indexOf(key) !== -1;
  }
  setDamping(damping?: Damping[]) {
    if (damping) {
      this._damping = damping;
      return;
    }
    // 如果不设置，默认只对缩放比例和位移进行阻尼
    this._damping = ['scale', 'translate'];
  }
  rotate(a: number) {
    // 负数顺时针，正数逆时针
    // 在原来的基础上再旋转 a
    return this.transform({ a });
  }
  rotateTo(a: number) {
    // 负数顺时针，正数逆时针
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
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this.getTransform();
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
    const { a: _a, k: _k, x: _x, y: _y } = transformRaw;
    const _transformRaw: TransformRaw = {};
    if (typeof _a === 'number') {
      _transformRaw.a = between(_a, this.getRotation());
    }
    if (typeof _k === 'number') {
      const k = (_transformRaw.k = between(_k, this.getScalation()));
      if (Array.isArray(_point)) {
        const [ox, oy] = this.computeOffset(_point, k);
        const { x: tx = 0, y: ty = 0 } = this._transform;
        _transformRaw.x = between(
          (typeof _x === 'number' ? _x : tx) + ox,
          this.getXTranslation(k),
        );
        _transformRaw.y = between(
          (typeof _y === 'number' ? _y : ty) + oy,
          this.getYTranslation(k),
        );
      } else {
        if (typeof _x === 'number') {
          _transformRaw.x = between(_x, this.getXTranslation(k));
        }
        if (typeof _y === 'number') {
          _transformRaw.y = between(_y, this.getYTranslation(k));
        }
      }
    } else {
      if (typeof _x === 'number') {
        _transformRaw.x = between(_x, this.getXTranslation());
      }
      if (typeof _y === 'number') {
        _transformRaw.y = between(_y, this.getYTranslation());
      }
    }
    return this.transitionRun(_transformRaw, _options);
  }
  transitionRun(transformRaw: TransformRaw, options: TAIOptions = {}) {
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._transform = new Transform(transformRaw);
      this._transition.bind(transformRaw);
      return Promise.resolve(transformRaw);
    }
    const { a, k, x, y } = transformRaw;
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this.getTransform();
    const deltaValue: TransformRaw = {};
    const precision: TransformRaw = {};
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
        cancel: true,
        duration: 500,
        easing: easeOutQuart,
        ...options,
      })
      .then((value) => {
        if (!this.isTransitioning()) {
          // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
          this._transition.bind(this._transform.toRaw());
        }
        return value;
      });
  }
  transitionCancel() {
    // cancel返回值是动画未执行的部分
    return this._transition.cancel().map((value) => {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      const {
        a: ta = 0,
        k: tk = 1,
        x: tx = 0,
        y: ty = 0,
      } = this.getTransform();
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
    }).length;
  }
  isTransitioning() {
    return this._transition.transitioning();
  }
  reset(duration: number = 0) {
    const a = between(0, this.getRotation()); // 初始角度a
    const k = between(1, this.getScalation()); // 初始比例k
    const x = between(0, this.getXTranslation(k)); // 初始位移x
    const y = between(0, this.getYTranslation(k)); //初始位移y
    this.transitionRun({ a, k, x, y }, { duration });
  }
  computeOffset(point: number[], k: number, adjust: boolean = false) {
    const {
      containerCenter,
      containerWidth,
      containerHeight,
      elementWidth,
      elementHeight,
    } = this.getSizeInfo();
    const { k: tk = 1, x: tx = 0, y: ty = 0 } = this.getTransform();
    const dk = k / tk;
    const [cx, cy] = containerCenter;
    let ox = (typeof point[0] === 'number' ? point[0] : cx) - (cx + tx);
    let oy = (typeof point[1] === 'number' ? point[1] : cy) - (cy + ty);
    if (adjust) {
      // 思路：对元素进行划线分界
      // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
      // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
      // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
      // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
      // 5，元素左右计算方式如同上下方式一样得到ox
      // 测微信得到的结论
      // 这个偏移量需要要向着边缘点发散
      const cw = containerWidth / 1;
      const ch = containerHeight / 1;
      const ew = elementWidth / tk;
      const eh = elementHeight / tk;
      ox =
        between(ew - (cw - ew) / (dk - 1), [0, ew]) *
          ratioOffset(ox / ew, dk, between(cw / ew, [1, 2])) || 0;
      oy =
        between(eh - (ch - eh) / (dk - 1), [0, eh]) *
          ratioOffset(oy / eh, dk, between(ch / eh, [1, 2])) || 0;
    }
    ox *= 1 - dk;
    oy *= 1 - dk;
    return [ox, oy];
  }
  moveBounce(
    angle: number,
    scale: number,
    deltaX: number,
    deltaY: number,
    point: number[] = [],
  ) {
    let { a = 0, k = 1, x = 0, y = 0 } = this.getTransform();
    const aRange = this.getRotation();
    if (this.isDamping('rotate')) {
      // 先把当前值反算出阻尼之前的原值
      let ba = between(a, aRange);
      a = ba + revokeDamping(a - ba, { max: 180 });
      // 再对总值进行总体阻尼计算
      ba = between((a += angle), aRange);
      a = ba + performDamping(a - ba, { max: 180 });
    } else {
      a = between((a += angle), aRange);
    }
    const kRange = this.getScalation();
    if (this.isDamping('scale')) {
      // 先把当前值反算出阻尼之前的原值
      let bk = between(k, kRange);
      k = bk * revokeDamping(k / bk, { max: 2, mode: 1 });
      // 再对总值进行总体阻尼计算
      bk = between((k *= scale), kRange);
      k = bk * performDamping(k / bk, { max: 2, mode: 1 });
    } else {
      k = between((k *= scale), kRange);
    }
    const [ox, oy] = this.computeOffset(point, k);
    if (this.isDamping('scale')) {
      // 先把当前值反算出阻尼之前的原值
      const xMax = this._sizeInfo.containerWidth;
      let bx = between(x, this.getXTranslation());
      x = bx + revokeDamping(x - bx, { max: xMax });
      // 再对总值进行总体阻尼计算
      bx = between((x += ox + deltaX), this.getXTranslation(k));
      x = bx + performDamping(x - bx, { max: xMax });
      // 先把当前值反算出阻尼之前的原值
      const yMax = this._sizeInfo.containerHeight;
      let by = between(y, this.getYTranslation());
      y = by + revokeDamping(y - by, { max: yMax });
      // 再对总值进行总体阻尼计算
      by = between((y += oy + deltaY), this.getYTranslation(k));
      y = by + performDamping(y - by, { max: yMax });
    } else {
      x = between((x += ox + deltaX), this.getXTranslation(k));
      y = between((y += oy + deltaY), this.getYTranslation(k));
    }
    this.transitionRun({ a, k, x, y }, { duration: 0 });
  }
  resetBounce(point: number[] = [], cancel: boolean = false) {
    let { a = 0, k = 1, x = 0, y = 0 } = this.getTransform();
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('rotate')) {
      const ba = between(a, this.getRotation());
      a = ba + revokeDamping(a - ba, { max: 180 });
    }
    if (this.isDamping('scale')) {
      const bk = between(k, this.getScalation());
      k = bk * revokeDamping(k / bk, { max: 2, mode: 1 });
    }
    if (this.isDamping('translate')) {
      const xMax = this._sizeInfo.containerWidth;
      const bx = between(x, this.getXTranslation());
      x = bx + revokeDamping(x - bx, { max: xMax });
      const yMax = this._sizeInfo.containerHeight;
      const by = between(y, this.getYTranslation());
      y = by + revokeDamping(y - by, { max: yMax });
    } // 重置之前是双指移动，是不允许取消动画的
    this.transformTo({ a, k, x, y }, point, { cancel });
  }
  dblScale(point: number[] = []) {
    // 这三个比例都是用保留三位小数的结果进行比较
    // 其实这里的3应该用1/屏幕的宽高算出的小数位数
    // 此刻比例和位移
    const tk = this.getTransform().k || 1;
    // 双击变化的比例
    const dk = between(this.getDblScale(), this.getScalation());
    // 再次双击恢复的比例（初始比例）
    const bk = between(1, this.getScalation());
    // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
    // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
    if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
      if (this.getDblAdjust()) {
        // 需要调整的情况，自己算偏移量，并且旋转置为0
        const [ox, oy] = this.computeOffset(point, dk, this.getDblAdjust());
        const { x: tx = 0, y: ty = 0 } = this.getTransform();
        this.transformTo(
          { a: 0, k: dk, x: tx + ox, y: ty + oy },
          { cancel: false },
        );
      } else {
        // 交给transformTo
        this.transformTo({ k: dk }, point, { cancel: false });
      }
    } else {
      // 再次双击恢复
      if (this.getDblAdjust()) {
        // 需要调整的情况，置为初始状态
        this.transformTo({ a: 0, k: bk, x: 0, y: 0 }, { cancel: false });
      } else {
        // 交给transformTo
        this.transformTo({ k: bk }, point, { cancel: false });
      }
    }
  }
  swipeBounce(
    duration: number,
    stretch: number,
    key: 'x' | 'y',
    transition?: (
      key: 'x' | 'y',
      xySwipe: number,
      xyBounce: number,
      option: (v: number) => { duration: number; easing: EaseFn },
    ) => void,
  ) {
    const maxBounce =
      this._sizeInfo[key === 'x' ? 'containerWidth' : 'containerHeight'];
    const xyScale = 1.2 * this.getDblScale();
    const xyPos = this.getTransform()[key] || 0;
    const xyRange = this.getTranslation()[key === 'x' ? 0 : 1];
    const sign = stretch > 0 ? 1 : -1;
    // 对距离进行优化(最大值是当前双击比例下图片宽度)
    const _stretch =
      Math.max(1, Math.min(Math.abs(stretch), xyScale * maxBounce)) * sign;
    // 对时间进行优化
    const _duration = Math.max(800, Math.min(2500, duration));
    if (isBetween(xyPos + _stretch, xyRange)) {
      // 如果加上惯性滑动距离之后图片未超出边界，则图片直接移动
      this.transitionRun(
        { [key]: xyPos + _stretch },
        { easing: easeOutQuad, duration: _duration },
      );
    } else {
      // 根据边界算出到达边界要走的的距离，有可能松开时已经超出边界，此时xySwipe是需要减掉的超出部分距离
      const xySwipe = between(xyPos + _stretch, xyRange) - xyPos;
      let xyBounce = 0;
      if (this.isDamping('translate')) {
        // 计算速度时，如果松开时超出边界，xySwipe视作0，其实得到的就是初始速度
        const velocity =
          (isBetween(xyPos, xyRange)
            ? Math.sqrt(1 - Math.abs(xySwipe / _stretch))
            : 1) *
          ((2 * Math.abs(_stretch)) / _duration);
        // 根据到达边界时速度的大小计算出将要Damping的距离（一个与速度成正比计算方式，最大值不能超过容器宽度的1/4）
        xyBounce = Math.min(30 * velocity, maxBounce / 4) * sign;
      }
      if (typeof transition === 'function') {
        // 交给调用者去计算分配如何transition，并使用回调计算transition配置
        transition(key, xySwipe, xyBounce, (xyMove: number) => {
          // 根据实际走的距离xyMove算出时间占比
          const kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
          return {
            duration: kt * _duration,
            easing: easeOutQuad,
          };
        });
      } else {
        // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
        const xyMove = Math.max((xySwipe + xyBounce) * sign, 0) * sign;
        // 整个减速运动中，移动xyMove的时间占比
        const kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
        if (xyMove === 0) {
          // 如果swipe抬起没有移动的距离，则直接归位
          this.transitionRun({ [key]: between(xyPos + xyMove, xyRange) });
        } else {
          // 先移动xyMove距离
          this.transitionRun(
            { [key]: xyPos + xyMove },
            {
              duration: kt * _duration,
              easing: easeOutQuad,
            },
          ).then(() => {
            // 移动后归位
            this.transitionRun({ [key]: between(xyPos + xyMove, xyRange) });
          });
        }
      }
    }
  }
}

export type Damping = 'rotate' | 'scale' | 'translate';
export type SizeInfo = {
  containerCenter: number[];
  containerWidth: number;
  containerHeight: number;
  naturalWidth: number;
  naturalHeight: number;
};
export type IOption = {
  element?: HTMLElement | string;
  sizeInfo?: SizeInfo; // 容器尺寸和元素实际尺寸
  dblAdjust?: boolean; // 双击中心点是否调整
  dblScale?: number; // 双击放大比例
  damping?: Damping[]; // 哪些操作超出边界可以进行阻尼效果，如果对rotate,scale,translate设置了无边界限制(Infinity)，则阻尼无效
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转20度和顺时针可旋转10度
};

export default Entity;
