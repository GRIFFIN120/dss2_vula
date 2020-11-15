<template>
  <div>
    <div style=" position: absolute; left: 55px ; top: 120px">
      <el-select
        style="box-shadow: 3px 3px 3px #1f2d3d; border: 1px solid #1f2d3d"
        v-model="value"
        filterable
        remote
        clearable
        allow-create
        @change="setLocation"
        reserve-keyword
        placeholder="请输入地址关键词"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="(item,key) in options"
          :key="key"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <br>
    <span style="font-weight: bolder">标记地址：</span><span>{{address}}</span>
    <span style="font-weight: bolder">&nbsp;-&nbsp;坐标：</span><span>{{position}}</span>
  </div>

</template>

<script>
import AMapUI from 'AMapUI'
import AMap from 'AMap'
export default {
  props: ['data', 'map'], // 传入BaseEntity对象和map对象，拖动地图，对data的lng,lat属性进行修改。
  data () {
    return {
      positionPicker: null,
      address: null,
      position: [],
      value: '',
      loading: false,
      options: []
    }
  },
  mounted () {
    let center = this.map.getCenter()
    if (this.data.lng && this.data.lat) {
      center = [this.data.lng, this.data.lat]
    }

    const th = this
    AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
      th.positionPicker = new PositionPicker({
        mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
        map: th.map// 依赖地图对象
      })

      th.positionPicker.on('success', function (positionResult) {
        th.address = positionResult.address
        const pos = positionResult.position
        th.position = [pos.lng, pos.lat]
        th.data.lng = pos.lng
        th.data.lat = pos.lat
      })
      th.positionPicker.start(center)
    })

    th.autoComplete = new AMap.Autocomplete({ city: '全国' })
  },
  methods: {
    setLocation (evt) {
      if (!evt || evt === '') return
      const arr = this.options.filter(function (e) {
        return e.id === evt
      })
      if (arr.length !== 0 && arr[0].location !== '') {
        const location = arr[0].location
        const position = [location.lng, location.lat]// [116.415182, 39.981661]
        this.positionPicker.start(position)
      } else {
        this.$message.warning('无搜索结果')
      }
    },
    remoteMethod (val) {
      const th = this
      this.autoComplete.search(val, function (status, result) {
        // 搜索成功时，result即是对应的匹配数据
        th.options = result.tips
      })
    }
  }

}
</script>

<style scoped>

</style>
