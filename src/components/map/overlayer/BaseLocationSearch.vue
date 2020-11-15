<template>
  <div style=" position: absolute; bottom: 135px ; right: 55px">
    <el-select
      v-model="value"
      style="box-shadow: 3px 3px 3px #1f2d3d; border: 1px solid #1f2d3d"
      size="small"
      filterable
      remote
      clearable
      allow-create
      reserve-keyword
      placeholder="请输入地址搜索关键词"
      @change="setLocation"
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
</template>

<script>
// @change="setLocation"
import AMap from 'AMap'
export default {
  props: ['map'],
  data () {
    return {
      autoComplete: null,
      loading: false,
      value: '',
      options: [],
      address: null,
      position: []
    }
  },
  mounted () {
    this.autoComplete = new AMap.Autocomplete({ city: '全国' })
  },
  methods: {
    setLocation (evt) {
      if (!evt || evt === '') return
      const arr = this.options.filter(function (e) {
        return e.id === evt
      })
      if (arr.length !== 0 && arr[0].location !== '') {
        const item = arr[0]
        const location = item.location
        const position = [location.lng, location.lat]// [116.415182, 39.981661]
        const fullAddress = '「 ' + item.name + ' —— ' + item.address + ' ' + item.district + ' 」'
        this.$emit('search', this.map, position, fullAddress)
      } else {
        this.$message.warning('无搜索结果')
      }
    },
    remoteMethod (val) {
      const th = this
      this.autoComplete.search(val, function (status, result) {
        th.options = result.tips
      })
    }
  }
}
</script>

<style scoped>
.amap-scalecontrol{
  display: none !important;
}
</style>
