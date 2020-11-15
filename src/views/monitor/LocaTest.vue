<template>
  <div ></div>
</template>

<script>
import Loca from 'Loca'
import data from './data'
export default {
  props: ['map'],
  data () {
    return {
      layer: null
    }
  },
  mounted () {
    const layer = new Loca.ScatterPointLayer({
      map: this.map
    })
    layer.setData(data, {
      lnglat: function (obj) {
        return obj.value
      }
    })
    layer.setOptions({
      style: {
        radius: 100, // 圆形半径，单位像素
        color: '#ffffff', // 填充颜色
        borderWidth: 0.5, // 边框宽度
        borderColor: '#ffffff' // 边框颜色
      }
    })
    layer.render()
  }
}
</script>

<style scoped>

</style>
