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
      <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
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
            inactive-color="#ff4949"
            @change="changebuttom(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete"  @click="deleteUser(scope.row)"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
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
    <!-- 增加用户对话框 -->
      <el-dialog
          title="增加用户"
          :visible.sync="addDialogVisible"
          width="40%">
        <el-form
        ref="addform"
        :model="addform"
        label-width="70px"
        :rules="addRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addform.username" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addform.password" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addform.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addform.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="40%">
        <el-form
        ref="editForm"
        :model="editForm"
        label-width="70px"
        :rules="addRules">
          <el-form-item label="用户名" >
            <el-tag type="info">{{editForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
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
      tableData: [],
      addDialogVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: { // 添加用户的校验规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱的格式', trigger: 'blur' }
        ],
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机格式', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      assignDialogVisible: false, // 分配角色的对话框
      assignForm: {
        username: '',
        rid: '',
        id: ''
      },
      userList: [], // 用户的数据
      options: []
    }
  },
  methods: {
    async render () {
      const res = await this.axios({
        method: 'get',
        url: 'users',
        // 如果是get请求的参数，要不就拼到url后面
        // 使用params参数，不能使用data
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        // 获取到数据了
        this.tableData = data.users
        this.total = data.total
      }
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
    },
    async changebuttom (data) {
      const info = await this.axios.put(`users/${data.id}/state/${data.mg_state}`)
      const {meta: {status}} = info.data
      if (status === 200) {
        this.$message.success('修改用户状态成功')
      } else {
        this.$message.error('修改用户状态失败')
      }
    },
    async deleteUser (data) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.axios.delete(`users/${data.id}`).then(info => {
          const {status} = info.data.meta
          if (status === 200) {
            // 如果当前页只有一条数据了，需要让页数减1
            if (this.tableData.length === 1) {
              this.pagenum--
            }
            this.$message.success('恭喜你，删除成功')
            this.render()
          }
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    addUser () {
      this.$refs.addform.validate(async valid => {
        if (valid) {
          const info = await this.axios.post('users', this.addform)
          if (info.data.meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addform.resetFields()
            this.total++
            this.pagenum = Math.ceil(this.total / this.pagesize)
            this.render()
            this.$message.success('恭喜你,添加用户成功了')
          } else {
            this.$message.error(info.data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 修改显示数据
    showEditDialog (data) {
      console.log(data)
      this.editDialogVisible = true
      this.editForm.username = data.username
      this.editForm.email = data.email
      this.editForm.mobile = data.mobile
      this.editForm.id = data.id
    },
    // 提交修改请求
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const info = await this.axios.put(`users/${this.editForm.id}`, this.editForm)
          if (info.data.meta.status === 200) {
            this.$message.success('修改成功')
            this.$refs.editForm.resetFields()
            this.editDialogVisible = false
            this.render()
          } else {
            this.$message.error('修改失败')
          }
        } else {
          return false
        }
      })
    },
    // 显示分配权限表
    async showAssignDialog (info) {
      this.assignDialogVisible = true
      this.assignForm.username = info.username
      this.assignForm.id = info.id
      // 回显列表
      const res = await this.axios.get(`users/${info.id}`)
      if (res.data.meta.status === 200) {
        if (res.data.data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = res.data.data.rid
        }
      }
      const res2 = await this.axios.get('roles')
      const {meta, data} = res2.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加权限
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      if (res.data.meta.status === 200) {
        this.assignDialogVisible = false
        this.render()
        this.$message.success('分配用户角色成功')
      }
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
