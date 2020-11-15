<template>
  <div>
    <el-submenu v-if="menu.children" :index="menu.id+''">
       <template slot="title">
         <i :class="menu.icon || 'fa fa-navicon'" v-if="menu.children" ></i>
         <span slot="title" class="treeNode">{{ menu.name }} </span>
       </template>
      <el-menu-item-group>
        <MenuTree v-for="item in menu.children" :key="item.id" :menu="item" :level="level+1" />
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item v-else :index="menu.path">
      <i :class="menu.icon || 'fa fa-minus'" v-if="level==1"></i>
      <i v-else :class="menu.icon || 'fa fa-minus'"></i>
      <span slot="title" class="treeLeaf">{{ menu.name }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  props: ['menu', 'level'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .fa {
    padding: 0px 8px 0px 3px;
    font-size: 18px;
  }
</style>
