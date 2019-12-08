const path = require("path");

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(false);
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    },
    name: "Aladin",
    appleMobileWebAppCapable: true,
    themeColor: "#B1B2B4",
    msTileColor: "#B1B2B4",
    manifestOptioN: {
      background_color: "#B1B2B4"
    }
  },
  outputDir: path.resolve(__dirname, "../server/public")
};
