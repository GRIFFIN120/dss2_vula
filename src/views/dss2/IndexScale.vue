<template>
  <div>
    <BaseTable ref="table" entity="data-scale" type="edit" ></BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
export default {
  components: {
    BaseTable
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    confirm () {
      // 4. 表单提交后的操作
      this.$refs.table.load()
    }
  }
}
</script>

<style scoped>

</style>
