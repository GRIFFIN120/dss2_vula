<template>
    <div>
<!--      <el-button type="mini" style=" right: 50px ; bottom: 170px; position: absolute">将区域移动至边界内</el-button>-->
    </div>
</template>

<script>
import AMap from 'AMap'
export default {
  props: ['map', 'data', 'polygon'],
  data () {
    return {
    }
  },
  mounted () {
    const len = this.polygon.getPath().length
    if (len <= 100) {
      this.polygon.setOptions({ draggable: true })
      const th = this
      const polylineEditor = new AMap.PolyEditor(th.map, th.polygon)
      polylineEditor.open()
      this.$notify({
        title: '提示',
        message: '地图区域编辑功能已开启',
        type: 'success',
        duration: 3000
      })
    } else {
      this.$notify({
        title: '警告',
        message: '坐标点个数超过100个，为保证系统性能，地图区域编辑功能已关闭️，请使用数据文件编辑功能',
        type: 'warning',
        duration: 3000
      })
    }
  },
  methods: {
    panTo () {

    }
  }

}
</script>

<style scoped>

</style>
