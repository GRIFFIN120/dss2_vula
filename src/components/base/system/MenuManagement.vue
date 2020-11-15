<template>
  <div>
    <BaseTree ref="tree" entity="menu" type="edit" :search="treeSearch" :defaultExpandAll="true" :label="menuLabel" @modified="$store.dispatch('menu/getMenu')" >
      <template #operation="{item}">
        <el-button :item="item" circle size="small" type="success" @click="hide" icon="fa fa-eye-slash"></el-button>
      </template>
    </BaseTree>
  </div>
</template>

<script>
import BaseTree from '../tree/index'
export default {
  components: {
    BaseTree
  },
  data () {
    return {
      treeSearch: {
        page: 1,
        size: 0,
        exact: {
          domain: 'dss2'
        },
        fuzzy: {}
      }
    }
  },
  methods: {
    hide () {
      const keys = this.$refs.tree.getCheckedKeys()
      const arr = []
      keys.filter(function (e) {
        arr.push({ id: e, domain: 'npims' })
      })

      this.$base.http.post('menu/update/all', arr)
        .then()
    },
    menuLabel (data) {
      const cls = data.children && data.children.length !== 0 ? 'treeNode' : 'treeLeaf'
      let icon = 'fa fa-minus'
      if (data.icon) {
        icon = data.icon
      }
      let str = '<i style="color:#c0c6c9" class="' + icon + '">&nbsp;</i> ' + '<span class="' + cls + '">' + data.name + '</span>'
      if (data.path) {
        str += '<span style="font-weight: lighter">&nbsp;&nbsp;' + data.path + '</span>'
      }

      return str
    }
  }
}
</script>

<style lang="less" scoped>
</style>
