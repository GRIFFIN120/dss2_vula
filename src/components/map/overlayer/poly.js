import AMap from 'AMap'
export default {
  props: ['map', 'StyleParam', 'bean', 'showLabel', 'border'],
  data () {
    return {
      style: {},
      object: null,
      entity: null,
      loaded: false
    }
  },
  watch: {
    StyleParam: { // 仅用于样式编辑
      handler: function () {
        if (this.object != null) {
          this.object.setOptions(this.StyleParam)
        }
      },
      deep: true
    }
  },
  beforeMount () {
    if (this.bean && this.bean.path) {
      const path = this.bean.path
      if (path instanceof Array) {
        this.initObject(path)
      } else if (typeof (path) === 'string') {
        this.$base.dfs.get(this.bean, 'path')
          .then(res => {
            const arr = res.data
            if (arr.length > 2) {
              this.initObject(res.data)
            } else {
              this.$message.warning('数据不足，图中显示的是随机区域')
              this.initObject(this.getDefaultPath())
            }
          })
      }
    } else {
      this.initObject(this.getDefaultPath())
    }
  },
  methods: {
    getPath () {
      const path = this.object.getPath()
      const arr = []
      path.filter(function (e) {
        arr.push([e.lng, e.lat])
      })
      return arr
    },
    createObject (path) {
      return null
    },
    initObject (path) {
      const pathCopy = this.$utils.deepClone(path)
      this.object = this.createObject(path)
      this.setLabel(pathCopy)

      this.setOptions()
      this.map.add(this.object)

      const th = this
      this.object.on('click', function () {
        if (this.isBorder) {
          th.map.setFitView(new AMap.Polygon({
            path: path
          }), true)
        } else {
          th.map.setFitView(th.object, true)
        }

        th.$emit('click', th.object, th.bean)
      })
      this.map.reFitView()
      this.loaded = true
    },
    setLabel (path) {
      const th = this
      if (this.bean && this.bean.name && this.showLabel) {
        const center = this.getAreaCenter(path)
        const label = this.bean.name
        const text = new AMap.Text({
          text: label,
          position: center,
          map: this.map,
          style: {
            'border-radius': '.1rem',
            'background-color': 'rgba(0,0,0,0.1)',
            'border-width': 0,
            'font-weight': 500,
            'text-shadow': '1px 1px 3px #000000',
            'text-align': 'center',
            'font-size': '14px',
            color: '#f8e58c'
          }
        })

        text.on('click', function () {
          th.map.setFitView(this, true, null, 10)
          th.$emit('click', th.object, th.bean)
        })
      }
    },

    setOptions () {
      if (this.StyleParam instanceof Object) {
        this.object.setOptions(this.StyleParam)
      } else {
        if (this.StyleParam && typeof (this.StyleParam) === 'number') {
          this.$base.get(this.entity, this.StyleParam)
            .then(res => {
              const options = this.$utils.deepClone(this.$utils.constants[this.entity])
              this.$utils.objectMerge(options, res.data)

              this.object.setOptions(options)
            })
        }
      }
    },
    getDefaultPath () {
      let center = this.map.getCenter()
      if (this.border && this.border.length !== 0) {
        const bd = this.border[0].getPath()
        const areaCenter = this.getAreaCenter(bd)
        center = { lng: areaCenter[0], lat: areaCenter[1] }
      }

      const lng = center.lng
      const lat = center.lat
      const path = [
        [lng + Math.random() * 0.1, lat + Math.random() * 0.1],
        [lng + Math.random() * 0.1, lat - Math.random() * 0.1],
        [lng - Math.random() * 0.1, lat - Math.random() * 0.1],
        [lng - Math.random() * 0.1, lat + Math.random() * 0.1]
      ]
      return path
    },
    getAreaCenter (lnglatarr) {
      const total = lnglatarr.length
      let X = 0; let Y = 0; let Z = 0

      for (const i in lnglatarr) {
        const item = lnglatarr[i]
        let a = 0
        let b = 0
        if (item instanceof Array) {
          a = item[0]
          b = item[1]
        } else if (item instanceof Object) {
          a = item.lng
          b = item.lat
        }
        const lng = a * Math.PI / 180
        const lat = b * Math.PI / 180
        X += Math.cos(lat) * Math.cos(lng)
        Y += Math.cos(lat) * Math.sin(lng)
        Z += Math.sin(lat)
      }

      X = X / total
      Y = Y / total
      Z = Z / total

      const Lng = Math.atan2(Y, X)
      const Hyp = Math.sqrt(X * X + Y * Y)
      const Lat = Math.atan2(Z, Hyp)
      return [Lng * 180 / Math.PI, Lat * 180 / Math.PI]
    }
  }
}
