/*
 * @Author: Huangjs
 * @Date: 2023-08-14 14:09:57
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-26 15:51:41
 * @Description: ******
 */

const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  createReadStream,
  createWriteStream,
} = require('fs');
const { parse, resolve, relative, dirname, basename } = require('path');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const { transform } = require('@svgr/core');
const babelCore = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');

function babelPlugin(pluginName, options, cb) {
  // babel不能处理的一些文件，比如图片
  const fileMap = Object.create(null);
  const { ext = '', dest = '', include, exclude, referInclude, referExclude } = options;
  const referFilter = createFilter(referInclude, referExclude);
  const filter = createFilter(include, exclude);
  return () => ({
    name: pluginName,
    visitor: {
      ImportDeclaration(path, plugin) {
        const absDir = dirname(plugin.filename);
        const sourceFilename = resolve(absDir, path.node.source.value);
        if (referFilter(plugin.filename) && filter(sourceFilename)) {
          const relFilePath = parse(path.node.source.value);
          const newRelFilename = `${relFilePath.dir}/${relFilePath.name}${ext || relFilePath.ext}`;
          const destFilename = resolve(
            dest,
            relative(plugin.cwd, resolve(absDir, newRelFilename)).split('\\').slice(1).join('\\'),
          );
          if (!fileMap[destFilename]) {
            const destDir = dirname(destFilename);
            try {
              if (!existsSync(destDir)) {
                mkdirSync(destDir);
              }
              fileMap[destFilename] = true;
              cb(sourceFilename, destFilename);
            } catch (e) {
              fileMap[destFilename] = false;
              throw e;
            }
          }
          path.node.source.value = newRelFilename;
        }
      },
    },
  });
}

function pluginLessToCss(options) {
  // 把less处理成css
  return babelPlugin(
    'plugin-less-to-css',
    {
      include: '**/*.less',
      referInclude: '**/*',
      ext: '.css',
      ...options,
    },
    (src, dest) => {
      const fileContent = readFileSync(src, 'utf8');
      // 没有搞sourcemap
      less
        .render(fileContent, {
          compress: false,
          paths: [],
          filename: src,
        })
        .then((output) => {
          return postcss([autoprefixer]).process(output.css, {
            from: src.replace(/\.less$/, '.css'),
            to: dest,
          });
        })
        .then((result) => {
          writeFileSync(dest, result.css);
        });
    },
  );
}

function pluginSvgToComponent(options) {
  // 把svg处理成svg组件
  const { babel: babelOpts, ...restOptions } = options;
  /* babelOpts.presets = (babelOpts.presets || []).map((preset) =>
    babelCore.createConfigItem(
      typeof preset === 'string' ? require(preset) : [require(preset[0]), preset[1]],
      { type: 'preset' },
    ),
  );
  babelOpts.plugins = (babelOpts.plugins || []).map((plugin) =>
    babelCore.createConfigItem(
      typeof plugin === 'string' ? require(plugin) : [require(plugin[0]), plugin[1]],
    ),
  ); */
  return babelPlugin(
    'plugin-svg-to-component',
    {
      include: '**/*.svg',
      referInclude: '**/*',
      ext: '.js',
      ...restOptions,
    },
    (src, dest) => {
      const bn = basename(src, '.svg').split('');
      const componentName = `Svg${bn[0].toUpperCase()}${bn.slice(1).join('')}`;
      const fileContent = readFileSync(src, 'utf8');
      transform(
        fileContent,
        {
          icon: true,
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        },
        {
          filePath: src,
          componentName,
        },
      )
        .then((code) => {
          // 转换的svg组件还需要babel转一下组件代码
          return babelCore
            .transformAsync(code, {
              // babelrc: false, // 如果设置了.babelrc .babelrc.js，则需要设置为false，不使用配置文件，使用下面自定义配置
              configFile: false, // 如果设置了babel.config.js，则需要设置为false，不使用配置文件，使用下面自定义配置
              ...babelOpts,
            })
            .then((result) => {
              if (!result || !result.code) {
                throw new Error(`Error while transforming using Babel`);
              }
              return result.code;
            });
        })
        .then((code) => {
          writeFileSync(dest, code);
        });
    },
  );
}

function pluginCopyFile(options) {
  // copy静态文件
  return babelPlugin(
    'plugin-copy-file',
    { include: '**/*', referInclude: '**/*', ...options },
    (src, dest) => {
      const read = createReadStream(src);
      read.on('error', (e) => {
        throw e;
      });
      const write = createWriteStream(dest);
      write.on('error', (e) => {
        throw e;
      });
      write.on('finish', () => {
        console.log(`Copy ${dest} success!`);
      });
      read.pipe(write);
    },
  );
}

module.exports = {
  pluginLessToCss,
  pluginSvgToComponent,
  pluginCopyFile,
};
