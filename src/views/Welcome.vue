<template>
  <div>
    <BaseDialog ref="dialog"  title="对话框" width="1200px" :buttons="false">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <TaskView :task="data"></TaskView>
      </template>
    </BaseDialog>

    <el-row>
      <el-col align="center" style="margin-bottom: 20px"> <h2>页岩气开发群决策案例</h2></el-col>
      <hr>
      <template v-for="task in tasks">
        <el-col :key="task.id" :span="8">
          <el-card >
            <ResultChart :userId="task.user.id" :nodeId="0" :data="task"></ResultChart>
            <div style="text-align: right">
               创建人：{{task.user.name}}
            </div>
            <div style="text-align: right;margin-top: 5px">
              {{task.date}}
            </div>
            <div style="float:right">
              <el-button type="text" @click="$refs.dialog.open(task)">查看决策报告</el-button>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>

  </div>
</template>

<script>
import ResultChart from './dss2/task/ResultChart'
import TaskView from './dss2/dialog/TaskView'
import BaseDialog from '../components/base/BaseDialog'
export default {
  components: {
    ResultChart, TaskView, BaseDialog
  },
  data () {
    return {
      tasks: []
    }
  },
  mounted () {
    this.loadPublishedTask()
  },
  methods: {
    loadPublishedTask () {
      const search = {
        page: 1,
        size: 10,
        exact: {
          state: 'published'
        },
        fuzzy: {}
      }
      this.$base.search('task', search)
        .then(res => {
          this.tasks = res.data.list
        })
    }
  }

}
</script>

<style scoped>

</style>
