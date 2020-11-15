<template>
  <div>
    <BaseDialog ref="dialog" @confirm="confirm"  title="对话框" width="1200px" :buttons="false">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <TaskView :task="data"></TaskView>
      </template>
    </BaseDialog>
    <!--  1. 修改 entity 和 type  -->

    <el-switch
      v-model="swit"
      @change="switchChange"
      active-text="等待审批"
      inactive-text="已审批">
    </el-switch>

    <BaseTable ref="table" :entity="entity" :type="type" :search="search" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <el-tooltip v-show="data.row.state=='pending'" class="item" effect="light" content="发布报告" placement="top">
          <el-button
            @click="approve(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-check"></i></el-button>
        </el-tooltip>

        <el-tooltip v-show="data.row.state=='published'" class="item" effect="light" content="撤回发布" placement="top">
          <el-button
            @click="disapprove(data.row)"
            size="mini" type="warning"  circle plain><i class="fa fa-remove"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="查看" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-eye"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import TaskView from './dialog/TaskView'
export default {
  components: {
    BaseTable, BaseDialog, TaskView
  },
  data () {
    return {
      swit: true,
      entity: 'task',
      type: 'display',
      search: {
        page: 1,
        size: 10,
        exact: {
          state: 'pending'
        },
        fuzzy: {}
      }
    }
  },
  mounted () {
  },
  methods: {

    approve (row) {
      const bean = { id: row.id, state: 'published' }
      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs.table.load()
        })
    },
    disapprove (row) {
      const bean = { id: row.id, state: 'pending' }
      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs.table.load()
        })
    },
    switchChange (val) {
      if (val) {
        this.search.exact.state = 'pending'
      } else {
        this.search.exact.state = 'published'
      }
    },

    confirm () {
      // 4. 表单提交后的操作
      this.$refs.table.load()
    }
  }
}
</script>

<style scoped>

</style>
