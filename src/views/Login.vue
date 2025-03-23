<!--
 * @Description: Vue 登录页
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 23:49:46
-->
<template>
  <div id="login">
    <!-- 图片开始 -->
    <el-row>
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16">
        <el-image :src="SDAU"></el-image>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>
    <!-- 图片结束 -->

    <h2>登录</h2>

    <!-- Form 表单开始 -->
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item label="用户名:">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密  码:">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="身  份:">
        <el-radio v-model="form.authority" label="1">教师</el-radio>
        <el-radio v-model="form.authority" label="2">学生</el-radio>
      </el-form-item>
    </el-form>
    <!-- Form 表单结束 -->
    <div>

    </div>
    <el-button type="primary" round @click="login" class="btn">登录</el-button>
  </div>
</template>
  
<script>
import axios from "axios"
import SDAU from "@/assets/SDAU.png"

export default {
  name: 'SignIn',
  data() {
    return {
      SDAU: SDAU,
      userInfo: {},
      form: {
        username: '',
        password: '',
        authority: '1'
      }
    }
  },
  methods: {
    // 登录
    login() {
      if (this.form.username == '') { // 用户名校验
        this.$message.error('请输入用户名')
      } else if (this.form.password == '') { // 密码校验
        this.$message.error('请输入密码')
      } else {
        axios.get(this.$global.address + '/login', { // 登录请求
          params: {
            username: this.form.username,
            password: this.form.password,
            authority: this.form.authority
          }
        }).then((response) => { // 请求成功
          // 状态码
          let status = response.data.status
          if (status == 200) { // 登录成功
            let data = response.data.result[0]

            let userInfo = {}
            if (this.form.authority == 1) { // 1教师
              // 登录信息
              userInfo = {
                userId: data.t_id, // 教师id
                username: data.t_username, // 教师工号
                authority: this.form.authority, // 1教师，2学生
                name: data.t_name, // 教师姓名
                phone: data.t_phone, // 教师手机号
              }
            } else { // 2学生
              // 登录信息
              userInfo = {
                userId: data.s_id, // 学生id
                username: data.s_username, // 学生工号
                authority: this.form.authority, // 1教师，2学生
                name: data.s_name, // 学生姓名
                phone: data.s_phone, // 学生手机号
              }
            }

            // 存储到store
            this.$store.state.userInfo = userInfo
            // 存储到本地
            localStorage.setItem('iqs-userInfo', JSON.stringify(userInfo))

            // 路由跳转
            this.$router.push({
              name: 'home'
            })

            this.$message.warning("登录成功")
          } else { // 登录失败
            this.$alert(response.data.message, '登录失败', {
              confirmButtonText: '确定',
              customClass: 'messageAlertBox',
              // form表单清空
              callback: action => { // eslint-disable-line no-unused-vars
                this.form.username = '',
                this.form.password = ''
              }
            })
          }
        }).catch(result => { // 请求失败
          this.$message.error("登录失败" + result)
        })
      }
    }
  }
}
</script>

<style>
.messageAlertBox {
  max-width: 80vw!important;
}
</style>
  