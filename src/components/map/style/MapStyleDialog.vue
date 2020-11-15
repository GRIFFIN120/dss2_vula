<template>
  <div v-if="dialogVisible">
    <el-drawer
      custom-class="drawer"
      title="地图样式参数"
      :visible.sync="drawer"
      direction="ltr"
      size="20%"
      :modal="false"
      append-to-body
    >
      <MetaForm :item="data" entity="map" type="control"></MetaForm>
    </el-drawer>

    <el-dialog
      title="地图样式"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <BaseMap ref="map" :style-param="data" @complete="loading = false" @loading="loading = true"></BaseMap>
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
import MetaForm from '~form'
export default {
  components: {
    BaseMap, MetaForm
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
      const defaultStyle = this.$utils.deepClone(this.$utils.constants.defaultMapStyle)
      this.data = this.$utils.objectMerge(defaultStyle, item)
      this.dialogVisible = true
    },
    confirm () {
      const bean = this.$utils.deepClone(this.data)

      bean.pitch = this.$refs.map.getMap().getPitch()
      bean.zoom = this.$refs.map.getMap().getZoom()
      bean.rotation = this.$refs.map.getMap().getRotation()

      this.$base.update('map', bean)
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
