<template>
  <div style="text-align: center">
    <el-upload
      class="upload"
      ref="upload"
      drag
      :action="action"
      :data="data"
      :on-success="success"
      :before-upload="beforeUpload"
      :on-error="error"
      :accept="accept"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>

</template>

<script>

export default { // @success
  props: {
    action: {
      type: String
    },
    data: {
      type: Object
    },
    accept: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      loading: null
    }
  },
  mounted () {
  },
  methods: {
    error (err) {
      this.$message.error(err)
      this.loading.close()
    },
    success (res) {
      this.loading.close()
      if (res.code === 200) {
        this.$message.success(res.message)
        this.$emit('success')
      } else {
        this.$refs.upload.clearFiles()
        if (res.code === 500) {
          this.$alert(res.message, '登录失效', {
            confirmButtonText: '确定',
            callback: action => {
              // 登录
              this.$router.push('/login')
            }
          })
        } else {
          this.$message.error(res.message)
        }
      }
    },
    beforeUpload (file) {
      const isSizeOk = file.size / 1024 / 1024 < this.size

      if (!isSizeOk) {
        this.$message.error('上传文件大小不能超过 ' + this.size + 'MB!')
        return false
      }
      this.loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.15)'
      })
      return true
    }
  }
}
</script>

<style scoped>
  .upload{
    width: 100%;
  }
  .upload .el-upload{
    width: 100% !important;
  }

</style>
