<template>
  <div class="categoriest">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="catList"
      style="width: 100%"
      v-loading="loading">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteCat(scope.row.cat_id)"></el-button>
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
    <!-- 增加分类 -->
    <el-dialog
      title="增加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules">
        <!-- 表单项 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 表单清空想要用效果，必须要有prop属性 -->
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            change-on-select
            :props="props"
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="addRules">
        <!-- 表单项 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'

export default {
  data () {
    return {
      catList: [],
      loading: true,
      current: 1, // 当前页
      pageSize: 10, // 每页的条数
      total: 0, // 总条数
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        id: ''
      },
      addRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    async getcatList () {
      const info = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = info.data
      if (meta.status === 200) {
        this.catList = data.result
        this.total = data.total
        this.loading = false
      }
    },
    // 处理当前页发生改变
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getcatList()
    },
    // 处理每页条数发生变化
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getcatList()
    },
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories?type=2')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加分类
    addCat () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const info = await this.axios.post('categories', {
            cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
            cat_name: this.addForm.cat_name,
            cat_level: this.addForm.cat_pid.length
          })
          const {meta} = info.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getcatList()
            this.$message.success('添加分类成功')
          }
        } else {
          this.$message.error('添加分类失败')
        }
      })
    },
    // 显示修改
    showEditDialog (cat) {
      this.editDialogVisible = true
      this.editForm.id = cat.cat_id
      this.editForm.cat_name = cat.cat_name
    },
    // 修改分类
    editCat () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await this.axios.put(`categories/${this.editForm.id}`, this.editForm)
        const {meta} = res.data
        if (meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getcatList()
          this.$message.success('修改成功')
        }
      })
    },
    // 删除分类
    async deleteCat (id) {
      try {
        await this.$confirm('此操作将永久删除该文件,请问是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.getcatList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created () {
    this.getcatList()
  },
  components: {
    // es6的属性名表达式：  es6允许对象的属性名是一个表达式，使用[]括起来
    [ElTreeGrid.name]: ElTreeGrid
  }

}
</script>

<style>

</style>
