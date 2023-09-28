declare const Matrix: {
    multiply: (rm: Float32Array, lhm: Float32Array, rhm: Float32Array) => void;
    identity: (m: Float32Array) => void;
    translate: (m: Float32Array, x: number, y: number, z: number) => void;
    scale: (m: Float32Array, x: number, y: number, z: number) => void;
    rotate: (m: Float32Array, a: number, x: number, y: number, z: number) => void;
    rotateEuler: (m: Float32Array, xa: number, ya: number, za: number) => void;
    perspective: (m: Float32Array, fovy: number, aspect: number, zNear: number, zFar: number) => void;
};
export default Matrix;
