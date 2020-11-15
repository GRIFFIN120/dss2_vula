<template>
  <el-drawer
    custom-class="drawer"
    title="数据检索"
    :visible.sync="drawer"
    direction="rtl"
    size="20%"
    append-to-body>
    <SearchForm ref="searchForm" :search="search" :meta="meta" :param="param" ></SearchForm>
  </el-drawer>
</template>

<script>
import SearchForm from './SearchForm'
export default {
  name: 'Search',
  props: ['search', 'meta', 'param'],
  components: { SearchForm },
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    open () {
      this.drawer = true
    }
  }
}
</script>

<style scoped>
.demo-drawer__footer{
  display: flex;
}

</style>
