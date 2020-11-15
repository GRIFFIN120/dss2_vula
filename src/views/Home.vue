<template>
    <el-container class="home-container">
      <el-header >

        <div>
          <!--  标题        -->
          <span style="cursor: pointer" @click="$router.push('/welcome')">
            {{$settings.title}}</span>
        </div>

        <div>
          <SystemButton v-if="USER.username=='admin'"></SystemButton>

          <el-dropdown @command="handleChange">
            <el-button type="text">
              <span style="margin-right: 40px;display: flex;justify-content: space-between; align-items: center; font-size: 14px">
               欢迎您！{{USER.name}}
              </span>
            </el-button>
            <el-dropdown-menu  slot="dropdown">
              <el-dropdown-item command="userProfile">个人信息</el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="userLogout">登出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!--  菜单        -->
        <el-aside :width="$store.state.menu.collapse? '64px' : '230px'">
          <Menu :active="$store.state.menu.activedPath" :tree="this.$store.state.menu.menu"></Menu>
        </el-aside>
        <el-container style="z-index: 1000;">
          <el-main>
            <el-row>
              <el-col :span="24" class="nav-col">
                <div style="display: flex;align-items: center;">
                  <!--  菜单折叠按钮        -->
                  <el-button size="mini" plain type="info" class="fold-btn" @click="collapse" >
                    <i :class="$store.state.menu.collapse? 'el-icon-s-unfold' : 'el-icon-s-fold' "></i>
                  </el-button>
                  <!--  面包屑        -->
                  <MenuBreadcrumb :selected-path="$store.state.menu.activedLocation" ></MenuBreadcrumb>
                </div>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <!--  主体        -->
                <el-card class="box-card">
                  <router-view/>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
          <el-footer height="30px"></el-footer>
        </el-container>
      </el-container>
      <BaseDialog ref="profile" @confirm="profileConfirm"  title="个人信息" width="400px" :clone="true" >
        <template v-slot="{data}">
          <!--  3. 引入对话框中的模版  -->
          <BaseForm :item="data" entity="user" type="control"></BaseForm>
        </template>
      </BaseDialog>
      <Password ref="password" :uid="UID" ></Password>
    </el-container>
</template>

<script>
import Menu from '../components/base/menu/Menu'
import MenuBreadcrumb from '../components/base/menu/MenuBreadcrumb'
import BaseDialog from '~dialog'
import BaseForm from '~form'
import Password from './user/Password'
import SystemButton from '../components/base/system/SystemButton'
export default {
  name: 'Home',
  components: {
    Menu,
    MenuBreadcrumb,
    BaseDialog,
    BaseForm,
    Password,
    SystemButton
  },
  data () {
    return {
      MENU: [],
      UID: null,
      USER: {}
    }
  },
  beforeMount () {
    this.UID = parseInt(this.$cookies.get('UID'))
    this.$base.get('user', this.UID)
      .then(res => {
        this.USER = res.data
        this.$cookies.set('USER', this.USER)
        this.$store.dispatch('menu/getMenu', this.USER)

        if (this.USER.name === undefined || this.USER.name.trim === '') {
          this.$notify({
            title: '通知',
            message: '系统检测到您的账户未设置姓名，请补充。',
            type: 'warning'
          })

          this.$refs.profile.open(this.USER)
        }
      })
  },
  mounted () {
    let t = this.$router.options.routes
    t = t.filter((item) => {
      return item.path === '/home'
    })
    if (t.length !== 0) {
      const paths = []
      for (const route of t[0].children) {
        if (route.path !== '/') {
          paths.push({ code: route.path, name: route.name })
        }
      }
      this.$utils.constants.routes = paths
    }
  },
  methods: {
    handleChange (command) {
      this[command]()
    },
    collapse () {
      this.$store.commit('menu/COLLAPSE')
    },
    userLogout () {
      this.$confirm('是否登出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$cookies.remove('USER')
        this.$cookies.remove('TOKEN')
        this.$router.push('/')
      }).catch(() => {})
    },
    userProfile () {
      this.$refs.profile.open(this.USER)
    },
    profileConfirm (data) {
      this.$base.update('user', data)
        .then(res => {
          this.USER = res.data
        })
    },
    changePassword () {
      this.$refs.password.open()
    },
    passwordConfirm (data) {
      console.log(data)
    }
  }

}
</script>

<style scoped lang="less">
.fold-btn{
  margin-right: 15px;
  i{
    font-size: 20px;
  }
}
.nav-col {
  margin-bottom: 20px;
}

.box-card{
  width: 100%;
}
.home-container{
  height: 100%;
}
.el-header{
  background-color: #203744;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  border-top: 1px solid #203744;
  border-bottom: 1px solid #203744;
  > div {
    display: flex;
  }
}
.el-aside{
  background-color: #fbfaf5;
  border-right: 1px solid #cbb994;
  border-bottom: 1px solid #cbb994;
}
.el-main{
  background-color: #eae5e3;
}
.el-footer{
  background-color: #203744;
  border-top: 1px solid #203744;
  border-bottom: 1px solid #203744;
}
</style>
