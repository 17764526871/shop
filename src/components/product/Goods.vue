<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加 -->
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 列表 -->
    <el-table
      :data="goodList"
      style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="商品时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" ></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" ></el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      background
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="current"
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
      goodList: [],
      query: '',
      current: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 1 // 总数
    }
  },
  methods: {
    async render () {
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      }
    },
    // 处理当前页发生改变
    handleCurrentChange (val) {
      this.current = val
      this.render()
    },
    // 处理每页条数发生变化
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.render()
    },
    indexMethod (index) {
      return (this.current - 1) * this.pageSize + index + 1
    }
  },
  created () {
    this.render()
  }
}
</script>

<style>

</style>
