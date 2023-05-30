/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-17 16:49:24
 * @Description: ******
 */

// const webpack = require('webpack');
const resolve = require('path').resolve;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      index: resolve(__dirname, './index.ts'),
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash:8].js',
      path: resolve(__dirname, '../docs/'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(c|le)ss$/,
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
            'less-loader',
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
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader', // 使用babel转换源代码到配置后的语法
              options: {
                presets: ['@babel/preset-env', '@babel/preset-typescript'],
              },
            },
          ],
        },
        /* {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'ts-loader', // 因为这里没有使用babel转化ts，所以需要配置ts-loader
        }, */
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      }),
      new HtmlWebpackPlugin({
        inject: 'body',
        chunks: ['lib', 'data', 'index'],
        filename: 'index.html',
        template: resolve(__dirname, './index.html'),
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
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
