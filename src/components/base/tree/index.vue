<template>
  <div style="">
    <Dialog ref="dialog" :entity="entity" :meta="meta" @confirm="confirm"   :search="search" :param="param"></Dialog>
    <el-row style="margin-bottom: 10px">
      <el-col :span="12">
        <el-input
          clearable
          size="small"
          placeholder="输入关键字进行节点过滤"
          v-model="filterText">
          <template slot="append"><i class="fa fa-filter"></i>&nbsp;过滤</template>
        </el-input>
      </el-col>
      <el-col :span="12" align="right">
        <slot name="operation" :item="item"></slot>
        <div v-if="operation.enable" style="display: inline; margin-left: 10px">
          <el-button v-if="operation.enable&&operation.view" circle size="small" type="primary" @click="$refs.dialog.open(item,false)" icon="fa fa-eye"></el-button>
          <el-button v-if="operation.enable&&operation.insertion" circle size="small" type="success" @click="openInsert(item)" icon="fa fa-plus"></el-button>
          <el-button v-if="operation.enable&&operation.edit" circle size="small" type="warning" @click="openEdit(item)" icon="fa fa-edit"></el-button>
          <el-button v-if="operation.enable&&operation.remove" circle size="small" type="danger" @click="confirmingDelete" icon="fa fa-remove"></el-button>
<!--          <el-button v-if="operation.enable&&operation.remove" circle size="small" type="info" @click="resetChecked" icon="fa fa-undo"></el-button>-->
        </div>
      </el-col>
    </el-row>
    <el-row class="tree-scroll">
        <el-tree
          ref="elTree"
          class="tree-class"
          :data="tree"

          node-key="id"
          :props="{children: 'children',label: 'name'}"

          :default-expanded-keys="defaultExpandedKeys"
          :check-on-click-node = "false"
          :expand-on-click-node = "false"
          :default-expand-all = 'defaultExpandAll'
          :show-checkbox="checkable"
          :draggable="operation.enable && operation.pop"

          :filter-node-method="filterNode"

          @node-collapse="highlight"
          @node-expand="highlight"
          @node-click="highlight"

          @check = "handleCheck"

          @node-drop="handleDrop"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"

        >
          <span  slot-scope="{ node, data }">
              <span class="iconLabel" v-html="label(data)"></span>
          </span>
        </el-tree>
    </el-row>

<!--    -->
  </div>
</template>

