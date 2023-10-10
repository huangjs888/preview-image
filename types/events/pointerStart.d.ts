import type { IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';
export default function pointerStart(this: SwiperModel<ItemModel | null>, event: IGestureEvent, { preventAllTap }: ICallback): void;
