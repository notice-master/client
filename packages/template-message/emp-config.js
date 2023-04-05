const { defineConfig } = require('@efox/emp');
const { cdn, esm } = require('./cdn');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = defineConfig(({ mode, env }) => {
  // const target = 'es2018'
  const target = 'es5';
  const isESM = !['es3', 'es5'].includes(target);
  return {
    build: {
      target,
    },
    server: {
      port: 8002,
    },
    empShare: {
      name: 'templateMessage',

      exposes: {
        './App': './src/App',
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
    html: { title: 'Micro-App' },
  };
});
