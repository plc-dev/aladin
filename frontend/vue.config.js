const path = require("path");

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    },
    name: "Aladin",
    appleMobileWebAppCapable: true
  },
  outputDir: path.resolve(__dirname, "../server/public")
};
