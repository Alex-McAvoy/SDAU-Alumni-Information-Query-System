/*
 * @Description: Vue配置文件
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:48:01
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  transpileDependencies: true
})
