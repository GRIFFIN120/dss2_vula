<template>
    <div>
      <el-card :class="weightClass" >
        <span v-html="weightTxt" style="font-size: 17px;font-weight: bolder" ></span>
        <el-button style="float:right" size="mini" type="info" plain @click="divide">等分权重</el-button>
      </el-card>

        <template v-for="(bean,id) in object">
          <div :key="id" style="padding: 5px;margin-bottom: 5px">
            <h4>{{bean.name}}</h4>
            <el-slider
              :show-input="true"
              input-size="mini"
              v-model="object[id].weight"
              :min="0"
              :max="100"
              :step="1">
            </el-slider>
          </div>
        </template>
    </div>
</template>

<script>
export default {
  props: ['node'],
  computed: {
    remain () {
      let sum = 0
      for (const id in this.object) {
        sum += this.object[id].weight
      }
      return 100 - sum
    },
    weightClass () {
      if (this.remain === 0) {
        return 'weight-success'
      } else if (this.remain < 0) {
        return 'weight-error'
      } else {
        return 'weight-warning'
      }
    },
    weightTxt () {
      if (this.remain === 0) {
        return '全部权限分配完毕'
      } else if (this.remain < 0) {
        return '权重溢出：' + (-this.remain)
      } else {
        return '剩余权重：' + (this.remain)
      }
    }

  },
  data () {
    return {

      object: {}
    }
  },
  mounted () {
    const obj = {}
    this.node.children.filter(function (n) {
      const weight = n.weight || 0
      obj[n.id] = { name: n.name, weight }
    })
    this.object = obj
  },
  methods: {
    getList () {
      if (this.remain !== 0) return null
      const arr = []
      for (const id in this.object) {
        const weight = this.object[id].weight || 0
        arr.push({ id, weight })
      }
      return arr
    },
    divide () {
      const weight = parseInt(100 / this.node.children.length)
      for (const id in this.object) {
        this.object[id].weight = weight
      }
    }
  }

}
</script>

<style scoped>
  .weight-error{
    background-color: #F56C6C;
  }
  .weight-success{
    background-color: #67C23A;
  }
  .weight-warning{
    background-color: #E6A23C;
  }
</style>
