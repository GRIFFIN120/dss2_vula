import AMap from 'AMap'
export default {

  data () {
    return {
      features: ['bg', 'road', 'building', 'point'],
      controls: {
        scale: new AMap.Scale({
          position: 'LB',
          offset: new AMap.Pixel(80, 35)
        }),
        toolBar: new AMap.ToolBar({
          liteStyle: true,
          position: 'LB'
        }),
        controlBar: new AMap.ControlBar({
          showZoomBar: false
        })
      },
      layers: {
        // 高德卫星
        satellite: new AMap.TileLayer.Satellite({
          zIndex: 1,
          opacity: 1,
          rejectMapMask: true
        }),
        // 谷歌卫星
        google: new AMap.TileLayer({
          zIndex: 1,
          opacity: 1,
          getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
        }),
        // 天地图卫星
        image: new AMap.TileLayer({
          zIndex: 1,
          opacity: 1,
          rejectMapMask: true,
          getTileUrl: 'https://t{1,2,3,4}.tianditu.gov.cn/DataServer?T=img_w&x=[x]&y=[y]&l=[z]&tk=11733b337a241aa7746ffc168fbde921'
        }),
        // 天地图地形
        ter: new AMap.TileLayer({
          zIndex: 1,
          opacity: 1,
          rejectMapMask: true,
          getTileUrl: 'https://t{1,2,3,4}.tianditu.gov.cn/DataServer?T=ter_w&x=[x]&y=[y]&l=[z]&tk=11733b337a241aa7746ffc168fbde921'
        }),
        cycle: new AMap.TileLayer({
          zIndex: 1,
          opacity: 1,
          rejectMapMask: true,
          getTileUrl: 'https://{a,b,c}.tile.thunderforest.com/outdoors/[z]/[x]/[y].png?apikey=3822575863a5479f800127eb7be14306'
          // getTileUrl: 'https://t{1,2,3,4}.tianditu.gov.cn/DataServer?T=ter_w&x=[x]&y=[y]&l=[z]&tk=11733b337a241aa7746ffc168fbde921'
        }),
        // 可选图层
        roadNet: new AMap.TileLayer.RoadNet(),
        traffic: new AMap.TileLayer.Traffic()
      }
    }
  },
  methods: {
    getMap () {
      return this.map
    },
    setLayers () {
      for (const key in this.layers) {
        const layer = this.layers[key]
        this.map.remove(layer)
      }
      if (this.style.layer && this.style.layer !== '' && this.style.layer !== 'normal') {
        this.map.add(this.layers[this.style.layer])
      }
      if (this.style.roadNet) {
        this.map.add(this.layers.roadNet)
      }
      if (this.style.traffic) {
        this.map.add(this.layers.traffic)
      }
    },
    setControl () {
      for (const key in this.controls) {
        const ctrl = this.controls[key]
        try {
          this.map.removeControl(ctrl)
        } catch (e) {}
      }
      if (this.style.scale) {
        this.map.addControl(this.controls.scale)
      }
      if (this.style.toolBar) {
        this.map.addControl(this.controls.toolBar)
      }
      if (this.style.controlBar && this.style.viewMode === '3D') {
        this.map.addControl(this.controls.controlBar)
      }
    },
    getFeatures () {
      const th = this
      const features = this.features.filter(function (item) {
        return th.style[item]
      })
      return features
    },
    setOptions () {
      // 基础
      this.map.setMapStyle('amap://styles/' + this.style.mapStyle)
      this.map.setLang(this.style.lang)
      // 3d参数
      this.map.setPitch(this.style.pitch)
      this.map.setRotation(this.style.rotation)
      // 特点 setFeatures(this.getFeatures())
      this.map.setFeatures(this.getFeatures())

      // 缩放(仅编辑状态下有效)
      if (this.editor) {
        if (this.data.zoom) {
          this.map.setZoom(this.data.zoom)
        } else {
          this.map.setZoom(this.style.zoom)
        }
        if (this.data.lng && this.data.lat) {
          this.map.setCenter([this.data.lng, this.data.lat])
        }
      }
    }
  }
}
