<template>
  <div>

    <BaseDialog ref="chartDialog"   title="视图可视化" :buttons="false" width="700">
      <template v-slot="{data}">
        <Charts :data="data"></Charts>
      </template>
    </BaseDialog>

    <BaseDialog ref="dialog" @confirm="confirm"  title="对话框" width="400px">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        {{data}}
      </template>
    </BaseDialog>

    <BaseDialog ref="treeRoom" :buttons="false"  title="指标体系决策" width="90%">
      <template v-slot="{data}">
        <TreeRoom :bean="data"></TreeRoom>
      </template>
    </BaseDialog>

    <BaseDialog ref="weightRoom" :buttons="false"  title="指标权重决策" width="90%">
      <template v-slot="{data}">
        <WeightRoom :bean="data"></WeightRoom>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <BaseTable ref="table" :entity="entity" :type="type" url="task/userTasks"  >
      <template #operation="data">
        <el-tooltip v-if="data.row.state=='tree'||data.row.state=='weight'"

                    class="item" effect="light" content="决策室" placement="top">
          <el-button
            @click="$refs[data.row.state+'Room'].open(data.row)"
            size="mini" type="success" circle ><i class="fa fa-university"></i></el-button>
        </el-tooltip>

        <!--  2. 添加按钮  -->
        <el-tooltip class="item" effect="light" content="查看专家" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-users"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="查看任务视图" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-line-chart"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import TreeRoom from './task/TreeRoom'
import Charts from './dialog/Charts'
import WeightRoom from './task/WeightRoom'
export default {
  components: {
    BaseTable, BaseDialog, TreeRoom, Charts, WeightRoom
  },
  data () {
    return {
      entity: 'task',
      type: 'display'
    }
  },
  mounted () {
  },
  methods: {
    confirm () {
      // 4. 表单提交后的操作
      this.$refs.table.load()
    }
  }
}
</script>

<style scoped>

</style>
