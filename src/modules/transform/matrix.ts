/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-14 16:40:44
 * @Description: ******
 */

const DEG_TO_RAD = Math.PI / 180;

const Matrix = {
  // 将矩阵 lhm 与矩阵 rhm 相乘，然后保存到矩阵 rm 中
  multiply: function multiply(rm: Float32Array, lhm: Float32Array, rhm: Float32Array) {
    const a11 = lhm[0];
    const a12 = lhm[4];
    const a13 = lhm[8];
    const a14 = lhm[12];
    const a21 = lhm[1];
    const a22 = lhm[5];
    const a23 = lhm[9];
    const a24 = lhm[13];
    const a31 = lhm[2];
    const a32 = lhm[6];
    const a33 = lhm[10];
    const a34 = lhm[14];
    const a41 = lhm[3];
    const a42 = lhm[7];
    const a43 = lhm[11];
    const a44 = lhm[15];
    const b11 = rhm[0];
    const b12 = rhm[1];
    const b13 = rhm[2];
    const b14 = rhm[3];
    const b21 = rhm[4];
    const b22 = rhm[5];
    const b23 = rhm[6];
    const b24 = rhm[7];
    const b31 = rhm[8];
    const b32 = rhm[9];
    const b33 = rhm[10];
    const b34 = rhm[11];
    const b41 = rhm[12];
    const b42 = rhm[13];
    const b43 = rhm[14];
    const b44 = rhm[15];
    rm[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    rm[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    rm[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    rm[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    rm[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    rm[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    rm[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    rm[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    rm[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    rm[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    rm[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    rm[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    rm[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    rm[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    rm[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    rm[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
  },
  // 将矩阵 m 设置为初始矩阵
  identity: function identity(m: Float32Array) {
    for (let i = 0; i < 16; i++) {
      m[i] = 0;
    }
    for (let i = 0; i < 16; i += 5) {
      m[i] = 1;
    }
  },
  // 将矩阵 m 按照 x, y, z 平移
  translate: function translate(m: Float32Array, x: number, y: number, z: number) {
    for (let i = 0; i < 4; i++) {
      m[12 + i] += m[i] * x + m[4 + i] * y + m[8 + i] * z;
    }
  },
  // 将矩阵 m 按照 x, y, z 缩放
  scale: function scale(m: Float32Array, x: number, y: number, z: number) {
    for (let i = 0; i < 4; i++) {
      m[i] *= x;
      m[4 + i] *= y;
      m[8 + i] *= z;
    }
  },
  // 将矩阵 m 围绕 x, y, z 旋转a度
  rotate: function rotate(m: Float32Array, a: number, x: number, y: number, z: number) {
    const rm = new Float32Array(16);
    rm[3] = 0;
    rm[7] = 0;
    rm[11] = 0;
    rm[12] = 0;
    rm[13] = 0;
    rm[14] = 0;
    rm[15] = 1;
    const ra = a * DEG_TO_RAD;
    const s = Math.sin(ra);
    const c = Math.cos(ra);
    if (x === 1 && y === 0 && z === 0) {
      // x轴
      rm[5] = c;
      rm[10] = c;
      rm[6] = s;
      rm[9] = -s;
      rm[1] = 0;
      rm[2] = 0;
      rm[4] = 0;
      rm[8] = 0;
      rm[0] = 1;
    } else if (x === 0 && y === 0 && z === 0) {
      // y轴
      rm[0] = c;
      rm[10] = c;
      rm[8] = s;
      rm[2] = -s;
      rm[1] = 0;
      rm[4] = 0;
      rm[6] = 0;
      rm[9] = 0;
      rm[5] = 1;
    } else if (x === 0 && y === 0 && z === 1) {
      // z轴
      rm[0] = c;
      rm[5] = c;
      rm[1] = s;
      rm[4] = -s;
      rm[2] = 0;
      rm[6] = 0;
      rm[8] = 0;
      rm[9] = 0;
      rm[10] = 1;
    } else {
      const len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        const recipLen = 1 / len;
        x *= recipLen;
        y *= recipLen;
        z *= recipLen;
      }
      const nc = 1 - c;
      const xy = x * y;
      const yz = y * z;
      const zx = z * x;
      const xs = x * s;
      const ys = y * s;
      const zs = z * s;
      rm[0] = x * x * nc + c;
      rm[4] = xy * nc - zs;
      rm[8] = zx * nc + ys;
      rm[1] = xy * nc + zs;
      rm[5] = y * y * nc + c;
      rm[9] = yz * nc - xs;
      rm[2] = zx * nc - ys;
      rm[6] = yz * nc + xs;
      rm[10] = z * z * nc + c;
    }
    Matrix.multiply(m, m, rm);
  },
  // 将矩阵 m 按照欧拉角 xa, ya, za 旋转
  rotateEuler: function rotateEuler(m: Float32Array, xa: number, ya: number, za: number) {
    const rm = new Float32Array(16);
    const xra = xa * DEG_TO_RAD;
    const yra = ya * DEG_TO_RAD;
    const zra = za * DEG_TO_RAD;
    const cx = Math.cos(xra);
    const sx = Math.sin(xra);
    const cy = Math.cos(yra);
    const sy = Math.sin(yra);
    const cz = Math.cos(zra);
    const sz = Math.sin(zra);
    const cxsy = cx * sy;
    const sxsy = sx * sy;
    rm[0] = cy * cz;
    rm[1] = -cy * sz;
    rm[2] = sy;
    rm[3] = 0;
    rm[4] = cxsy * cz + cx * sz;
    rm[5] = -cxsy * sz + cx * cz;
    rm[6] = -sx * cy;
    rm[7] = 0;
    rm[8] = -sxsy * cz + sx * sz;
    rm[9] = sxsy * sz + sx * cz;
    rm[10] = cx * cy;
    rm[11] = 0;
    rm[12] = 0;
    rm[13] = 0;
    rm[14] = 0;
    rm[15] = 1;
    Matrix.multiply(m, m, rm);
  },
  // 将矩阵 m 进行perspective变换
  perspective: function perspective(
    m: Float32Array,
    fovy: number,
    aspect: number,
    zNear: number,
    zFar: number,
  ) {
    const f = 1 / Math.tan(fovy * (Math.PI / 360.0));
    const rangeReciprocal = 1 / (zNear - zFar);
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (zFar + zNear) * rangeReciprocal;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * zFar * zNear * rangeReciprocal;
    m[15] = 0;
  },
};

export default Matrix;
