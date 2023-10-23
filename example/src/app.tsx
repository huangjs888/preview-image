/*
 * @Author: Huangjs
 * @Date: 2023-08-30 11:09:21
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-23 15:03:34
 * @Description: ******
 */

import React from 'react';
import { previewImage } from '@huangjs888/preview-image';
import { PreviewImage } from '@huangjs888/preview-image/react';
import ko from './statics/ko.jpg';
import ok from './statics/ok.jpg';
import '@huangjs888/preview-image/css';
import './app.css';

const sendMessage = (data: any) => {
  ((window as any).ReactNativeWebView || window).postMessage(JSON.stringify(data));
  console.log(data);
};

const list = [
  ok,
  'https://react.docschina.org/images/home/community/react_conf_hallway.webp',
  ko,
  'https://react.docschina.org/images/home/conf2019/cover.svg',
  'http://10.5.13.133:9090/example/noStoreImage',
  'http://10.5.13.133:9090/example/maxAgeImage',
  'https://github.githubassets.com/images/modules/site/home-campaign/342af.webp',
  'https://github.githubassets.com/images/modules/site/home/globe.jpg',
];
function App() {
  const [reactMode, setReactMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('');
  const [clickPosition, setClickPosition] = React.useState<{
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }>();
  const click = (e: React.SyntheticEvent) => {
    const origin = e.target as HTMLImageElement;
    const { left, top, width, height } = origin.getBoundingClientRect();
    const position = { x: left + width / 2, y: top + height / 2, w: width, h: height };
    // 如果不是缩略图，此时可以获取点击位置
    /* const position = {
      x: (e.touches ?? [e])[0]?.pageX,
      y: (e.touches ?? [e])[0]?.pageY,
    }; */
    if (reactMode) {
      setClickPosition(position);
      setCurrent(origin.src);
      setOpen(true);
    } else {
      previewImage({
        current: origin.src,
        urls: list,
        onClose: () => {
          sendMessage('close');
        },
        // 预览图片时，图片将从该位置打开
        clickPosition: position,
        // 长按或右键可以在此弹出自定义菜单操作
        onContextMenu: () => {
          sendMessage('rawjs');
        },
      });
    }
  };
  return (
    <div className="app">
      <input
        type="button"
        onClick={() => {
          setReactMode(!reactMode);
        }}
        value={reactMode ? '切换到Rawjs模式' : '切换到React模式'}
      />
      <div className="imglist">
        {list.map((url, index) => (
          <img key={index} onClick={click} className="img" src={url} alt="" />
        ))}
      </div>
      {reactMode ? (
        <PreviewImage
          open={open}
          onClose={() => {
            setOpen(false);
            sendMessage('close');
          }}
          current={current}
          urls={list}
          clickPosition={clickPosition}
          onContextMenu={() => sendMessage('react')}
        />
      ) : null}
    </div>
  );
}
export default App;
