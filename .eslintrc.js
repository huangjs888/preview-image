/*
 * @Author: Huangjs
 * @Date: 2021-10-21 15:05:51
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 15:45:50
 * @Description: ******
 */

module.exports = {
  env: {
    browser: true, // 涵盖浏览器全局变量
    es6: true, // 涵盖es6全局变量
    node: true, // 涵盖node全局变量
    jest: true, // 涵盖测试插件jest全局变量
  },
  globals: {
    // JSX: true,// 自定义全局变量，如 jQuery: true,
  },
  // 如果是js项目使用 '@babel/eslint-parser'
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      // experimentalObjectRestSpread: true,
    },
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: [
    'prettier',
    '@typescript-eslint', // 如果是js项目去掉这个
    'react',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    // support import modules from TypeScript files in JavaScript files
    'import/resolver': {
      node: {
        // 如果是js项目使用 ['.js', '.jsx']
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    // React Plugin
    // The following rules are made available via `eslint-plugin-react`.

    'react/display-name': 0,
    'react/jsx-boolean-value': 0,
    'react/jsx-no-comment-textnodes': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/jsx-wrap-multilines': 2,
    'react/no-did-mount-set-state': 1,
    'react/no-did-update-set-state': 1,
    'react/no-multi-comp': 0,
    'react/no-string-refs': 1,
    'react/no-unknown-property': 0,
    'react/no-unstable-nested-components': 1,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 1,
    'react/self-closing-comp': 1,
    'react/wrap-multilines': 0,

    // React-Hooks Plugin
    // The following rules are made available via `eslint-plugin-react-hooks`
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,

    // Typescript Plugin
    // The following rules are made available via `@typescript-eslint/eslint-plugin`
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 1,
    'no-undef': 'off',
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 1,
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
  },
};
