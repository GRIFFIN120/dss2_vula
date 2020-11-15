<template>
  <div v-if="data">
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

    <div  style="margin-top: 15px;width: 100%;height: 500px;" ref="chartdiv" v-html="message" ></div>
  </div>

</template>

<script>
import chart from './chartmix'
import BaseSelect from '../../../components/base/BaseSelect'
export default {
  components: {
    BaseSelect
  },
  data () {
    return {
      scales: []
    }
  },
  mixins: [chart],
  mounted () {
    this.$base.http.post('data-scale/simple')
      .then(res => {
        this.scales = res.data
      })

    const search = { exact: { dataId: this.data.id } }
    this.$base.search('data-item', search)
      .then(res => {
        this.titles = [this.data.name]
        this.list = res.data.list
        if (this.list.length === 0) {
          this.message = '数据为空'
          this.$message.warning('没有数据，无法绘制图表')
        } else {
          console.log(this.list)
          this.makeChart(this.$refs.chartdiv)
        }
      })
  },
  methods: {
    getData () {
      const data = []
      return data
    }
  }
}
</script>

<style scoped>
  .hello {
    margin-top: 15px;
    width: 100%;
    height: 500px;
  }
</style>
