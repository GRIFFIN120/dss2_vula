<template>
  <div>

    <BaseTree style="width: 100%" v-if="task.state=='tree'" ref="tree" entity="task-tree" type="display" :search="search"  :label="treeLabel" :checkable="false"
              :rootLabel="task.name" :defaultExpandAll="true"
    ></BaseTree>

    <BaseTree style="width: 100%"  v-else ref="tree" entity="task-tree" type="display" :search="search"  :label="weightLabel" :checkable="false"
              :rootLabel="task.name" :defaultExpandAll="true"
    ></BaseTree>

  </div>
</template>

<script>
import BaseTree from '~tree'
export default {
  components: {
    BaseTree
  },
  props: ['task', 'user', 'state'],
  data () {
    return {
      search: {
        page: 1,
        size: 0,
        exact: {
        },
        fuzzy: {}
      }

    }
  },
  beforeMount () {
    if (this.user) {
      this.search.exact.userId = this.user.id
    } else {
      this.search.exact.userId = this.task.user.id
    }
    this.search.exact.taskId = this.task.id
    if (this.state) {
      this.search.exact.domain = this.state
    } else {
      this.search.exact.domain = this.task.state
    }
    console.log(this.search)
  },
  methods: {
    treeLabel (data) {
      let icon = 'fa fa-tasks'
      let color = '#aaaaaa'
      if (data.id !== 0) {
        icon = data.dataId ? 'fa fa-dot-circle-o' : 'fa fa-folder-o'
        color = data.dataId ? '#409EFF' : '#666666'
      }
      const str = '<i style="color:' + color + '" class="' + icon + '">&nbsp;</i> ' + '<span style="color:' + color + ';font-weight: bolder" >' + data.name + '</span>'
      return str
    },
    weightLabel (data) {
      let icon = 'fa fa-tasks'
      let color = '#aaaaaa'
      let weight = ''
      if (data.id !== 0) {
        icon = data.dataId ? 'fa fa-dot-circle-o' : 'fa fa-folder-o'
        color = data.dataId ? '#409EFF' : '#666666'
        weight = data.weight !== undefined ? data.weight + '%' : '-'
        const weightColor = data.weight !== undefined ? '#67C23A' : '#cccccc'
        weight = '<div style="color: ' + weightColor + ';font-size: 12px; font-weight: bold;width: 30px;display: inline-block; padding-right:3px; text-align: center">' + weight + '</div>'
      }

      let str = weight + '<i style="color:' + color + '" class="' + icon + '">&nbsp;</i> ' + '<span style="color:' + color + ';font-weight: bolder" >' + data.name + '</span>'
      if (data.description) {
        str += '<span style="color: #999999;font-size: 12px"> (' + data.description + ')</span>'
      }

      return str
    }
  }

}
</script>

<style scoped>

</style>
