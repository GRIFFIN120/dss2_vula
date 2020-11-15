<template>
  <div v-if="dialogVisible">
    <el-drawer
      custom-class="drawer"
      title="折线样式参数"
      :visible.sync="drawer"
      direction="ltr"
      size="20%"
      :modal="false"
      append-to-body
    >
      <MetaForm :item="data" entity="polyline" type="control"></MetaForm>
    </el-drawer>

    <el-dialog
      title="折线样式"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <BaseMap ref="map" :style-param="1" @complete="loading = false" @loading="loading = true">
        <template v-slot="scope" >
          <BasePolyline :map="scope.map" :style-param="data"></BasePolyline>
        </template>
      </BaseMap>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="drawer=true" type="success" style="float:left">编 辑</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import BaseMap from '../BaseMap'
import BasePolyline from '../overlayer/BasePolyline'
import MetaForm from '~form'

export default {
  components: {
    BaseMap, MetaForm, BasePolyline
  },
  data () {
    return {
      data: {},
      drawer: false,
      dialogVisible: false,
      loading: true
    }
  },
  methods: {
    open (item) {
      const defaultStyle = this.$utils.deepClone(this.$utils.constants.defaultPolylineStyle)
      this.data = this.$utils.objectMerge(defaultStyle, item)
      this.dialogVisible = true
    },
    confirm () {
      const bean = this.$utils.deepClone(this.data)
      console.log(bean)
      this.$base.update('polyline', bean)
        .then(() => {
          this.dialogVisible = false
          this.$emit('reload')
        })
    }
  }
}
</script>

<style scoped>

</style>
