const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  configureWebpack: (config) => {
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      // Disable code splitting for library builds
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        runtimeChunk: false,
      }
      // Force all chunks to be merged into one
      config.plugins = config.plugins || []
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        })
      )
    }
  },
  productionSourceMap: false,
})
