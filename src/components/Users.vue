<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <!-- scope.row可以获取到整行的数据 -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check">分配角色</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :page-sizes="[2, 4, 6, 8]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      tableData: []
    }
  },
  methods: {
    render () {
      this.axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          'Authorization': localStorage.getItem('shoptoken')
        }
      }).then(info => {
        const meta = info.data.meta
        const data = info.data.data
        if (meta.status === 200) {
          this.tableData = data.users
          this.total = data.total
        }
      })
    },
    search () {
      this.pagenum = 1
      this.render()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.render()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.render()
    }
  },
  created () {
    this.render()
  }
}
</script>

<style>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.el-pagination {

  margin-top: 30px;
}
</style>
