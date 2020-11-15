<template>
  <div v-if="dialogVisible">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      destroy-on-close
      :width="width"
      :top="top"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="close"
    >

      <slot :data="data"></slot>

      <span v-if="buttons" slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '对话框'
    },
    width: {
      type: String,
      default: '40%'
    },
    clone: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Boolean,
      default: true
    },
    top: {
      type: String,
      default: '10vh'
    },
    sync: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      data: {},
      dialogVisible: false
    }
  },
  methods: {
    open (item, callback) {
      if (item) {
        this.data = this.clone ? this.$utils.deepClone(item) : item
      }
      this.dialogVisible = true
      setTimeout(function () {
        if (callback) callback()
      }, 10)
    },
    confirm () {
      if (this.sync) {
        const th = this
        this.$emit('confirm', this.data, function (flag) {
          if (flag) {
            th.dialogVisible = false
          }
        })
      } else {
        this.$emit('confirm', this.data)
        this.dialogVisible = false
      }
    },
    close () {
      this.$emit('cancel', this.data)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
