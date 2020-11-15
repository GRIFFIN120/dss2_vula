<template>
  <div class="block"  style="margin-top: 15px">
    <el-pagination v-if="results.pagingTotal>1" background
                   @current-change="handleCurrentChange"
                   :current-page="search.page"
                   :page-size="search.size"
                   layout="total, prev, pager, next, jumper"
                   :total="results.resultsTotal">
    </el-pagination>
    <span v-else style="font-size: 13px">
        共 {{results.resultsTotal}} 条数据
    </span>
  </div>
</template>

<script>
export default {
  name: 'Paging',
  props: ['results', 'search'],
  methods: {
    handleCurrentChange (val) {
      this.search.page = val
    }
  }
}
</script>

<style scoped>

</style>
