<template>
    <div>
      <el-row>
        <el-col :span="16" style="padding: 5px">
          <el-card >
            <h3>决策报告：{{task.name}}</h3>
            <div v-html="html"></div>
          </el-card>
        </el-col>
        <el-col :span="8" style="padding: 5px">
          <el-card>
            <h3>决策结果</h3>
            <ResultChart :userId="task.user.id" :nodeId="0" :data="task"></ResultChart>
          </el-card>
          <el-card style="margin-top: 10px">
            <h3>指标体系</h3>
            <ResultTree :task="task" state="weight"></ResultTree>
          </el-card>
        </el-col>
      </el-row>

    </div>
</template>

<script>
import ResultChart from '../task/ResultChart'
import ResultTree from '../chat/ResultTree'
export default {
  props: ['task'],
  components: {
    ResultChart,
    ResultTree
  },
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    this.$base.dfs.get(this.task)
      .then(res => {
        this.html = (res.data)
      })
  }
}
</script>

<style scoped>

</style>
