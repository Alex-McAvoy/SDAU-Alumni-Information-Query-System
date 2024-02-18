<!--
 * @Description: 登录页
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

    <!-- 文本开始 -->
    <el-row>
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="20">
        <p class="content"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ content.content1 }} </p>
        <!-- <p class="content"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ content2 }} </p> -->
        <p class="content content-bold"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ content.content2 }} </p>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row>
    <!-- 文本结束 -->

    <!-- Form 表单开始 -->
    <el-form ref="form" :model="form">
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名" style="width:60%;max-width: 90%;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="密码" style="width:60%; max-width: 90%;"></el-input>
      </el-form-item>
    </el-form>
    <!-- Form 表单结束 -->
    <el-button @click="login" class="btn">登录</el-button>
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
      content: {
        content1: "感谢各位老师、同学们的辛勤付出与无私奉献，以实际行动在社会实践活动中树立起在基层建功立业的志向；怀着谦逊的学习之心，在社会实践活动中不断提高自身综合素质；怀着火热的志愿之心，在社会实践活动中为广大群众提供扎实有效的服务；怀着深厚的爱校之心，在社会实践活动中展现新时代农大师生的风采。",
        content2: "请您输入用户名与密码，点击登录进入“万名学子联万村”区域匹配校友查询系统！",
      },
      userInfo: {},
      form: {
        username: '',
        password: '',
      }
    }
  },
  created() {
    const body = document.body
    body.style.backgroundColor = "RGB(251,249,236)"
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
          }
        }).then((response) => { // 请求成功
          // 状态码
          let status = response.data.status
          if (status == 200) { // 登录成功
            let data = response.data.result[0]

            let userInfo = {}

            // 登录信息
            userInfo = {
              userId: data.s_id, // 学生id
              username: data.s_username, // 学生学号
              name: data.s_name, // 学生姓名
              phone: data.s_phone, // 学生手机号
              college: data.s_college, // 学生学院
              major: data.s_major == null ? '' : data.s_major, // 学生专业
              class: data.s_class == null ? '' : data.s_class, // 学生班级
              city: data.s_city == null ? '' : data.s_city, // 学生负责区域所在市
              county: data.s_county == null ? '' : data.s_county, // 学生负责区域所在区县
              township: data.s_township == null ? '' : data.s_township // 学生负责区域所在乡镇
            }

            // 存储到store
            this.$store.state.userInfo = userInfo
            // 存储到本地
            localStorage.setItem('iqs-userInfo', JSON.stringify(userInfo))

            // 路由跳转
            this.$router.push({
              name: 'home'
            })

            this.$message.success("登录成功")
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
/* 文字样式 */
.content {
  font-family: Arial, Helvetica, sans-serif;
  font-size: medium;
  text-align: left;
}

.content-bold {
  font-weight: bolder;
}

/* 警告框样式 */
.messageAlertBox {
  max-width: 80vw !important;
}

.btn {
  width: 60%;
  background-color: RGB(0, 150, 136);
  color: white;
}
</style>
  