import type { IGestureEvent } from '../modules/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function singleTap(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { internalClose }: ICallback): void;
