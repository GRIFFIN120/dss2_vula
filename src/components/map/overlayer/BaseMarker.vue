<template>
    <div></div>
</template>

<script>
export default {
  props: ['map', 'StyleParam', 'bean', 'lng', 'lat'],
  data () {
    return {
      entity: 'polygon',
      style: {},
      object: null
    }
  },
  beforeMount () {
    if (this.bean) {
      const path = this.bean.path
      if (path instanceof Array) {
        this.initObject(path)
      } else if (typeof (path) === 'string') {
        this.$base.dfs.text.load(path)
          .then(res => {
            const data = JSON.parse(res.data)
            this.initObject(data.text)
          })
      }
    } else {
      this.initObject(this.getDefaultPath())
    }
  },
  methods: {
    createObject () {
      return null
    }
  }
}
</script>

<style scoped>

</style>
