<!--
 * @Description: 主页
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 01:28:02
-->
<template>
  <div id="main">
    <el-container>
      <!-- 导航栏开始 -->
      <el-header>
        <Nav-Menu></Nav-Menu>
      </el-header>
      <!-- 导航栏结束 -->
      <!-- main开始 -->
      <el-main>
        <h2>主页</h2>
        <el-card >
          <!-- 用户信息开始 -->
          <el-descriptions title="用户信息" :column="1" border>
            <!-- 按钮开始 -->
            <template slot="extra">
              <div v-if="screenWidth >= 600">
                <el-button type="primary" icon="el-icon-edit" plain size="small"
                  @click="showUpdatePasswordDialog(user.userId)">修改密码</el-button>
              </div>
              <div v-else>
                <el-button type="primary" icon="el-icon-edit" circle plain size="small"
                  @click="showUpdatePasswordDialog(user.userId)"></el-button>
              </div>
            </template>
            <!-- 按钮结束 -->
            <!-- 信息展示开始 -->
            <!-- 用户名开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user" />
                用户名
              </template>
              {{ user.username }}
            </el-descriptions-item>
            <!-- 用户名结束 -->
            <!-- 姓名开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard" />
                姓名
              </template>
              {{ user.name }}
            </el-descriptions-item>
            <!-- 姓名结束 -->
            <!-- 手机号开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone" />
                手机号
              </template>
              {{ user.phone }}
            </el-descriptions-item>
            <!-- 手机号结束 -->
            <!-- 学院开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-school" />
                学院
              </template>
              {{ user.college }}
            </el-descriptions-item>
            <!-- 学院结束 -->
            <!-- 专业开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-suitcase" />
                专业
              </template>
              {{ user.major }}
            </el-descriptions-item>
            <!-- 专业结束 -->
            <!-- 班级开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-collection" />
                班级
              </template>
              {{ user.class }}
            </el-descriptions-item>
            <!-- 班级结束 -->
            <!-- 负责区域所在市开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-map-location" />
                负责区域所在市
              </template>
              {{ user.city }}
            </el-descriptions-item>
            <!-- 负责区域所在市结束 -->
            <!-- 负责区域所在区县开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-information" />
                负责区域所在区县
              </template>
              {{ user.county }}
            </el-descriptions-item>
            <!-- 负责区域所在区县结束 -->
            <!-- 负责区域所在乡镇开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-place" />
                负责区域所在乡镇
              </template>
              {{ user.township }}
            </el-descriptions-item>
            <!-- 负责区域所在乡镇结束 -->
            <!-- 信息展示结束 -->
          </el-descriptions>
          <!-- 用户信息结束 -->
        </el-card>

        <!-- 修改用户密码模态框开始 -->
        <el-dialog title="修改密码" :visible.sync="updatePasswordDialogVisible" width="80%">
          <el-form ref="updatePasswordForm" :rules="updatePasswordFormRule" :model="updatePasswordForm"
            label-width="100px" size="small" style="padding-right: 40px;">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="updatePasswordForm.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="updatePasswordForm.newPassword" />
            </el-form-item>
            <el-form-item label="确认密码" prop="newPasswordAgain">
              <el-input v-model="updatePasswordForm.newPasswordAgain" />
            </el-form-item>
          </el-form>
          <div class="tips">
            tips: 密码中必须包含字母、数字，长度至少为 8 位，最多 16 位
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" icon="el-icon-refresh-right" @click="updatePasswordDialogVisible = false">取
              消</el-button>
            <el-button type="primary" size="small" icon="el-icon-check" @click="updateUserPasswordById(user.userId)">确
              定</el-button>
          </span>
        </el-dialog>

      </el-main>
      <!-- main结束 -->
    </el-container>
  </div>
</template>
<script>
import axios from "axios"
import navMenu from "@/components/NavMenu"
import { validateNotNull, validatePassword } from '@/utils/validate'

