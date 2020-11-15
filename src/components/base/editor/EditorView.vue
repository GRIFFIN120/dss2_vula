<template>
    <el-card v-html="html"></el-card>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    this.$base.dfs.get(this.data)
      .then(res => {
        this.html = res.data
      })
  }
}
</script>

<style scoped>

</style>
