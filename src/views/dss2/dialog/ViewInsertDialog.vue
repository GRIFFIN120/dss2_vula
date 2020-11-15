<template>
  <div>
    <el-form :model="bean" label-width="100px">
      <el-form-item label="视图名称"  >
        <el-input v-model="bean.name"></el-input>
      </el-form-item>
      <BaseSelect title="结构类型" url="types/domain/scaleType" value-key="code" @select="changeDomain"></BaseSelect>
      <BaseSelect title="数据尺度" :data="scales" value-key="id" @select="changeScale"></BaseSelect>
      <el-form-item label="简介" >
        <el-input v-model="bean.description" type="textarea"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import BaseSelect from '../../../components/base/BaseSelect'
export default {
  props: [],
  components: { BaseSelect },
  data () {
    return {
      bean: {
        domain: null,
        unitId: null,
        name: null,
        description: null
      },
      scales: []
    }
  },
  mounted () {

  },
  methods: {
    changeDomain (val) {
      this.bean.domain = val
      this.$base.http.post('data-scale/simple', { domain: val })
        .then(res => {
          this.scales = res.data
        })
    },
    changeScale (val) {
      this.bean.scaleId = val
    },
    getBean () {
      return this.bean
    }
  }
}
</script>

<style scoped>

</style>
