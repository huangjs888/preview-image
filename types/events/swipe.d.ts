import type { IGestureEvent } from '../modules/gesture';
import { type SwiperModel, type ItemModel, type ICallback } from '../core';
export default function swipe(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { internalClose, slideBefore, slideAfter }: ICallback): void;
