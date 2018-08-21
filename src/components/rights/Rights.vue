<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      :data="rightlist"
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        label="层级">
       <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightlist: []
    }
  },
  methods: {
    async render () {
      const info = await this.axios.get('rights/list')
      const {data, meta} = info.data
      if (meta.status === 200) {
        this.rightlist = data
      }
    }
  },
  created () {
    this.render()
  }
}
</script>

<style lang="less">
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
</style>
