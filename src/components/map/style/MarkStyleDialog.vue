<template>
  <div v-if="dialogVisible">
    <el-drawer
      custom-class="drawer"
      title="多边样式形参数"
      :visible.sync="drawer"
      direction="ltr"
      size="20%"
      append-to-body
      :modal="false"
    >
      <MetaForm :item="data" entity="polygon" type="control"></MetaForm>
    </el-drawer>

    <el-dialog
      title="多边形样式"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <BaseMap ref="map" :style-param="1" @complete="loading = false" @loading="loading = true">
        <template v-slot="scope" >
          <BaseMarker :map="scope.map" :style-param="data"></BaseMarker>
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
import BaseMarker from '../overlayer/BaseMarker'
import MetaForm from '~form'

export default {
  components: {
    BaseMap, MetaForm, BaseMarker
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
      const defaultStyle = this.$utils.deepClone(this.$utils.constants.defaultPolygonStyle)
      this.data = this.$utils.objectMerge(defaultStyle, item)
      this.dialogVisible = true
    },
    confirm () {
      const bean = this.$utils.deepClone(this.data)

      this.$base.update('polygon', bean)
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
