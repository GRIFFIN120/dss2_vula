<template>
    <el-menu
      background-color="#fbfaf5"
      text-color="#203744"
      active-text-color="#cd5e3c"
      :unique-opened="true"
      :collapse="$store.state.menu.collapse"
      :collapse-transition="false"
      @select="handleSelect"
      :default-active="active"
      router
    >
      <el-menu-item  index="/home">
        <i class="fa fa-home" ></i>
        <span class="treeNode" slot="title">首页</span>
      </el-menu-item>
      <MenuTree :menu="item" :level="1" v-for="item in tree" :key="item.id" />
    </el-menu>
</template>

<script>
import MenuTree from './MenuTree'
export default {
  props: ['active', 'tree'],
  components: {
    MenuTree
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$store.commit('menu/SELECTED_MENU', { key, keyPath })
    }
  }
}
</script>

<style scoped lang="less">
  .el-menu{
    border-right: 0px;
  }
  .fa {
    padding: 0px 8px 0px 3px;
    font-size: 18px;
  }

</style>
