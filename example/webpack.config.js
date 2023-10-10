/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-07 13:53:16
 * @Description: ******
 */

const fs = require('fs');
// const webpack = require('webpack');
const resolve = require('path').resolve;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 解析流的读取，request和response实际也是流的示例
const resolveStream = (stream) =>
  new Promise((resolve2, reject) => {
    const buffers = [];
    // 每读一块数据触发data事件，chunk是Buffer实例
    stream.on('data', (chunk) => buffers.push(chunk));
    // 读完数据，触发end事件，这里可以处理结束逻辑
    stream.on('end', () => resolve2(Buffer.concat(buffers)));
    stream.on('error', (e) => reject(e));
  });
// 读取文件流
const readFileStream = (filePath) =>
  new Promise((resolve2, reject) =>
    fs.promises
      // 检查文件是否可读
      .access(filePath, fs.constants.R_OK)
      .then(() =>
        // 解析文件流
        resolveStream(fs.createReadStream(filePath))
          .then((buffer) => resolve2(buffer))
          .catch((e) => reject(e)),
      )
      .catch(() => reject(new Error(`Cannot read file:${filePath}`))),
  );

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  return {
    mode: argv.mode,
    optimization: {
      minimize: !devMode,
      splitChunks: {
        cacheGroups: {
          lib: {
            name: 'lib',
            chunks: 'initial',
            test: /[\\/]src[\\/]/,
          },
        },
      },
    },
    devtool: 'source-map',
    context: resolve(__dirname, './'),
    entry: {
      index: resolve(__dirname, './src/index.tsx'),
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash:8].js',
      path: resolve(__dirname, '../docs/'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: true, // 对css里image路径使用下面的loader处理
              },
            },
            // 'less-loader',// 不需要使用less
          ],
        },
        // webpack5 配置图片loader两种选一个
        // https://webpack.docschina.org/guides/asset-modules
        {
          test: /\.(jpe?g|png|gif|bmp|ico|svg|webp)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name].[hash:8].[ext]',
          },
        },
        /* {
          test: /\.(jpe?g|png|gif|bmp|ico|svg|webp)$/,
          use: {
            loader: 'file-loader',
            options: {
              // 设置打包后的图片名称和文件夹
              name: '[name].[hash:8].[ext]',
              esModule: false, // 不转为 esModule
              limit: 4 * 1024, // url-loader跟file-loader配置差不多，limit是url-loader的参数，当图片小于 limit 时，图片会被转为 base64
            },
          },
          type: 'javascript/auto',
        }, */
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader', // 使用babel转换源代码到配置后的语法
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              },
            },
          ],
        },
        /* {
          test: /\.jsx?$/,
          // exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader', // 因为这里没有使用babel转化ts，所以需要配置ts-loader
        }, */
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      }),
      new HtmlWebpackPlugin({
        inject: 'body',
        chunks: ['lib', 'data', 'index'],
        filename: 'index.html',
        template: resolve(__dirname, './public/index.html'),
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      setupMiddlewares: function (middlewares, devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        devServer.app.get('/example/noStoreImage', function (req, res) {
          res.setHeader('Content-Type', 'image/*');
          res.setHeader('Cache-Control', 'no-store');
          readFileStream(resolve(__dirname, 'src/statics/ok.jpg')).then((finalData) => {
            setTimeout(() => {
              res.write(finalData);
              res.end();
            }, 20000);
          });
        });
        devServer.app.get('/example/maxAgeImage', function (req, res) {
          res.setHeader('Content-Type', 'image/*');
          res.setHeader('Cache-Control', 'max-age=31536000');
          readFileStream(resolve(__dirname, 'src/statics/ko.jpg')).then((finalData) => {
            setTimeout(() => {
              res.write(finalData);
              res.end();
            }, 10000);
          });
        });
        return middlewares;
      },
      static: false /* {
        // 该配置项允许配置从目录提供静态文件的选项
        directory: resolve(__dirname, './build'), // 静态文件目录
        watch: true, // 通过 static.directory 配置项告诉 dev-server 监听文件。文件更改将触发整个页面重新加载。
      }, */,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        }, // 将错误信息在浏览器中全屏覆盖
        progress: true, // 在浏览器中以百分比显示编译进度。
      },
      compress: true, // 启用 gzip compression
      port: 9090, // 端口
      // hot: true, // 热更新，配合HotModuleReplacementPlugin
      open: true, // 打开浏览器
      // proxy: {}, // 接口代理
      // host:'',// 地址
    },
  };
};
