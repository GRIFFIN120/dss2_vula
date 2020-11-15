<template>
  <div>
    <el-dialog
      title="密码修改"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="400px"
      :append-to-body="true"
    >
      <el-form :model="data" :rules="rules" ref="form" label-width="100px">
        <el-form-item prop="former" label="原密码">
          <el-input v-model="data.former"  placeholder="请输入" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item prop="current" label="新密码">
          <el-input v-model="data.current"  placeholder="请输入" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item prop="check" label="密码确认">
          <el-input v-model="data.check"  placeholder="请输入" type="password"  show-password></el-input>
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
  props: ['uid'],
  data () {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.data.current) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      data: {
        former: '',
        current: '',
        check: ''
      },
      rules: {
        former: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        current: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        check: [
          { required: true, message: '不能为空', trigger: 'blur' },
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.uid)
          this.data.id = this.uid
          this.$base.http.post('user/changePassword', this.data)
            .then(res => {
              if (res.code === 200) this.dialogVisible = false
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
