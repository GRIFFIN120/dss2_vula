<template>
  <div>
    <el-form :model="bean" label-width="100px">
      <el-form-item label="指标名称" >
        <el-input v-model="bean.name"></el-input>
      </el-form-item>
      <BaseSelect title="结构类型" url="types/domain/scaleType" value-key="code" @select="changeDomain"></BaseSelect>
      <BaseSelect title="数据尺度" ref="scale" :data="scales" value-key="id" @select="changeScale"></BaseSelect>
      <BaseSelect title="单位" url="data-scale/simple" :param="{domain:'number'}" value-key="id" @select="changeUnit"></BaseSelect>
      <el-form-item label="指标简介" >
        <el-input v-model="bean.description" type="textarea"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import BaseSelect from '../../../components/base/BaseSelect'
export default {
  props: ['bean'],
  components: { BaseSelect },
  data () {
    return {
      scales: [],
      units: []
    }
  },
  mounted () {

  },
  methods: {
    changeDomain (val) {
      this.bean.domain = val
      this.$refs.scale.setValue(null)
      this.$base.http.post('data-scale/simple', { domain: val })
        .then(res => {
          console.log(res)
          this.scales = res.data
        })
    },
    changeScale (val) {
      this.bean.scaleId = val
    },
    changeUnit (val) {
      this.bean.unitId = val
    },
    getBean () {
      return this.bean
    }
  }
}
</script>

<style scoped>

</style>
