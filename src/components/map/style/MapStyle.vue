<template>
  <div>
    <MapStyleDialog ref="styleDialog"  @reload="$refs.table.load()"></MapStyleDialog>

    <BaseTable ref="table" entity="map" type="edit" :search="search">
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
import MapStyleDialog from './MapStyleDialog'
export default {
  components: {
    BaseTable, MapStyleDialog
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
