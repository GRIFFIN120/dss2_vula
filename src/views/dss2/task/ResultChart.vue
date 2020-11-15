<template>
  <div>

    <el-row><el-col align="center"><h3>{{data.name}}</h3></el-col></el-row>

    <div  :style="{'margin-top': '15px','width': '100%','height': '300px'}" ref="chartdiv" v-html="message" ></div>
  </div>
</template>

<script>
import chartmix from '../dialog/chartmix'
export default {
  mixins: [chartmix],
  props: ['userId', 'nodeId'], // data=task
  data () {
    return {
      min: 0,
      max: 1,
      range: [
        {
          start: 0,
          end: 0.2,
          label: '无影响',
          color: '#19448e'
        },
        {
          start: 0.2,
          end: 0.4,
          label: '需要关注',
          color: '#69821b'
        },
        {
          start: 0.4,
          end: 0.6,
          label: '密切关注',
          color: '#dccb18'
        },
        {
          start: 0.6,
          end: 0.8,
          label: '较为重要',
          color: '#ea5506'
        },
        {
          start: 0.8,
          end: 1.0,
          label: '十分重要',
          color: '#e2041b'
        }
      ]
    }
  },
  mounted () {
    const url = 'task-tree/getResult/' + this.data.id + '/' + this.userId + '/' + this.nodeId
    console.log(url)

    this.$base.http.get(url)
      .then(res => {
        this.list = (res.data)
        this.makeChart(this.$refs.chartdiv)
      })
  },
  methods: {

  }

}
</script>

<style scoped>

</style>
