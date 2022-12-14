const { defineConfig } = require("@efox/emp");
const { cdn, esm } = require("./cdn");
const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = defineConfig(({ mode }) => {
  // const target = 'es2018'
  const target = "es5";
  const isESM = !["es3", "es5"].includes(target);
  return {
    build: {
      target,
      staticDir: "static",
    },
    server: {
      port: 8001,
    },
    webpackChain: (wpChain) => {
      wpChain.plugin("VanillaExtractPlugin").use(new VanillaExtractPlugin());
      wpChain.plugin('copy').use(CopyPlugin, [
        {
          patterns: [{ from: 'assets', to: 'assets' }],
        },
      ]);
    },
    empShare: {
      name: "microHost",
      // esm 共享需要设置 window
      // library: {name: 'microHost', type: 'window'},
      exposes: {
        "./App": "./src/App",
        // './Button': './src/Button',
        // './importExport/incStore': './src/store/incStore',
      },
      // shared: {
      //   react: {requiredVersion: '^17.0.1'},
      //   'react-dom': {requiredVersion: '^17.0.1'},
      // },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm("react", mode, "17.0.2"),
            "react-dom": esm("react-dom", mode, "17.0.2"),
            mobx: esm("mobx", mode),
            "mobx-react-lite": esm("mobx-react-lite", mode),
          },
      // shareLib: cdn(mode),
    },
    html: { title: "Micro-Host", publicPath: "/" },
  };
});
