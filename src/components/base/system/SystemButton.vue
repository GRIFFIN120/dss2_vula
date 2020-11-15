<template>
  <div>

    <BaseDialog ref="entityMeta" title="元数据操作规范" width="100%" :buttons="false">
      <template >
        <EntityMeta></EntityMeta>
      </template>
    </BaseDialog>
    <BaseDialog ref="metaTypes"  title="系统参数" width="700px" :buttons="false">
      <template >
        <SysTypes></SysTypes>
      </template>
    </BaseDialog>
    <BaseDialog ref="globalMeta"  title="全局操作规范" width="100%" :buttons="false" >
      <template >
        <UniMeta></UniMeta>
      </template>
    </BaseDialog>

    <el-dropdown v-if="true" @command="handleChange" style="position: absolute; right: 5px; top:0px; z-index: 10000" placement="top-start">
      <el-button type="text">
        <el-avatar icon="fa fa-cog" shape="square"></el-avatar>
      </el-button>
      <el-dropdown-menu slot="dropdown">

        <el-dropdown-item command="entityMeta">操作规范</el-dropdown-item>
        <el-dropdown-item command="metaTypes" >系统参数</el-dropdown-item>
        <el-dropdown-item command="globalMeta" divided>全局操作规范</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>

</template>

<script>
import UniMeta from './major/UniMeta'
import SysTypes from './major/SysTypes'
import EntityMeta from './major/EntityMeta'
import BaseDialog from '../BaseDialog'

export default {
  components: {
    UniMeta,
    SysTypes,
    EntityMeta,
    BaseDialog
  },
  methods: {
    handleChange (command) {
      this.$refs[command].open()
    }
  }
}
</script>

<style scoped>

</style>
