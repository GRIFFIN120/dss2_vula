<template>
  <el-card shadow="hover">
    <el-tag
      style="margin-right: 3px"
      v-for="item in labelCopy"
      :key="item.id"
      closable
      :disable-transitions="false"
      @close="removeLabel(item)">
      {{item.name}}
    </el-tag>
    <el-button size="small" @click="showButton=false" v-if="showButton&&allowAdd" icon="fa fa-plus"> 添加</el-button>
    <el-select
      ref="select"
      v-if="!showButton"
      v-model="value"
      size="small"
      filterable
      remote
      clearable
      reserve-keyword
      allow-create
      placeholder="请输入标签"
      :remote-method="searchLabel"
      @change="labelChange"
      :loading="loading">
      <el-option
        v-for="(item,i) in filterResults"
        :key="i"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </el-card>
</template>

<script>
export default {
  props: ['labels'],
  data () {
    return {
      value: '',
      labelCopy: [],
      showButton: true,
      ids: [],
      filterResults: [],
      loading: false
    }
  },
  computed: {
    allowAdd () {
      return this.ids.length < 5
    }
  },
  mounted () {
    if (this.labels) {
      this.labelCopy = this.$utils.deepClone(this.labels)
    } else {
      this.labelCopy = []
    }
    const arr = []
    this.labelCopy.filter(function (e) {
      arr.push(e.id)
    })
    this.ids = arr
  },
  methods: {
    getIds () {
      return this.ids
    },
    removeLabel (item) {
      const idx = this.labelCopy.indexOf(item)
      this.labelCopy.splice(idx, 1)
      this.ids = this.ids.filter(function (e) {
        return e !== item.id
      })
    },
    labelChange (val) {
      if (typeof (val) === 'number') {
        // 当选中数据库已有标签时
        // 在搜索结果中查找标签对象
        const arr = this.filterResults.filter(function (e) {
          return e.id === val
        })
        if (arr.length === 1) {
          // 查找结果存在且唯一时：获取对象
          const item = arr[0]
          // 判断对象是否已经添加
          const idx = this.ids.indexOf(item.id)
          if (idx === -1) {
            // 对象未被添加时：向显性数组labels和隐性数组ids添加元素
            this.labelCopy.push(item)
            this.ids.push(item.id)
          } else {
            // 对象已被添加时：提示标签已存在
            this.$message.warning('标签已经存在')
          }
        } else {
          // 查找结果不存在，或者不唯一时：提示数据错误
          this.$message.error('数据读取错误')
        }
        // 将搜索结果置空
        this.value = null
        // 隐藏select，显示button
        this.showButton = true
      } else {
        this.$base.update('label', { name: val })
          .then(res => {
            const item = res.data
            this.labelCopy.push(item)
            this.ids.push(item.id)
            this.value = null
            this.showButton = true
          })
      }
    },
    searchLabel (v) {
      this.$base.search('label', {
        page: 1,
        size: 0,
        exact: {},
        fuzzy: {
          name: v
        }
      }).then(res => {
        this.filterResults = res.data.list
      })
    }
  }
}
</script>

<style scoped>

</style>
