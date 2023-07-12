/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-07 10:05:28
 * @Description: ******
 */

// 阻尼算法逻辑
function damping(value: number, friction: number, inverse: boolean = false) {
  if (value === 0) {
    return 0;
  }
  if (friction <= 0) {
    return 1;
  }
  const v = value || 1;
  let f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return Math.pow(Math.abs(v), f) * (v > 0 ? 1 : -1);
}
// 解决0.1+0.2不等于0.3的问题
export function fixDecimal(value: number, places: number = 15) {
  const multiple = Math.pow(10, places);
  return Math.round(value * multiple) / multiple;
}
// 算出双击时offset的比例
export function ratioOffset(v: number, k: number, t: number) {
  if (v <= (1 - k) / (2 * k)) {
    return -1 / 2;
  } else if (v >= (1 + k - 2 * t) / (2 * k)) {
    return 1 / 2;
  } else {
    return (v - (1 - t) / (2 * k)) / (1 - t / k);
  }
}
// 传入的a是函数，就返回函数执行结果，否则直接返回a
export function effectuate(fn: any, ...args: any) {
  return typeof fn === 'function' ? fn(...args) : fn;
}
// 判断v是否在min和max之间
export function isBetween(v: number, [min, max]: number[]) {
  return min <= v && v <= max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
export function between(v: number, [min, max]: number[], _?: boolean) {
  return Math.max(Math.min(v, max), min);
}
// 跟随手指移动，旋转或缩放时的阻尼算法
export function performDamping(
  v: number,
  [min, max]: number[],
  k: boolean = false, // 是否使用积计算（主要是缩放情况），否则使用和算法
) {
  if (v < min || v > max) {
    const m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4) : m + damping(v - m, 0.8);
  }
  return v;
}
// 跟随手指移动，旋转或缩放时恢复阻尼算法的原值
export function revokeDamping(
  v: number,
  [min, max]: number[],
  k: boolean = false, // 是否使用积计算（主要是缩放情况），否则使用和算法
) {
  if (v < min || v > max) {
    const m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4, true) : m + damping(v - m, 0.8, true);
  }
  return v;
}
export function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}
export function easeOutQuart(t: number) {
  return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
}

const autoPxReg =
  /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
export function setStyle(
  ele: HTMLElement,
  css: { [key: string]: string | number | undefined },
) {
  if (ele) {
    Object.keys(css).forEach((k: string) => {
      if (typeof css[k] === 'undefined') {
        return;
      }
      const key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      const val =
        typeof css[k] === 'number' &&
        /^[a-z]/.test(key) &&
        autoPxReg.test(`-${key}`)
          ? `${css[k]}px`
          : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
}
export function loadImage(url: string, progress: (v: number) => void) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const off = () => {
      image.onload = null;
      image.onprogress = null;
      image.onerror = null;
    };
    image.onload = () => {
      resolve(image);
      off();
    };
    image.onerror = (e) => {
      reject(e);
      off();
    };
    image.onprogress = (e) => progress(e.loaded / e.total);
    image.src = url;
  });
}
// const lastModified: { [key in string]: string } = {};
// const etag: { [key in string]: string } = {};
export function proxyImage() {
  // 这里对HTMLImageElement元素的src进行重写，再设置src的时候使用ajax获取图片资源，目的是监听image的onprogress事件生效
  // 关于HTTP缓存问题：
  // 1，直接使用new Image()，或者img元素，当相同的图片url再次访问，浏览器会直接使用缓存图片（强缓存），不会向后端发送任何请求，即使后端响应头设置了协商缓存字段要求协商缓存，浏览器依然使用的是强缓存，不会出现304。但是除非后端设置响应头Cache-Control为no-store，此时图片会重新请求。
  // 2，这里使用ajax请求图片，会严格按照http缓存机制来，比如后端设置响应头Cache-Control为maxage=xxx，就会使用强缓存，后端响应头设置了协商缓存字段，就会使用协商缓存，会有304验证等。
  // 3，这里面注意XMLHttpRequest在第二次请求协商缓存的时候，除非请求主动设置了协商缓存字段，此时响应才会真正返回304（且不会去读缓存数据），否则都会自动转换成200，并读取缓存数据返回。
  // 4，HTTP缓存时存在disk或memory里的，靠浏览器默认去读取，ajax还会发一次304请求，如果不想这样浪费请求时间，并且确定图片不会变化，其实可以自己做缓存，可以将请求的数据（也可以转base64）存入到IndexDB，下次请求之前先从中取，没有再请求
  const { prototype } = HTMLImageElement;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'src');
  if (descriptor) {
    Object.defineProperty(prototype, 'src', {
      ...descriptor,
      set: function set(value, ...args) {
        if (descriptor.set) {
          const setter = descriptor.set;
          if (value && value.indexOf('blob:') !== 0) {
            const xhr = new XMLHttpRequest();
            xhr.onprogress = (e) => {
              if (e.lengthComputable) {
                this.onprogress && this.onprogress(e);
              }
            };
            xhr.onloadend = () => {
              if (
                (xhr.status >= 200 && xhr.status < 300) ||
                xhr.status === 304
              ) {
                /* let modified = xhr.getResponseHeader('Last-Modified');
                if (modified) {
                  lastModified[value] = modified;
                }
                modified = xhr.getResponseHeader('Etag');
                if (modified) {
                  etag[value] = modified;
                } */
                // _url对应资源此时是存在内存里，浏览器关闭或主动revoke会释放掉，释放内存后，地址就无效了
                const _url = URL.createObjectURL(xhr.response);
                const onload = this.onload;
                this.onload = function (e: Event) {
                  URL.revokeObjectURL(_url);
                  onload && onload.apply(this, [e]);
                };
                setter.apply(this, [_url, ...args]);
              } else {
                setter.apply(this, [value, ...args]);
              }
            };
            xhr.open('GET', value);
            xhr.responseType = 'blob';
            /* if (lastModified[value]) {
              // 此种模式，http先是有个OPTIONS请求，再有一个304请求
              xhr.setRequestHeader('If-Modified-Since', lastModified[value]);
            }
            if (etag[value]) {
              // 此种模式，只有304请求
              xhr.setRequestHeader('If-None-Match', etag[value]);
            } */
            // xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.send();
          } else {
            setter.apply(this, [value, ...args]);
          }
        }
      },
    });
  }
}
