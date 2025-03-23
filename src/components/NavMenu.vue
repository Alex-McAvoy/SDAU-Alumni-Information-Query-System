<!--
 * @Description: 导航菜单
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 01:51:33
-->
<template>
  <div id="navMenu">

    <div v-if="user.authority == '1'">
      <el-menu text-color="#2d2d2d" class="nav" mode="horizontal" @select="handleSelect">
        <el-menu-item class="logo" index="0" route="/home">
          <img width="20px" src="../assets/logo.png" alt="logo" />
        </el-menu-item>

        <el-menu-item :key="key" v-for="(item, key) in leftNavItems1" :index="item.index" :route="item.activeIndex">
          {{ item.name }}
        </el-menu-item>

        <el-submenu style="float:right;" class="right-item" v-if="Object.keys(rightNavItems1).length === 0 ? false : true"
          index="10">
          <template slot="title">
            <i class="el-icon-s-fold" style="font-size:28px;color:#2d2d2d;"></i>
          </template>
          <el-menu-item :key="key" v-for="(item, key) in rightNavItems1" :index="item.index" :route="item.activeIndex">{{
            item.name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div v-if="user.authority == '2'">
      <el-menu text-color="#2d2d2d" class="nav" mode="horizontal" @select="handleSelect">
        <el-menu-item class="logo" index="0" route="/home">
          <img width="20px" src="../assets/logo.png" alt="logo" />
        </el-menu-item>

        <el-menu-item :key="key" v-for="(item, key) in leftNavItems2" :index="item.index" :route="item.activeIndex">
          {{ item.name }}
        </el-menu-item>

        <el-submenu style="float:right;" class="right-item" v-if="Object.keys(rightNavItems2).length === 0 ? false : true"
          index="10">
          <template slot="title">
            <i class="el-icon-s-fold" style="font-size:28px;color:#2d2d2d;"></i>
          </template>
          <el-menu-item :key="key" v-for="(item, key) in rightNavItems2" :index="item.index" :route="item.activeIndex">{{
            item.name }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

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
        authority: ''
      },
      /** ---------- 导航项 ---------- **/
      navItems1: [
        { name: "查看联系人", indexPath: "/showContact", index: "1" },
        { name: "查看学生", indexPath: "/showStudent", index: "2" },
      ],
      navItems2: [
        { name: "查看联系人", indexPath: "/showContact", index: "1" }
      ],
      /** ---------- 监听宽度 ---------- **/
      screenWidth: document.body.clientWidth
    }
  },
  mounted() {
    /** ---------- 获取用户信息 ---------- **/
    let userInfo = JSON.parse(localStorage.getItem('iqs-userInfo'))
    this.user = userInfo

    // 绑定屏幕监听事件
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }
  },
  methods: {
    handleSelect(key) { // 导航项选择handler
      if (key == 0) { // 跳转主页
        // 路由跳转
        this.$router.push({
          name: 'home'
        })
      } else if (key == 1) { // 跳转查看联系人页
        // 路由跳转
        this.$router.push({
          name: 'contact'
        })
      } else if (key == 2) { // 跳转查看学生页
        // 路由跳转
        this.$router.push({
          name: 'student'
        })
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
    leftNavItems1: function () { // 控制导航项位置
      return this.screenWidth >= 600 ? this.navItems1 : {};
    },
    rightNavItems1: function () {
      return this.screenWidth < 600 ? this.navItems1 : {};
    },
    leftNavItems2: function () { // 控制导航项位置
      return this.screenWidth >= 600 ? this.navItems2 : {};
    },
    rightNavItems2: function () {
      return this.screenWidth < 600 ? this.navItems2 : {};
    }
  }
}
</script>
<style>
.navMenu {
  margin: 0;
}
</style>