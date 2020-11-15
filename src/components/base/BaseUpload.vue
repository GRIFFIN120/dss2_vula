 <template>
  <div style="text-align: center">
    <el-upload
      class="upload"
      drag
      :action="action"
      :on-success="success"
      :before-upload="beforeUpload"
      :on-error="error"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

  </div>

</template>

<script>
export default {
  props: {
    entity: {},
    type: {
      default: 'file' // file or image
    },
    data: {},
    accept: {
      type: Array,
      default () {
        return []
      }
    },
    size: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      loading: null,
      action: ''
    }
  },
  mounted () {
    const checkType = this.type === 'image' || this.type === 'file'

    if (!this.data || !this.data.id || !this.entity || !checkType) {
      this.$message.error('组件参数缺失')
      this.$emit('close')
    } else {
      this.action = this.$base.dfs.action(this.entity, this.type, this.data.id)
    }
  },
  methods: {
    error (err) {
      console.log(err)
      this.loading.close()
    },
    success () {
      this.loading.close()
      this.$message.success('上传成功')
      this.$emit('success')
    },
    beforeUpload (file) {
      const acpt = this.accept.filter(function (e) {
        return e === file.type
      })

      const isJPG = this.accept.length === 0 || acpt.length !== 0
      const isLt2M = file.size / 1024 / 1024 < this.size

      if (!isJPG) {
        this.$message.error('上传文件只能是 ' + this.accept + ' 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      const flag = isJPG && isLt2M
      if (flag) {
        this.loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.15)'
        })
      }
      return flag
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
