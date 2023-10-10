import type { IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function pointerEnd(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { openStyleChange, slideBefore, slideAfter }: ICallback): void;
