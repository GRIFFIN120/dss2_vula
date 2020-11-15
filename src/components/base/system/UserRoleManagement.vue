<template>
  <div>
    <BaseDialog ref="dialog" title="权限设定" width="30%" @confirm="confirm">
      <template >
        <BaseTree ref="tree" entity="menu" type="display" :checked="checked"  :label="menuLabel" :search="treeSearch" @modified="$store.dispatch('menu/getMenu')">
        </BaseTree>
      </template>
    </BaseDialog>
    <BaseTable ref="table" entity="role" type="edit">
      <template #operation="scope">

        <el-tooltip class="item" effect="light" content="权限设定" placement="top">
          <el-button :loading="$store.state.loading"
                     @click="openDialog(scope.row)"
                     size="mini" type="primary"  circle plain><i class="fa fa-sitemap"></i></el-button>
        </el-tooltip>

      </template>
    </BaseTable>

  </div>
</template>

<script>
import BaseDialog from '~dialog'
import BaseTable from '~table'
import BaseTree from '~tree'
export default {
  components: {
    BaseTable, BaseDialog, BaseTree
  },
  data () {
    return {
      checked: [],
      item: {},
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
  mounted () {
  },
  methods: {
    openDialog (row) {
      this.checked = row.menus
      this.item = row
      this.$refs.dialog.open(row)
    },
    confirm (item) {
      const keys = this.$refs.tree.getCheckedKeys()
      item.menus = keys.filter(function (e) {
        return e !== 0
      })
      this.$base.update('role', item)
        .then(res => {
          this.$refs.table.load()
        })
    },
    menuLabel (data) {
      const cls = data.children && data.children.length !== 0 ? 'treeNode' : 'treeLeaf'
      let icon = 'fa fa-minus'
      if (data.icon) {
        icon = data.icon
      }
      return '<i style="color:#c0c6c9" class="' + icon + '">&nbsp;</i> ' + '<span class="' + cls + '">' + data.name + '</span>'
    }
  }
}
</script>
