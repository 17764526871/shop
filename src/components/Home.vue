<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8"><div class="grid-content  logo"></div></el-col>
          <el-col :span="8"><div class="grid-content title">电商管理系统</div></el-col>
          <el-col :span="8"><div class="grid-content logout">欢迎管理
            <a href="javascript:;" @click="logout"><el-button size="mini" type="info" plain>退出</el-button></a>
            </div></el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- el-menu: 导航菜单的组件 -->
          <!-- default-active：默认高亮的菜单 -->
          <!-- open close 展开和关闭的事件 -->

          <!-- el-submenu: 子菜单 -->
          <!-- el-menu-item-group: 子菜单中分组 -->
          <!-- el-menu-item：子菜单中的每一项 -->
          <!-- unique-opened: 保证只能打开一个子菜单 -->
          <!-- router: 如果router为true，那么index就会作为路由的连接 -->
            <el-menu
            router
            unique-opened
            :default-active="$route.path.slice(1).split('-')[0]"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{l1.authName}}</span>
              </template>
              <!-- 当给el-menu指定了router -->
              <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{l2.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 子组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async  logout () {
      try {
        await this.$confirm('你确定要退出嘛?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('shoptoken')
        this.$router.push('/login')
      } catch (e) {
        this.$message.error('取消退出')
      }
    },
    async getMenuList () {
      const info = await this.axios.get('menus')
      const {meta, data} = info.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less">
.home {
  height: 100%;
  > .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #b3c1cd;
    .logo {
    float: left;
    width: 180px;
    height: 60px;
    background: url(../assets/logo.png) no-repeat center center;
    background-size: contain;
   }
   .logout {
      float: right;
      width: 180px;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      font-weight: 700;
      text-align: right;

    }

    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      color: #fff;
      text-align: center;
      font-size: 24px;
    }

  }
  .el-aside {
    background-color: #545C64;
    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #EAEEF1;
  }
}
</style>
