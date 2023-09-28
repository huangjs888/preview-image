import { type ICSSProperties, type ICSSOptionProperties } from '.';
export declare function delta(startCSSProperties: ICSSProperties, endCSSProperties: ICSSProperties): ICSSProperties;
export declare function union(oldCSSProperties: ICSSProperties, newCSSProperties: ICSSOptionProperties): ICSSProperties;
