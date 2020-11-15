<template>
    <div v-if="loaded">
      <BaseTable entity="data-item" :type="type" :search="search" ></BaseTable>
    </div>
</template>

<script>
import BaseTable from '~table'
export default {
  props: ['dataId', 'local'],
  components: {
    BaseTable
  },
  data () {
    return {
      type: 'display',
      search: {
        page: 1,
        size: 10,
        exact: {},
        fuzzy: {}
      },
      loaded: false
    }
  },
  mounted () {
    this.search.exact.dataId = this.dataId
    this.loaded = true
    this.type = this.local ? 'edit' : 'display'
  }

}
</script>

<style scoped>

</style>
