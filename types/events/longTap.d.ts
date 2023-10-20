import { type IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function longTap(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { contextMenu }: ICallback): void;
