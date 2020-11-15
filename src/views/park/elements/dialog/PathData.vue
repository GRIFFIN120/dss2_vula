<template>
  <div>
    <el-input :rows="20" type="textarea" v-model="path"></el-input>
  </div>
</template>

<script>
export default {
  props: ['bean'],
  data () {
    return {
      path: '',
      valid: false
    }
  },
  watch: {
    path () {
      if (this.path.trim() !== '') {
        try {
          const arr = JSON.parse(this.path)
          if (arr instanceof Array) {
            const temp = arr.filter(function (e) {
              return e instanceof Array && e.length === 2 && typeof (e[0]) === 'number' && typeof (e[1]) === 'number'
            })
            this.valid = temp.length === arr.length
          } else {
            this.valid = false
          }
        } catch (e) {
          this.valid = false
        }
      }
    }
  },
  mounted () {
    if (this.bean && this.bean.path) {
      this.$base.dfs.get(this.bean, 'path')
        .then(res => {
          this.path = JSON.stringify(res.data)
        })
    }
  },
  methods: {
    getData () {
      if (this.valid && this.bean && this.bean.id) {
        return { id: this.bean.id, path: this.path }
      } else {
        this.$message.error('数据格式错误：必须是坐标构成的数组,例如[[lng,lat],[lng,lat]]')
      }
    }
  }
}
</script>

<style scoped>

</style>
