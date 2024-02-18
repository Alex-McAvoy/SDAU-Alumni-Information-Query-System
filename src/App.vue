<!--
 * @Description: Vue App组件
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:48:01
-->
<template>
  <div id="app">
      <!-- Main 开始 -->
      <el-main>
        <router-view />
      </el-main>
      <!-- Main 结束 -->
      <!-- footer 开始 -->
      <el-footer class="footer">
        <el-row>
          <el-col type="flex" align="middle">
            <p size="small" style="font-size:14px;letter-spacing: 1px;" v-html="footer"></p>
          </el-col>
        </el-row>
      </el-footer>
      <!-- footer 结束 -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      footer: "系统技术支持QQ群：318845310<br/>主办单位：山东农业大学\t电话：0538-8242291"
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding: 0px;
}

/* .footer {
  position: absolute;
  bottom: 0;
  width: 100%;
} */
</style>
