<!--
 * @Description: Vue 主页
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
        <el-card>
          <!-- 用户信息开始 -->
          <el-descriptions title="用户信息" :column="1" border>
            <!-- 按钮开始 -->
            <template slot="extra">
              <div v-if="screenWidth >= 600">
                <el-button type="primary" icon="el-icon-edit" plain size="small"
                  @click="showUpdatePasswordDialog(user.userId)">修改密码</el-button>
                <el-button type="danger" icon="el-icon-switch-button" plain size="small" @click="logout">登出</el-button>
              </div>
              <div v-else>
                <el-button type="primary" icon="el-icon-edit" circle plain size="small"
                  @click="showUpdatePasswordDialog(user.userId)"></el-button>
                <el-button type="danger" icon="el-icon-switch-button" circle plain size="small"
                  @click="logout"></el-button>
              </div>
            </template>
            <!-- 按钮结束 -->
            <!-- 信息展示开始 -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user" />
                用户名
              </template>
              {{ user.username }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard" />
                姓名
              </template>
              {{ user.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone" />
                手机号
              </template>
              {{ user.phone }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets" />
                角色
              </template>
              <el-tag size="small">{{ user.authority == 1 ? '教师' : '学生' }}</el-tag>
            </el-descriptions-item>
            <!-- 信息展示结束 -->
          </el-descriptions>
           <!-- 用户信息结束 -->
           <!-- 负责行政区域开始 -->
          <el-collapse>
            <el-collapse-item title="负责行政区域" name="1">
              <el-table :data="district" stripe>
              <el-table-column prop="city" label="负责区域所在市">
              </el-table-column>
              <el-table-column prop="county" label="负责区域所在县区">
              </el-table-column>
              <el-table-column prop="township" label="负责区域所在乡镇">
              </el-table-column>
              <el-table-column prop="township_code" label="乡镇行政代码">
              </el-table-column>
            </el-table>
            </el-collapse-item>
          </el-collapse>
           <!-- 负责行政区域结束 -->
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
        <!-- 修改用户密码模态框结束 -->

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
        userId: '', // 用户id
        username: '', // 工号/学号
        authority: '', // 1教师，2学生
        name: '', // 姓名
        phone: '' // 手机
      },
      /** ---------- 负责行政区域信息 ---------- **/
      district: [],
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

    /** ---------- 获取负责区域 ---------- **/
    let district = JSON.parse(localStorage.getItem('iqs-district'))
    if (district == null) { // 本地存储中不存在
      axios.get(this.$global.address + '/getDistrict', { // 发起查询请求
        params: {
          userId: this.user.userId,
          authority: this.user.authority
        }
      }).then((response) => { // 请求成功
        // 状态码
        let status = response.data.status
        if (status == 200) { // 查询成功，获取数据并存储到本地
          let data = response.data.result
          for (let i = 0; i < data.length; i++) {
            let tempObj = {
              city: data[i].city,
              county: data[i].county,
              township: data[i].township,
              township_code: data[i].township_code,
            }
            this.district.push(tempObj)
          }
          this.district = data

          /** ---- 查询成功进行存储 ---- **/
          // 存储到store
          this.$store.state.district = this.district
          // 存储到本地
          localStorage.setItem('iqs-district', JSON.stringify(this.district))
        } else { // 查询失败，获取数据
          this.$alert('无可用负责行政区数据', '查询失败', {
            customClass: 'messageAlertBox',
            confirmButtonText: '确定'
          })
          this.district = [{
            city: "null",
            county: "null",
            township: "null",
            township_code: "null"
          }]

        }
      }).catch(result => { // 请求失败
        this.$message.error("请求失败" + result)
      })
    } else { //本地存储中存在
      this.district = district
    }
  },
  methods: {
    /** ---------- 登出 ---------- **/
    logout() {
      this.$confirm('是否登出？', '提示', {customClass: 'confirmMessageBox'})
        .then(() => { //确认操作
          // 删除本地存储
          localStorage.removeItem('iqs-userInfo')
          localStorage.removeItem('iqs-district')
          // 路由跳转
          this.$router.push({
            name: 'login'
          })
          this.$message.warning("登出成功")
        })
        .catch(() => { //取消操作
          this.$message.info("取消登出")
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
              this.$message.warning("修改成功")
            } else { // 修改失败
              this.$alert('原密码错误', '提示', {
                confirmButtonText: '确定',
                // form表单清空
                callback: action => { // eslint-disable-line no-unused-vars
                  this.updatePasswordForm.oldPassword = '',
                    this.updatePasswordForm.newPassword = ''
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
  max-width: 80vw!important;
}
.confirmMessageBox {
  max-width: 80vw!important;
}
.tips {
  font-size: 13px;
  text-align: center;
  margin-top: 40px;
}
</style>  