<!--
 * @Description: 导航菜单
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 01:51:33
-->
<template>
  <div id="navMenu">

    <el-menu text-color="#2d2d2d" mode="horizontal" @select="handleSelect">
      <el-menu-item :key="key" v-for="(item, key) in leftNavItems" :index="item.index" :route="item.activeIndex">
        {{ item.name }}
      </el-menu-item>

      <el-menu-item style="float:right;" index="3" >
        <span>登出</span>
      </el-menu-item>

      <el-submenu style="float:left;" class="right-item" v-if="Object.keys(rightNavItems).length === 0 ? false : true"
        index="10">
        <template slot="title">
          <i class="el-icon-s-fold" style="font-size:28px;color:#2d2d2d;"></i>
        </template>
        <el-menu-item :key="key" v-for="(item, key) in rightNavItems" :index="item.index" :route="item.activeIndex">{{
          item.name }}</el-menu-item>
      </el-submenu>
    </el-menu>

  </div>
</template>


<script>
export default {
  name: 'NavMenu',
  data() {
    return {
      /** ---------- 用户信息 ---------- **/
      user: {
        userId: '',
        username: '',
      },
      /** ---------- 导航项 ---------- **/
      navItems: [
        { name: "主页", indexPath: "/home", index: "1" },
        { name: "查看校友", indexPath: "/showContact", index: "2" },
      ],
      /** ---------- 监听宽度 ---------- **/
      screenWidth: document.body.clientWidth
    }
  },
  mounted() {
    // 绑定屏幕监听事件
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }
  },
  methods: {
    /** ---------- 登出 ---------- **/
    logout() {
      this.$confirm('是否退出登录？', '提示', { customClass: 'confirmMessageBox' })
        .then(() => { //确认操作
          // 删除本地存储
          localStorage.removeItem('iqs-userInfo')
          // 路由跳转
          this.$router.push({
            name: 'login'
          })
          this.$message.success("您已退出登录")
        })
        .catch(() => { //取消操作
          this.$message.info("取消退出登录")
        });
    },
    /** ---------- 导航项选择handler ---------- **/
    handleSelect(key) { 
      if (key == 1) { // 跳转主页
        // 路由跳转
        this.$router.push({
          name: 'home'
        })
      } else if (key == 2) { // 跳转查看校友页
        // 路由跳转
        this.$router.push({
          name: 'contact'
        })
      } else if (key == 3) { // 登出
        this.logout()
      }
    }
  },
  watch: {
    screenWidth(newValue) { // 控制screenWidth更新频率
      // 使用定时器
      if (!this.timer) {
        // 监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = newValue;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    }
  },
  computed: {
    leftNavItems: function () { // 控制导航项位置
      return this.screenWidth >= 600 ? this.navItems : {};
    },
    rightNavItems: function () {
      return this.screenWidth < 600 ? this.navItems : {};
    }
  }
}
</script>
<style>

.navMenu {
  margin: 0;
}
</style>