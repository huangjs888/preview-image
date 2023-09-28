/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 12:34:31
 * @Description: ******
 */

import { getEventPoints, getDirection, getDistance, getAngle, getCenter } from '../utils';
import type Core from '../core';
import { type IGestureEvent } from '../core';

export default function moved(this: Core, event: any) {
  const newEvent: IGestureEvent = {
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: () => [0, 0],
  };
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环更新手指（点）
  const { points } = getEventPoints(event);
  for (let i = 0, len = points.length; i < len; ++i) {
    const t = points[i];
    const p = [t.pageX, t.pageY];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = p;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      this._pointer1.previous = this._pointer1.current;
      this._pointer1.current = p;
    }
  }
  // 手指（点）移动至少要有一个手指（点）移动超过touchMoveDistance才会触发移动事件
  const pointer0 = this._pointer0;
  const pointer1 = this._pointer1;
  if (
    (pointer0 && getDistance(pointer0.start, pointer0.current) > this.touchMoveDistance) ||
    (pointer1 && getDistance(pointer1.start, pointer1.current) > this.touchMoveDistance)
  ) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this.preventAllTap();
    // 双指移动情况
    if (pointer1 && pointer0) {
      newEvent.pointers = [pointer0, pointer1];
      const { start: start0, previous: previous0, current: current0 } = pointer0;
      const { start: start1, previous: previous1, current: current1 } = pointer1;
      // 双指平移
      const eCenter = getCenter(current0, current1);
      const mCenter = getCenter(previous0, previous1);
      const sCenter = getCenter(start0, start1);
      newEvent.getPoint = (whichOne) =>
        whichOne === 'start' ? sCenter : whichOne === 'previous' ? mCenter : eCenter;
      newEvent.direction = getDirection(mCenter, eCenter);
      newEvent.moveDirection = getDirection(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - mCenter[0];
      newEvent.moveX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - mCenter[1];
      newEvent.moveY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      const eDistance = getDistance(current0, current1);
      const mDistance = getDistance(previous0, previous1);
      const sDistance = getDistance(start0, start1);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / mDistance;
        newEvent.moveScale = eDistance / sDistance;
      }
      const eAngle = getAngle(current0, current1);
      const mAngle = getAngle(previous0, previous1);
      // const sAngle = getAngle(start0, start1);
      // 这里计算的三个angle均是向量（第一个参数为起点，第二个为终点）与x正半轴之间的夹角
      // 方向朝向y轴正半轴的为正值[0,180]，朝向y轴负半轴的为负值[-180,0]
      // 注意，这里坐标轴是页面坐标，x轴向右正方向，y轴向下正方向，原点在左上角
      let angle = eAngle - mAngle;
      if (angle < -180) {
        // 此种情况属于顺时针转动时mAngle突然由正变为负值（比如由178度顺时针旋转4度都-178度）
        // 这种情况，因为eAngle和mAngle是两次相邻的移动事件，间隔角度很小（4度）而不会是很大的（-356度）
        angle += 360;
      } else if (angle > 180) {
        // 和上面相反逆时针转动（比如由-178逆时针旋转4度到178）
        angle -= 360;
      }
      // 双指旋转本次和上一次的角度，正值顺时针，负值逆时针
      newEvent.angle = angle;
      // 双指旋转起点到终点的总旋转角度，正值顺时针，负值逆时针
      // 这里不能直接使用eAngle-sAngle，否则顺逆时针分不清，需要通过angle累加
      this._rotateAngle += angle;
      newEvent.moveAngle = this._rotateAngle;
      this.emit('rotate', newEvent);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        this.emit('scale', newEvent);
      }
      this.emit('multiPan', newEvent);
      this.emit('gestureMove', newEvent);
    }
    // 单指移动
    else if (pointer0) {
      newEvent.pointers = [pointer0];
      const { start, previous, current } = pointer0;
      newEvent.getPoint = (whichOne) =>
        whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
      newEvent.direction = getDirection(previous, current);
      newEvent.moveDirection = getDirection(start, current);
      newEvent.deltaX = current[0] - previous[0];
      newEvent.moveX = current[0] - start[0];
      newEvent.deltaY = current[1] - previous[1];
      newEvent.moveY = current[1] - start[1];
      const _timestamp = Date.now();
      // 第一次移动this._swipePoints为null
      const _swipePoints = this._swipePoints || [[], []];
      const _duration = _timestamp - ((_swipePoints[1][0] ? _swipePoints[1][0].timestamp : 0) || 0);
      // 当前时间与本阶段初始时间之差大于计入swipe的时间(swipeDuration)，则本阶段过时，下阶段开启
      if (_duration > this.swipeDuration) {
        // 将本阶段作为上一阶段，开启下一阶段作为本阶段
        _swipePoints[0] = _swipePoints[1];
        _swipePoints[1] = [];
      }
      // 将当前移动点和时间存入本阶段
      _swipePoints[1].push({
        point: current,
        timestamp: _timestamp,
      });
      this._swipePoints = _swipePoints;
      // 触发单指平移事件
      this.emit('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.emit('pointerMove', newEvent);
  }
}
