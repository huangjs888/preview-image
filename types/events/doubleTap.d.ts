import type { IGestureEvent } from '../modules/gesture';
import type { SwiperModel, ItemModel } from '../core';
export default function doubleTap(this: SwiperModel<ItemModel | null>, event: IGestureEvent): void;
