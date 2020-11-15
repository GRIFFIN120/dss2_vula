<template>
  <el-card class="box-card">
    <div ref="mapContainer" id="container" style="width:100%; height:500px" ></div>
    <div v-if="loaded">
      <slot :map="map" ></slot>
    </div>
    <el-select
      v-if="changeable"
      v-model="styleId"
      @change="changeStyle"
      size="small"
      style="box-shadow: 3px 3px 3px #1f2d3d; border: 1px solid #1f2d3d; position: absolute; left: 55px ; top: 120px"
    >
      <el-option
        v-for="item in selects"
        :key="item.id"
        :value="item.id"
        :label="item.name"
      >
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
      </el-option>
    </el-select>

  </el-card>
</template>

<script>
import AMap from 'AMap'
import mapmix from './overlayer/mapmix'
import html2canvas from 'html2canvas'
export default {
  props: ['StyleParam', 'changeable'], // @loading, @complete(map), @click(map,data) // bean 只用于样式编辑
  mixins: [mapmix], //  getMap, setLayers, setControl, getFeatures, getOptions
  data () {
    return {
      loaded: false,
      map: null,
      style: {},
      data: {
        zoom: null,
        lng: null,
        lat: null
      },
      editor: false,
      selects: [],
      styleId: 0
    }
  },
  watch: {
    StyleParam: { // 仅用与样式编辑
      handler: function () {
        this.init()
      },
      deep: true
    }
  },
  mounted () {
    if (this.changeable) {
      this.styleId = this.StyleParam
      this.$base.http.get('map/simple')
        .then(res => {
          this.selects = res.data
        })
    }

    this.init()
  },
  methods: {
    changeStyle (val) {
      this.$base.get('map', val)
        .then(res => {
          this.style = res.data
          this.initMap()
        })
    },
    init () {
      if (this.StyleParam instanceof Object) {
        this.style = this.StyleParam
        this.editor = true
        this.initMap()
      } else if (typeof (this.StyleParam) === 'number') {
        this.$base.get('map', this.StyleParam)
          .then(res => {
            this.style = res.data
            this.initMap()
          })
      }
    },
    initMap () {
      if (this.map) {
        console.log('mapComplete')
        this.mapComplete()
      } else {
        console.log('createMap')
        this.createMap()
      }
    },
    createMap () {
      const th = this
      this.$emit('loading')
      //
      const options = {
        doubleClickZoom: false,
        labelzIndex: 5,
        viewMode: this.style.viewMode,
        showLabel: this.style.showLabel
      }
      const map = new AMap.Map('container', options)
      this.map = map
      map.reFitView = function () {
        const overlays = this.getAllOverlays()
        const overs = []
        overlays.filter(function (o) {
          if (o.isBorder) {
            const borderPath = o.getPath()[1]
            overs.push(new AMap.Polygon({
              path: borderPath
            }))
          } else {
            overs.push(o)
          }
        })
        this.setFitView(overs)
      }
      map.on('complete', function () {
        th.mapComplete()
      }).on('click', function () {
        this.reFitView()
        th.$emit('click', map, th.data)
      })
      if (this.StyleParam instanceof Object) { // 用于在样式编辑时保存状态
        map.on('zoomend', function () {
          th.data.zoom = map.getZoom()
        }).on('moveend', function () {
          const center = map.getCenter()
          th.data.lng = center.lng
          th.data.lat = center.lat
        })
      }
    },
    mapComplete () {
      this.setControl()
      this.setLayers()
      this.setOptions()
      this.loaded = true
      this.$emit('complete', this.map)
    },
    takePicture (callback) {
      window.pageYoffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const th = this
      html2canvas(th.$refs.mapContainer, {
        backgroundColor: null,
        useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then(canvas => {
        callback(canvas)
      })
    }
  }

}
</script>

<style scoped>

</style>
