<template>
  <el-breadcrumb separator="/" class="my-breadcrumb" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in selectedPath" :key="item.index">
      <span>{{item.name}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MenuBreadcrumb',
  props: ['selectedPath']
}
</script>

<style scoped>
  .my-breadcrumb span{
    font-size: 15px;
  }
</style>
