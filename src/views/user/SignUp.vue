<template>
  <div>
    <el-dialog
      title="用户注册"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="600px"
      top="28vh"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="data" :rules="rules" ref="form" label-width="100px">
        <el-form-item prop="username" label="邮箱">
          <el-input v-model="data.username"  placeholder="请输入"   ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="data.password"  placeholder="请输入" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item prop="repeat" label="确认密码">
          <el-input v-model="data.repeat"  placeholder="请输入" type="password"  show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      if (this.occupied !== '' && value === this.occupied) {
        return callback(new Error('邮箱已被注册'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.data.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      data: {
        username: '',
        password: '',
        repeat: '',
        occupied: '-'
      },
      rules: {
        username: [
          { required: true, message: '邮箱不能为空', trigger: 'change' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        repeat: [
          { required: true, message: '再次输入的密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    confirm () {
      const th = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.data.roles = [5]
          this.$base.http.post('user/signup', this.data)
            .then(res => {
              if (res.code === 200) {
                th.dialogVisible = false
              } else {
                th.occupied = th.data.username
                th.$refs.form.validate()
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
