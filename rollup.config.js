/*
 * @Author: Huangjs
 * @Date: 2023-08-09 11:24:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-27 17:37:34
 * @Description: ******
 */

import autoprefixer from 'autoprefixer';
import npmImport from 'less-plugin-npm-import';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';

const { NODE_ENV, MOD_ENV } = process.env;

const pathname = MOD_ENV === 'cjs' ? 'lib' : MOD_ENV === 'esm' ? 'es' : 'dist';
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const config = {
  output: [
    {
      format: MOD_ENV,
      sourcemap: true,
    },
  ],
  // nodeResolve是将node_modules里的依赖打包进来，这里可以选择一些依赖包，不打包进来，源码中只会保留导入语句
  // 一般明确知道，源码被别人使用后，一定会安装这些依赖，此时这里可以排除（）
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    // 处理把css引入的情况
    postcss({
      minimize: NODE_ENV === 'production',
      sourceMap: false,
      extract: true,
      use: {
        less: {
          plugins: [new npmImport({ prefix: '~' })],
          javascriptEnabled: true,
        },
        stylus: {},
        sass: {},
      },
      plugins: [autoprefixer()],
    }),
    // 需要打包的源码中如果有导入node_modules的依赖，则配置此项，可以将这些依赖随源码一起打包进来
    nodeResolve({
      mainFields: ['module', 'main'], // 依赖包的入口文件在依赖包的package.json中哪个字段指定
      extensions, // 可以打包的文件后缀
    }),
    // 如果转typescript文件包括node_modules里导入的，这里因为在babel里统一转了，所以不需要了
    // import typescript from '@rollup/plugin-typescript';
    // typescript({
    //   tsconfig: 'tsconfig.json',
    //   cacheDir: '.cache/.rollup.tscache',
    //   compilerOptions: { module: 'esnext' },
    // }),
    // 导入的包如果是commonjs模块，这里会转成es6模块（一般都是node_modules里的安装包）
    commonjs({
      include: '**/node_modules/**',
      extensions,
    }),
    // 处理导入的json文件
    json(),
    // rollup只负责代码合并，以及设置模块方式，不负责编译代码，如果有新语法等需要编译，还要babel
    // 这里排除了node_modules里的文件，默认认为导入的文件都是编译好的，（浏览器）能够使用的，否则需要放开
    // babelHelpers=runtime表示babel配置文件里要使用@babel/plugin-transform-runtime
    babel({
      babelHelpers: MOD_ENV === 'esm' ? 'bundled' : 'runtime',
      // 这里在没有使用esm的时候，需要将node_modules/@huangjs888下的所有模块也进行babel转换
      // 因为源码内引入的包的时候，包使用的是esm格式，所以需要将其一起转换
      include: ['src/**/*', MOD_ENV === 'esm' ? '' : '**/node_modules/@huangjs888/**'],
      exclude: MOD_ENV === 'esm' ? '**/node_modules/**' : undefined,
      extensions,
    }),
    // 如果文件内有根据环境变量的判断，需要引入这个替换
    // import replace from '@rollup/plugin-replace';
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    //   preventAssignment: true,// 阻止对环境变量重新设置值的替换
    // }),
  ],
};
if (NODE_ENV === 'production') {
  // 生产模式对最后的打包文件进行压缩
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}

export default [
  {
    ...config,
    input: 'src/index.ts',
    output: [
      {
        ...config.output[0],
        file: `${pathname}/preview-image${NODE_ENV === 'production' ? '.min' : ''}.js`,
        // umd时挂在全局变量下的模块名称
        name: MOD_ENV === 'umd' ? 'PreviewImage' : undefined,
      },
    ],
    plugins: [
      // 处理导入的图片
      url(),
      ...config.plugins,
    ],
  },
  {
    ...config,
    input: 'src/react/index.tsx',
    output: [
      {
        ...config.output[0],
        file: `${pathname}/react-preview-image${NODE_ENV === 'production' ? '.min' : ''}.js`,
        // umd时挂在全局变量下的模块名称
        name: MOD_ENV === 'umd' ? 'ReactPreviewImage' : undefined,
        globals:
          MOD_ENV === 'umd'
            ? {
                react: 'React',
                'react-dom': 'ReactDOM',
              }
            : {},
      },
    ],
    plugins: [
      // 处理直接把svg导入的情况
      svgr({ icon: true, include: '**/svg/*.svg' }),
      ...config.plugins,
    ],
  },
];
