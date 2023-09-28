import type { IGestureEvent } from '../modules/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function pointerMove(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { openStyleChange }: ICallback): void;
