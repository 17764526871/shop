<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="mb_10" plain type="success" @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table
    :data="roleslist"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 提示 -->
        <el-row v-if="scope.row.children.length === 0">
          <span>该角色没有任何权限</span>
        </el-row>
        <!-- 一级权限 -->
        <el-row class="mb_10 level" v-for="lv1 in scope.row.children" :key="lv1.id">
          <el-col :span="4">
            <el-tag closable  @close="deleteRight(scope.row, lv1.id)">{{lv1.authName}}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <!-- 二级权限 -->
            <el-row class="mb_10" v-for="lv2 in lv1.children" :key="lv2.id">
              <el-col :span="4">
                <el-tag closable type="success" @close="deleteRight(scope.row, lv2.id)">{{lv2.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 三级权限 -->
                <span class="mr_10" v-for="lv3 in lv2.children" :key="lv3.id">
                  <el-tag closable type="warning" @close="deleteRight(scope.row, lv3.id)">{{lv3.authName}}</el-tag>
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignRight(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
  </el-table>
    <!-- 添加对话框 -->
    <el-dialog
          title="增加角色"
          :visible.sync="addDialogVisible"
          width="40%">
        <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="addRules">
        <!-- 表单项 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%">
        <el-tree
          :data="rightList"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          ref="tree"
          :props="defaultProps">
        </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleslist: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignDialogVisible: false,
      rightList: [],
      assignRoleId: '', // 需要分配权限的角色id
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async render () {
      const info = await this.axios.get('roles')
      const {meta, data} = info.data
      if (meta.status === 200) {
        this.roleslist = data
      } else {
        return false
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加权限
    addRole () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const info = await this.axios.post('roles', this.addForm)
          const {meta} = info.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.render()
            this.$message.success('添加成功')
          }
        } else {
          return false
        }
      })
    },
    // 显示修改框并赋值
    showEditDialog (data) {
      this.editDialogVisible = true
      this.editForm.roleName = data.roleName
      this.editForm.roleDesc = data.roleDesc
      this.editForm.id = data.id
    },
    // 修改权限
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const info = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const {meta} = info.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.render()
            this.$message.success('修改成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除权限
    async deleteRole (role) {
      try {
        await this.$confirm('你确定要删除当前角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const info = await this.axios.delete(`roles/${role.id}`)
        const {meta} = info.data
        if (meta.status === 200) {
          this.render()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 分配权限
    async showAssignRight (role) {
      this.assignDialogVisible = true
      // 获取所有的角色的权限
      const info = await this.axios.get('rights/tree')
      const {meta, data} = info.data
      this.assignRoleId = role.id
      if (meta.status === 200) {
        this.rightList = data
        // 获取到三级权限
        const checkedKeys = []
        role.children.forEach(lv1 => {
          lv1.children.forEach(lv2 => {
            lv2.children.forEach(lv3 => {
              checkedKeys.push(lv3.id)
            })
          })
        })
        console.log(checkedKeys)
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    // 分配权限
    async assignRight () {
      // 获取选中的id
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取半选状态id
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 发送请求
      const info = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: [...checkedKeys, ...halfCheckedKeys].join()
      })
      const {meta} = info.data
      console.log(meta)
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.render()
        this.$message.success('分配权限成功')
      }
    },
    // 删除指定权限
    async deleteRight (role, rightid) {
      const info = await this.axios.delete(`roles/${role.id}/rights/${rightid}`)
      const {meta, data} = info.data
      if (meta.status === 200) {
        role.children = data
        this.$message.success('删除成功')
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

.mb_10 {
  margin-bottom: 10px;
}

.mr_10 {
  margin-right: 10px;
}

.level1 {
  border-bottom: 1px dotted #ccc;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
