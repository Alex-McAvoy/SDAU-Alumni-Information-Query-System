<!--
 * @Description: 查看校友页
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 04:20:49
-->
<template>
  <div id="showContact">
    <el-container>
      <!-- 导航栏开始 -->
      <el-header>
        <Nav-Menu></Nav-Menu>
      </el-header>
      <!-- 导航栏结束 -->
      <el-main>
        <h2>查看校友</h2>

        <el-card>
          <!-- 用户信息开始 -->
          <el-descriptions title="相关校友列表" :column="1" border>
            <!-- 按钮开始 -->
            <template slot="extra">
              <div v-if="screenWidth >= 600">
                <el-button type="primary" icon="el-icon-search" plain size="small" @click="fetchData()">搜索</el-button>
                <el-button icon="el-icon-refresh" plain size="small" @click="resetData">重置</el-button>
              </div>
              <div v-else>
                <el-button type="primary" icon="el-icon-search" circle plain size="small"
                  @click="fetchData()"></el-button>
                <el-button icon="el-icon-refresh" circle plain size="small" @click="resetData"></el-button>
              </div>
            </template>
            <!-- 按钮结束 -->
          </el-descriptions>
          <!-- 搜索框开始 -->
          <el-form label-width="70px" size="small">
            <el-row :gutter="30">
              <el-form-item label="关 键 字">
                <el-input v-model="keyword" placeholder="姓名/手机号/类型/所在市/所在县区/所在乡镇/具体位置/培训年限" />
              </el-form-item>
            </el-row>
          </el-form>
          <!-- 搜索框结束 -->

          <!-- 表格开始 -->
          <el-table v-loading="listLoading" :data="list" stripe border class="table">
            <el-table-column label="序号" align="center" width="50px">
              <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="o_name" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="o_phone" label="手机号" align="center" width="110px">
            </el-table-column>
            <el-table-column prop="o_type" label="类型" align="center" width="200px">
            </el-table-column>
            <el-table-column prop="o_city" label="所在市" align="center">
            </el-table-column>
            <el-table-column prop="o_county" label="所在县区" align="center">
            </el-table-column>
            <el-table-column prop="o_township" label="所在乡镇" align="center">
            </el-table-column>
            <el-table-column prop="o_address" label="具体地址" align="center" width="200px">
            </el-table-column>
            <el-table-column prop="o_year" label="培训年限" align="center">
            </el-table-column>
          </el-table>

          <!-- 分页组件开始 -->
          <el-pagination :current-page="page" :total="total" :page-size="limit" class="pagination"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />
          <!-- 分页组件结束 -->
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import navMenu from "@/components/NavMenu"
import axios from "axios"

export default {
  name: 'ShowContact',
  components: {
    'Nav-Menu': navMenu
  },
  data() {
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
      /** ---------- 其他人员信息 ---------- **/
      listLoading: true, // 是否显示加载图标
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      keyword: '', // 条件查询封装对象
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

    /** ---------- 获取分页数据 ---------- **/
    this.fetchData()
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
  },
  methods: {

    // 发送ajax请求，获取分页查询数据
    fetchData(page = 1) {
      this.page = page

      let city = this.user.city
      let county = this.user.county
      let township = this.user.township

      axios.get(this.$global.address + '/getOtherPageList', { // 查询请求
        params: {
          page: this.page,
          limit: this.limit,
          city: city,
          county: county,
          township: township,
          keyword: this.keyword
        }
      }).then((response) => { // 请求成功
        // 状态码
        let status = response.data.status
        if (status == 200) { // 查询成功
          let data = response.data.result
          let total = data.pop()

          this.total = total[0].o_total
          this.list = data
          this.listLoading = false
        }
        else { // 查询失败
          this.$alert(response.data.message, '数据查询失败', {
            confirmButtonText: '确定',
            customClass: 'messageAlertBox',
            // form表单清空
            callback: action => { // eslint-disable-line no-unused-vars
              this.keyword = ''
            }
          })
        }
      }).catch(result => { // 请求失败
        this.$message.error("查询失败" + result)
      })
    }
    ,
    // 重置查询表单
    resetData() {
      this.keyword = ''
      this.fetchData()
    }
  }
}
</script>
    
<style>
.messageAlertBox {
  max-width: 80vw !important;
}

.pagination {
  white-space: normal !important;
}
</style>  