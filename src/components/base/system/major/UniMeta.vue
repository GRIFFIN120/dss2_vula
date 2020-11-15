<template>
  <div>
    <BaseTable ref="table" entity="meta" type="edit" :search="search"></BaseTable>
  </div>
</template>
<script>
import BaseTable from '~table'
export default {
  components: {
    BaseTable
  },
  data () {
    return {
      search: {
        page: 1,
        size: 10,
        exact: {
          entity: 'meta',
          type: 'edit'
        },
        fuzzy: {}
      }
    }
  }
}
</script>

<style scoped>
</style>
