<template>
  <div>

    <BaseTable ref="table" entity="types" type="edit" :search="search"></BaseTable>

  </div>
</template>

<script>

import BaseTable from '~table'

export default {
  name: 'TypesManage',
  components: {
    BaseTable
  },
  data () {
    return {
      search: {
        page: 1,
        size: 10,
        exact: {},
        fuzzy: {}
      }
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
