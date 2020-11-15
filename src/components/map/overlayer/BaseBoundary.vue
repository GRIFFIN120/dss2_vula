<template>
  <div>
    <div v-if="loaded">
      <slot :map="map" :border="overlays" ></slot>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  props: ['map', 'StyleParam', 'paths', 'fitView'],
  data () {
    return {
      entity: 'polygon',
      loaded: false,
      object: null,
      style: {},
      overlays: []
    }
  },
  beforeMount () {
    const arr = []
    for (const i in this.paths) {
      const path = this.paths[i]
      arr.push(this.$base.dfs.get({ path: path }, 'path'))
    }
    this.$base.http.all(arr)
      .then(all => {
        const paths = []
        all.filter((p) => { paths.push(p.data) })
        this.createObject(paths)
      })
  },
  methods: {
    createObject (paths) {
      const th = this
      // 设定淹模
      const outer = [
        new AMap.LngLat(-360, 90, true),
        new AMap.LngLat(-360, -90, true),
        new AMap.LngLat(360, -90, true),
        new AMap.LngLat(360, 90, true)
      ]
      const pathArray = [
        outer
      ]
      // 构造边界数组
      this.overlays = [] // 用于fitView
      paths.filter((path) => {
        const arr = [path]
        pathArray.push.apply(pathArray, arr)
        this.overlays.push(new AMap.Polygon({
          path: path
        }))
      })
      // 创建多边形
      this.object = new AMap.Polygon({
        path: pathArray,
        zIndex: 4
      })
      this.object.isBorder = true // 标记为边界
      // 添加多边形点击事件 -> fitView
      this.object.on('click', function () {
        th.map.reFitView()
      })
      // 设定样式
      this.setOptions()
      // 添加到地图
      this.map.add(this.object)
      // 创建完成后fitView
      if (this.fitView) {
        this.map.setFitView(this.overlays)
      }
      // 加载完成 -> 开启slot
      this.loaded = true
    },

    setOptions () {
      const options = this.$utils.deepClone(this.$utils.constants[this.entity])
      if (this.StyleParam && typeof (this.StyleParam) === 'number') {
        this.$base.get(this.entity, this.StyleParam)
          .then(res => {
            this.$utils.objectMerge(options, res.data)
            this.object.setOptions(options)
          })
      } else {
        this.object.setOptions(options)
      }
    }
  }
}
</script>

<style scoped>

</style>
