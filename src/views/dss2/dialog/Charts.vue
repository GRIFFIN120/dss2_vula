<template>
    <div style="height: auto">
      <el-card>
        <el-row  v-if="data" align="middle" style="margin-bottom: 15px">
          <el-col :span="16" justify="space-between" align="" >
            <BaseSelect title="名称" :data="[]" :default-value="data?data.name:'无标题'"  disabled></BaseSelect>
          </el-col>
          <el-col :span="8" justify="space-between" >
            <BaseSelect title="创建人" :data="[]" :default-value="data.user.name"  disabled></BaseSelect>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" justify="space-between" align="">
            <BaseSelect title="指标结构" url="types/domain/scaleType" :default-value="data.domain" value-key="code" disabled></BaseSelect>
          </el-col>
          <el-col :span="8" justify="space-between" align="">
            <BaseSelect title="指标结构" :data="scales" :default-value="data.scaleId" value-key="id"  disabled></BaseSelect>
          </el-col>
          <el-col :span="8" justify="space-between" align="">
            <BaseSelect title="指标单位" :data="scales" :default-value="data.unitId" value-key="id"  disabled></BaseSelect>
          </el-col>
        </el-row>
      </el-card>
      <div  class="hello" ref="chartdiv" v-html="message" ></div>
      <div ref="draw" style="height: 120px;border: 1px solid #ccc;background-color: #eee"></div>
    </div>
</template>

<script>
import chart from './chartmix'
import BaseSelect from '../../../components/base/BaseSelect'

export default {
  mixins: [chart],
  components: { BaseSelect },
  mounted () {
    const ids = this.data.data
    if (ids instanceof Array && ids.length !== 0) {
      this.$base.http.post('data-scale/simple')
        .then(res => {
          this.scales = res.data
        })

      this.$base.http.get('data-item/combine/' + this.data.id + '/' + ids)
        .then(res => {
          this.list = []
          this.titles = res.data.titles
          const map = res.data.data
          for (const key in map) {
            const arr = map[key]
            this.count = arr.length > this.count ? arr.length : this.count
            const obj = { category: key }
            for (const i in arr) {
              const val = arr[i]
              obj['value' + i] = val
            }
            this.list.push(obj)
          }
          this.makeChart(this.$refs.chartdiv)
        })
    } else {
      this.$message.warning('视图数据为空')
    }
  },
  data () {
    return {
      scales: [],
      drawer: false
    }
  },
  methods: {}
}
</script>

<style scoped>
  .hello {
    border: 1px solid #ccc;
    margin-top: 15px;
    width: 100%;
    min-height: 500px;
  }
</style>
