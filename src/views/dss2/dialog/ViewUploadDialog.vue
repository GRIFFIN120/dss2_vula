<template>
    <div>
      <el-row >
        <el-col :span="24" style="margin-bottom: 10px" align="center">
          <BaseSelect url="types/domain/scaleType" title="视图结构" valueKey="code" @select="changeDomain"></BaseSelect>
        </el-col>
        <el-col :span="24" style="margin-bottom: 10px" align="center">
          <BaseSelect ref="scale" :data="scales" title="数据尺度" valueKey="id" @select="changeScale" ></BaseSelect>
        </el-col>
      </el-row>
      <CommonUpload v-if="fully" :action="realAction" :data="param" accept=".xls,.xlsx" @success="success"></CommonUpload>
    </div>
</template>

<script>
import CommonUpload from '../../../components/common/CommonUpload'
import BaseSelect from '../../../components/base/BaseSelect'
export default {
  props: ['action', 'create'],
  components: {
    CommonUpload,
    BaseSelect
  },
  data () {
    return {
      scales: [],
      param: {
        scaleId: null,
        domain: null,
        unitId: null
      }
    }
  },
  computed: {
    realAction () {
      return this.action + '/' + this.param.domain + '/' + this.param.scaleId + '/' + this.create
    },
    fully () {
      return this.param.domain !== null && this.param.scaleId !== null
    }
  },
  mounted () {

  },
  methods: {
    success () {
      this.$emit('success', this.param)
    },
    changeDomain (val) {
      this.$refs.scale.setValue(null)
      if (val) {
        this.$base.search('data-scale', {
          exact: { domain: val }
        }).then(res => {
          this.scales = res.data.list
        })
        this.param.domain = val
      } else {
        this.scales = []
        delete this.param.domain
      }
    },
    changeScale (val) {
      this.param.scaleId = val
    }
  }
}
</script>

<style scoped>

</style>
