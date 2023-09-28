/*
 * @Author: Huangjs
 * @Date: 2023-08-10 15:01:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-26 15:50:02
 * @Description: ******
 */

const { pluginLessToCss, pluginSvgToComponent, pluginCopyFile } = require('./babel.plugins');

const { MOD_ENV, BABEL_ENV } = process.env;
const destPath = MOD_ENV === 'esm' ? './es' : './lib';
const targets =
  MOD_ENV === 'esm'
    ? { esmodules: true } // 目标浏览器是可以使用 ES Modules
    : {
        browsers: ['last 2 versions', 'IE 10'],
      };
const presets = [
  [
    '@babel/preset-env',
    {
      // false的时候按照es6模块输出（保留import/export），可设置commonjs就会按照commonjs模块输出
      modules: MOD_ENV === 'esm' || BABEL_ENV !== 'babel' ? false : 'auto',
      // 尝试将已损坏的语法编译为目标浏览器支持的最接近的未损坏的现代语法
      bugfixes: true, // This option merges the features of @babel/preset-modules
      loose: true, // 松散模式
    },
  ],
  '@babel/preset-react',
];

const plugins =
  MOD_ENV !== 'esm'
    ? [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: {
              version: 3,
              proposals: true,
            },
          },
        ],
      ]
    : [];

module.exports = {
  targets,
  presets: [...presets, '@babel/preset-typescript'],
  plugins: [
    ...(BABEL_ENV === 'babel'
      ? [
          pluginLessToCss({
            // 转化后放到哪个路径下
            dest: destPath,
            // 转化后的文件后缀名字
            // ext: '.css',
          }),
          pluginSvgToComponent({
            // 转化后放到哪个路径下
            dest: destPath,
            // 哪些文件内导入了该svg，这些svg需要转换，这一类文件的路径匹配模式
            referInclude: '**/react/**/*.*',
            // 需要转化为组件的svg路径匹配模式
            include: '**/svg/*.svg',
            // 转化后的文件后缀名字
            // ext: '.js',
            // babel相关配置
            babel: {
              targets,
              presets,
              plugins,
            },
          }),
          pluginCopyFile({
            // 复制到哪个路径下
            dest: destPath,
            // 需要复制的静态文件路径匹配模式
            include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.json'],
            // 哪些文件不需要复制
            // exclude: '**/svg/*.svg',
          }),
        ]
      : []),
    ...plugins,
  ],
};
