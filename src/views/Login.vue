<template>
  <div class="login-container">
    <div class="login-box">

        <el-row justify="space-between" style="margin-top: 20px">
          <el-col :span="4" >
            <div class="login-avatar">
              <img src="../assets/logo.png">
            </div>
          </el-col>
          <el-col :span="20" align="center" >
            <h2>{{$settings.title}}</h2>
          </el-col>
        </el-row>

      <el-form ref="loginFormRef"
               :model="loginForm"
               :rules="loginRules"
               label-width="60px" class="login-form">
        <el-form-item prop="username" label="邮箱">
          <el-input v-model="loginForm.username" disabled prefix-icon="fa fa-envelope"  placeholder="请输入用户名" ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" disabled prefix-icon="fa fa-lock" placeholder="请输入密码" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">

          <el-button style="margin-right: 18px" :disabled="true" type="text" @click="$refs.signup.open()" >注册</el-button>
          <el-button :loading="loading" :disabled="true" type="success" @click.native.prevent="submitLoginForm" >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <SingUp ref="signup"></SingUp>
  </div>
</template>

<script>
import SingUp from './user/SignUp'
export default {
  name: 'Login',
  components: { SingUp },
  data () {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      if (value === 'admin') return callback()
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '邮箱不能为空', trigger: 'change' },
          { validator: checkEmail, trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入登录名称', trigger: 'change' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  mounted () {
    const url = window.location.href
    const obj = this.$utils.getQueryObject(url)
    const token = obj.token
    if (token) {
      this.$cookies.set('TOKEN', token)
      this.$base.auth(token)
        .then(res => {
          if (res.code !== 200) {
            this.statusError()
          } else {
            this.checkStatus(res.data)
          }
        })
    } else {
      this.statusError()
    }
  },
  methods: {

    checkStatus (data) {
      const user = {
        username: data.email,
        name: data.name,
        affiliation: data.deptName,
        phone: data.phone
      }
      this.$base.http.post('user/checkLocal', user)
        .then(res => {
          this.$cookies.set('UID', res.data.id)

          this.$router.push('/home')
        })
    },

    statusError () {
      this.$alert('用户未登录或登录状态已失效，请重新登录。', '重新登录', {
        confirmButtonText: '确定',
        callback: action => {
          document.location.href = 'http://59.110.0.232:9000/shalegas/login'
        }
      })
    },

    submitLoginForm () {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          const th = this
          this.$base.http.post('/user/login', this.loginForm)
            .then(res => {
              const user = res.data
              if (user) {
                const user = res.data
                const token = user.token
                this.$cookies.set('TOKEN', token)
                this.$cookies.set('UID', user.id)
                th.$router.push('/home')
              }
              th.loading = false
            }).catch(() => {
              th.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    background-color: #1f2d3d;
    height: 100%;
  }
  .login-box{
    width: 400px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .login-avatar{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-top: 10px;
      margin-left: 20px;
      /*border: 1px solid #aaa;*/
      /*padding: 10px;*/
      /*box-shadow: 0 0 10px;*/
      /*position: absolute;*/
      /*left: 50%;*/
      /*transform: translate(-50%,-50%);*/
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
