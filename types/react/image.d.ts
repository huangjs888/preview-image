import React from 'react';
import { ItemModel, type ISPosition } from '../core';
import '../style/image.less';
type IImageRef = {
    findImageElement: () => HTMLImageElement | null | undefined;
    findDOMElement: () => HTMLDivElement | null | undefined;
    getInstance: () => ItemModel | null | undefined;
};
export interface IImageProps {
    className?: string;
    style?: React.CSSProperties;
    imgStyle?: React.CSSProperties;
    src?: string;
    alt?: string;
    error?: false | (() => React.ReactElement | null);
    loading?: false | (() => React.ReactElement | null);
    active?: boolean;
    viewPosition?: ISPosition;
}
declare const _default: React.ForwardRefExoticComponent<IImageProps & React.RefAttributes<IImageRef>>;
export default _default;
