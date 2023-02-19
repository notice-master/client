const {defineConfig} = require('@efox/emp')
const path = require('path')
module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: '@nmc/common',
      entry: {
        index: './src/index.ts',
        worker: './src/worker/task.worker.ts'
      },
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
})
