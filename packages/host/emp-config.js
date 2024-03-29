const { defineConfig } = require('@efox/emp');
const { cdn, esm } = require('./cdn');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = defineConfig(({ mode }) => {
  // const target = 'es2018'
  const target = 'es5';
  const isESM = !['es3', 'es5'].includes(target);
  return {
    build: {
      target,
      staticDir: 'static',
      sourcemap: true,
    },
    server: {
      port: 8001,
    },
    webpackChain: (wpChain) => {
      wpChain
        .entry('worker/task.worker')
        .add('src/worker/task.worker.ts')
        .end();
      wpChain.output.filename('static/js/[name].js');
      wpChain.plugin('VanillaExtractPlugin').use(new VanillaExtractPlugin());
      wpChain.plugin('copy').use(CopyPlugin, [
        {
          patterns: [{ from: 'assets', to: 'assets' }],
        },
      ]);
    },
    empShare: {
      name: 'microHost',
      exposes: {
        './App': './src/App',
      },
      remotes: {
        '@templateMessage': `templateMessage@http://127.0.0.1:8002/emp.js`,
      },
      shared: {
        react: { requiredVersion: '^18.2.0' },
        'react-dom': { requiredVersion: '^18.2.0' },
        'react-router-dom': { requiredVersion: '^6.9.0' },
      },
      // shareLib: !isESM
      //   ? cdn(mode)
      //   : {
      //       react: esm('react', mode, '18.2.0'),
      //       'react-dom': esm('react-dom', mode, '18.2.0'),
      //     },
    },
    html: { title: 'Micro-Host', publicPath: '/' },
  };
});