<script>
import treeMix from './treemix'
import Dialog from '../dialog/Dialog'
export default {
  components: { Dialog },
  mixins: [treeMix],
  props: {
    entity: {
      type: String,
      default: 'menu'
    },
    type: {
      type: String,
      default: 'display'

    },
    checkable: {
      type: Boolean,
      default: true
    },
    search: {
      type: Object,
      default: () => (
        {
          page: 1,
          size: 0,
          exact: {},
          fuzzy: {}
        }
      )
    },
    checked: {
      type: Array,
      default: function () {
        return []
      }
    },
    label: {
      type: Function,
      default: (data) => { return data.name }
    }
  },
  data () {
    return {
      tree: [],
      filterText: '',
      item: {},
      checkedKeys: [],
      defaultExpandedKeys: [0]

    }
  },
  watch: {
    filterText (val) {
      this.$refs.elTree.filter(val)
    },
    checked () {
      this.$refs.elTree.setCheckedKeys(this.checked)
    },
    search: {
      handler: function () {
        // （清理掉搜索中的空字符）
        console.log('search changed', this.search)
        for (const key in this.search.exact) {
          if (this.search.exact[key] === '') {
            delete this.search.exact[key]
          }
        }
        for (const key in this.search.fuzzy) {
          if (this.search.fuzzy[key] === '') {
            delete this.search.fuzzy[key]
          }
        }
        this.load()
      },
      deep: true
    }
  },
  mounted () {
    this.checkedKeys = this.checked
    this.load(this.loadMeta)
  },
  methods: {
    getRoot () {
      return this.$refs.elTree.getNode(0).data
    },
    getSelectedItem () {
      return this.item
    },
    getCheckedKeys () {
      return this.$refs.elTree.getCheckedKeys()
    },
    openInsert (item) {
      if (this.beforeInsert && !this.beforeInsert(item)) return
      const pid = item.id || 0
      this.$refs.dialog.open({ pid }, true)
    },
    openEdit (item) {
      if (this.beforeEdit && !this.beforeEdit(item)) return

      if (item.id) {
        this.$refs.dialog.open(item, true)
      } else {
        this.$message.warning('请选择要编辑的节点')
      }
    },
    reload (data) {
      this.defaultExpandedKeys = [data.pid]
      this.item = data
      const th = this
      this.load(function () {
        setTimeout(function () {
          th.$refs.elTree.setCurrentKey(data.id)
        }, 100)
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    highlight (item, node, component) { /// select
      this.item = item
      this.$refs.elTree.setCurrentKey(item.id)
    },
    handleCheck (node, data) {
      this.checkedKeys = data.checkedKeys
    },
    resetChecked () {
      // 清除已选
      this.deleteKeys = []
      this.$refs.elTree.setCheckedKeys(this.deleteKeys)
      // 选中根结点
      this.item = this.$refs.elTree.getNode(0)
      this.$refs.elTree.setCurrentKey(this.item)
    },
    allowDrop (draggingNode, dropNode, type) {
      const flag = !(dropNode.data.id === 0 && type !== 'inner')
      if (this.checkDrop) {
        const check = this.checkDrop(draggingNode, dropNode, type)
        return check && flag
      } else {
        return flag
      }

      // 不能移动到根结点外，别的随意
    },
    allowDrag (draggingNode) {
      // 不能拖动根结点，别的随意
      const flag = draggingNode.data.id !== 0
      return flag
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      if (dropType === 'inner') {
        const bean = {
          id: draggingNode.data.id,
          pid: dropNode.data.id
        }
        this.$base.update(this.entity, bean)
          .then((res) => {
            this.reload(res.data)
            this.$emit('modified')
          })
      } else {
        const dgid = draggingNode.data.id
        const dpid = dropNode.data.id
        const dir = dropType
        this.$base.place(this.entity, dgid, dpid, dir)
          .then((res) => {
            draggingNode.data.pid = dropNode.data.pid
            this.reload(draggingNode.data)
            this.$emit('modified')
          })
      }
    },

    confirmingDelete () {
      if (this.checkedKeys.length !== 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSelected()
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      } else {
        this.$message.warning('请勾选要删除的节点')
      }
    },
    confirm (data) {
      this.reload(data)
      this.$emit('modified')
    },
    deleteSelected () {
      // 搜索已经展开的节点
      const dek = []
      const th = this
      this.checkedKeys.filter(function (e) {
        const node = th.$refs.elTree.getNode(e)
        if (node && node.data) {
          const check = dek.filter(function (ee) {
            if (ee === node.data.pid) return true
          })
          if (check.length === 0) {
            dek.push(node.data.pid)
          }
        }
      })
      // 删除 重制
      this.defaultExpandedKeys = dek
      if (this.checkedKeys.length !== 0) {
        this.$base.removeAll(this.entity, this.checkedKeys)
          .then(() => {
            this.deleteKeys = []
            this.$refs.elTree.setCurrentKey(0)
            this.load()
            this.$emit('modified')
          })
      } else {
        this.$message.warning('请勾选要删除的节点')
      }
    }

  }
}
</script>

<style lang="less" scoped>

  .el-tree {
    min-width: 800px;
    min-height: 500px;
  }

  .el-tree>.el-tree-node {
    display: inline-block;
  }
  .tree-scroll{
    background-color: #f3f3f3;
    width: 100%;
    overflow-x: scroll;
    border: 1px solid #eeeeee;
  }
  .tree-class{
    max-height: 600px;
    background-color: #f3f3f3;
  }
  .iconLabel{
    padding-left: 10px;
    color: #7b7c7d;
  }
</style>
