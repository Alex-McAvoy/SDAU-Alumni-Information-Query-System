<!--
 * @Description: Vue 主页
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
        <h2>查看联系人</h2>

        <el-card>
          <!-- 用户信息开始 -->
          <el-descriptions title="相关联系人列表" :column="1" border>
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
                <el-input v-model="keyword" placeholder="姓名/类型/手机号/行政编码" />
              </el-form-item>
            </el-row>
          </el-form>
          <!-- 搜索框结束 -->

          <!-- 表格开始 -->
          <el-table v-loading="listLoading" :data="list" stripe border class="table">
            <el-table-column label="序号" align="center">
              <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="o_name" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="o_type" label="类型" align="center">
            </el-table-column>
            <el-table-column prop="o_phone" label="手机号" align="center">
            </el-table-column>
            <el-table-column prop="o_township_code" label="行政编码" align="center">
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
        userId: '',
        username: '',
        authority: ''
      },
      /** ---------- 行政区域信息 ---------- **/
      district: [],
      /** ---------- 其他人员信息 ---------- **/
      listLoading: true, // 是否显示加载图标
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 2, // 每页记录数
      keyword: '', // 条件查询封装对象
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
    } else {
      this.user = userInfo
    }

    /** ---------- 绑定屏幕监听事件 ---------- **/
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }

    /** ---------- 获取分页数据 ---------- **/
    this.district = JSON.parse(localStorage.getItem('iqs-district'))
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

      if (this.district == null) {
        this.$alert("未分配行政区域", '查询失败', {
          confirmButtonText: '确定',
          customClass: 'messageAlertBox',
        })
      }
      else {
        // 负责行政区域代码列表
        let code_list = []
        for (let i of this.district) {
          code_list.push(i.township_code)
        }

        axios.get(this.$global.address + '/getOtherPageList', { // 查询请求
          params: {
            page: this.page,
            limit: this.limit,
            keyword: this.keyword,
            township_code: code_list
          }
        }).then((response) => { // 请求成功
          // 状态码
          let status = response.data.status
          if (status == 200) { // 登录成功
            let data = response.data.result
            let total = data.pop()

            this.total = total[0].o_total
            this.list = data
            this.listLoading = false
          } else { // 登录失败
            this.$alert(response.data.message, '查询失败', {
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
    },
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