const _excluded = ["x", "y"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:57
 * @Description: ******
 */

import { between, isBetween } from '../entity/utils';
import Gallery from '../gallery';
export default function pointerStart(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointers.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  let stopCount = 0;
  if (this instanceof Gallery) {
    stopCount += this.transitionCancel();
    const {
      entity
    } = this._images && this._images[this._activeIndex] || {};
    const length = (this._images || []).length;
    if (entity) {
      stopCount += entity.transitionCancel();
      // @@@1： 此处逻辑和swipe手势函数里 @@@2 逻辑是处理同一个问题（二选一，微信用的是这个效果）
      // 这里是在手指放上去时直接恢复到边界，那边是在真正要slide到上(下)一张时恢复到边界
      // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
      // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
      // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
      const _entity$getTransform = entity.getTransform(),
        {
          x: tx = 0,
          y: ty = 0
        } = _entity$getTransform,
        rest = _objectWithoutPropertiesLoose(_entity$getTransform, _excluded);
      const [xRange, yRange] = entity.getTranslation();
      // 是否是边缘图片
      const isFirst = this._activeIndex === 0;
      const isLast = this._activeIndex === length - 1;
      if (this._direction === 'vertical') {
        if (!isBetween(tx, xRange) && (ty <= yRange[0] && !isLast || ty >= yRange[1] && !isFirst)) {
          // 非边缘图片，且y方向超出边界，x方向也超出边界的，x给予恢复到边界
          entity.transitionRun(_extends({
            x: between(tx, xRange),
            y: ty
          }, rest), {
            duration: 0
          });
        }
      } else {
        if (!isBetween(ty, yRange) && (tx <= xRange[0] && !isLast || tx >= xRange[1] && !isFirst)) {
          // 非边缘图片，且x方向超出边界，y方向也超出边界的，y给予恢复到边界
          entity.transitionRun(_extends({
            x: tx,
            y: between(ty, yRange)
          }, rest), {
            duration: 0
          });
        }
      }
    }
  } else {
    // 取消动画
    const {
      entity
    } = this._image || {};
    if (entity) {
      stopCount += entity.transitionCancel();
    }
  }
  if (stopCount > 0 && this._gesture) {
    // 如果有动画停止，则阻止所有单指点击相关事件（就像是移动了一下一样）
    // 曲线救国：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPointer = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
}