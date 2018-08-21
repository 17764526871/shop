<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" ref="input" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" @keyup.enter.native="login" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在3-6位', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 表单校验 获取数据
      this.$refs.form.validate(async (info) => {
        if (info) {
          let res = await this.axios({
            method: 'post',
            url: 'login',
            data: this.form
          })
          if (res.data.meta.status === 200) {
            this.$message.success('登陆成功')
            // 设置localstorage
            localStorage.setItem('shoptoken', res.data.data.token)
            this.$router.push('home')
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  },
  created () {
    this.$nextTick(() => { this.$refs['input'].focus() })
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;

    img {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button ~ .el-button {
      margin-left: 80px;
    }
  }

}
</style>
