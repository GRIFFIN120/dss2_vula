<template>
    <div>
      <el-table
      :data="data"
      ></el-table>

    </div>
</template>

<script>
export default {
  props: ['data', 'column']
}
</script>

<style scoped>

</style>
