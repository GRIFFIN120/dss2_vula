<template>
<!--  <div v-if="dialogVisible">-->
    <el-drawer
      custom-class="drawer"
      :title="title"
      destroy-on-close
      :visible.sync="dialogVisible"
      :direction="dir"
      :size="width"
      :close-on-click-modal="false"
      @close="close"
      :append-to-body="true"
    >
      <slot :data="data"></slot>
    </el-drawer>
<!--  </div>-->
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
    dir: {
      type: String,
      default: 'rtl'
    },
    clone: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      data: {},
      dialogVisible: false
    }
  },
  methods: {
    open (item) {
      this.data = this.clone ? this.$utils.deepClone(item) : item
      this.dialogVisible = true
    },
    confirm () {
      this.$emit('confirm', this.data)
      this.dialogVisible = false
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
