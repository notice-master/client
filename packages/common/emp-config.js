const {defineConfig} = require('@efox/emp')
const path = require('path')
module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: '@nmc/common',
      entry: {
        index: './src/index.ts'
      },
      // resolve: {
      //   extensions: ['.js', '.mjs', '.ts', '.tsx', '.json', '.wasm']
      // },
      // formats: ['umd', 'esm'],
      // webpackChain: (wpChain) => {
      //   console.log("🚀 ~ file: emp-config.js:20 ~ wpChain", wpChain)

      //   wpChain.resolve = {...wpChain.resolve, ...{}}
      // },
      formats: ['esm'],
    },
  },
  moduleTransform: {
    parser: 'swc',
    include: [/@yy/],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    }
  },
  webpackChain: (wpChain) => {
    wpChain.resolve.extensions.add('.xxx');
  },
})
