<template>
  <div>
    <PolylineStyleDialog ref="styleDialog"  @reload="$refs.table.load()"></PolylineStyleDialog>

    <BaseTable ref="table" entity="polyline" type="edit" :search="search">
      <template #operation="data">
        <el-button
          @click="$refs.styleDialog.open(data.row)"
          size="mini" type="primary"  circle plain><i class="fa fa-map"></i></el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import PolylineStyleDialog from './PolylineStyleDialog'
export default {
  components: {
    BaseTable, PolylineStyleDialog
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
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>
