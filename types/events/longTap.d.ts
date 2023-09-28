import type { IGestureEvent } from '../modules/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function longTap(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { popupMenu }: ICallback): void;