export default {
  name: 'HomeList',
  components: {
    'Nav-Menu': navMenu
  },
  data() {
    // 原密码校验规则
    const oldPasswordValidator = (rule, value, callback) => {
      if (!validateNotNull(value)) {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    // 新密码校验规则
    const newPasswordValidator = (rule, value, callback) => {
      if (!validateNotNull(value)) {
        callback(new Error('请输入新密码'))
      } else if (!validatePassword(value)) {
        callback(new Error('您的密码复杂度太低'))
      } else {
        callback()
      }
    }
    // 再次输入的新密码校验规则
    const newPasswordAgainValidator = (rule, value, callback) => {
      if (!validateNotNull(value)) {
        callback(new Error('请输入新密码'))
      } else if (value !== this.updatePasswordForm.newPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      /** ---------- 监听宽度 ---------- **/
      screenWidth: document.body.clientWidth,
      /** ---------- 用户信息 ---------- **/
      user: {
        userId: '', // 学生id
        username: '', // 学生学号
        name: '', // 学生姓名
        phone: '', // 学生手机
        college: '', // 学生学院
        major: '', // 学生专业
        class: '', // 学生班级
        city: '', // 学生负责区域所在市
        county: '', // 学生负责区域所在区县
        township: '' // 学生负责区域所在乡镇
      },
      /** ---------- 修改用户密码 ---------- **/
      updatePasswordDialogVisible: false, // 修改用户密码模态框是否显示
      updatePasswordForm: { // 修改用户密码表单初始值
        id: '',
        oldPassword: '', // 原密码
        newPassword: '', // 新密码
        newPasswordAgain: '' // 再次输入新密码
      },
      updatePasswordFormRule: { // 修改用户密码表单校验规则
        oldPassword: [{ required: true, trigger: ['blur', 'change'], validator: oldPasswordValidator }],
        newPassword: [{ required: true, trigger: ['blur', 'change'], validator: newPasswordValidator }],
        newPasswordAgain: [{ required: true, trigger: ['blur', 'change'], validator: newPasswordAgainValidator }]
      }
    }
  },
  created() {
    const body = document.body
    body.style.backgroundColor = "RGB(255,255,255)"
  },
  mounted() {
    /** ---------- 获取用户信息 ---------- **/
    let userInfo = JSON.parse(localStorage.getItem('iqs-userInfo'))
    if (userInfo == null) { // 获取不到用户信息
      // 路由跳转
      this.$router.push({
        name: 'login'
      })
      return false
    } else {
      this.user = userInfo
    }

    /** ---------- 绑定屏幕监听事件 ---------- **/
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
    /** ---------- 修改用户密码 ---------- **/
    // 弹出修改用户密码模态框
    showUpdatePasswordDialog(userId) {
      this.updatePasswordDialogVisible = true
      this.updatePasswordForm.id = userId
    },
    // 修改用户密码
    updateUserPasswordById(userId) {
      this.$refs.updatePasswordForm.validate(valid => {
        // 对表单进行验证
        if (valid) {
          axios.post(this.$global.address + '/updatePassword', { // 更新密码请求
            userId: userId,
            oldPassword: this.updatePasswordForm.oldPassword,
            newPassword: this.updatePasswordForm.newPassword,
            authority: this.user.authority
          }).then((response) => { // 请求成功
            // 状态码
            let status = response.data.status
            if (status == 200) { // 修改成功
              this.updatePasswordDialogVisible = false
              this.updatePasswordForm.oldPassword = '',
              this.updatePasswordForm.newPassword = '',
              this.updatePasswordForm.newPasswordAgain = ''
              this.$message.success("修改成功")
            } else { // 修改失败
              this.$alert('原密码错误', '提示', {
                confirmButtonText: '确定',
                customClass: 'messageAlertBox',
                // form表单清空
                callback: action => { // eslint-disable-line no-unused-vars
                  this.updatePasswordForm.oldPassword = '',
                    this.updatePasswordForm.newPassword = '',
                    this.updatePasswordForm.newPasswordAgain = ''
                }
              })
            }
          }).catch(result => { // 请求失败
            this.$message.error("修改失败" + result)
          })
        } else {
          return false
        }
      })
    }
  },
  watch: {
    /** ---------- 控制screenWidth更新频率 ---------- **/
    screenWidth(newValue) {
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
  }
}
</script>
  
<style>
.messageAlertBox {
  max-width: 80vw !important;
}

.confirmMessageBox {
  max-width: 80vw !important;
}

.tips {
  font-size: 13px;
  text-align: center;
  margin-top: 40px;
}
</style>  