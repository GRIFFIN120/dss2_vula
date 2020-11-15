<template>
  <div v-if="dialogVisible">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      destroy-on-close
      :width="width"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <DialogForm ref="form" :item="item" :meta="meta" :editable="editable" :search="search" :param="param"></DialogForm>

      <span v-if="editable" slot="footer" class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button  @click="$refs.form.reset()" type="info">重 制</el-button>
        <el-button  @click="confirm" type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DialogForm from './DialogForm'
export default {
  props: ['entity', 'meta', 'title', 'width', 'search', 'param'],
  components: { DialogForm },
  data () {
    return {
      dialogVisible: false,
      item: {},
      editable: false
    }
  },
  watch: {
  },
  methods: {
    open (item, editable) {
      this.editable = editable
      this.item = item
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    confirm () {
      const th = this
      this.$refs.form.confirm(function (data) {
        const bean = th.$utils.deepClone(data)
        for (const key in bean) {
          const value = bean[key]
          const keyType = typeof (value)
          if (keyType === 'object' || keyType === 'array') {
            delete bean[key]
          }
        }
        th.$base.update(th.entity, bean)
          .then(res => {
            th.dialogVisible = false
            th.$emit('confirm', res.data)
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
