import Entity, { type IOption } from './entity';
export default function (image: Image): Promise<void> | Promise<boolean>;
export type Image = {
    wrapper: HTMLElement;
    indicator?: HTMLElement | null;
    entity?: Entity | null;
    url: string;
    width: number;
    height: number;
    options: IOption;
};
export type ImageOption = IOption;
