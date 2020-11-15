<template>
  <div>
    {{task}}
  </div>
</template>

<script>
export default {
  components: { },
  props: ['task'],
  data () {
    return {
      users: []
    }
  },
  mounted () {
    const url = 'user/get/all/' + this.task.experts
    this.$base.http.post(url)
      .then(res => {
        this.users = (res.data)
      })
  },
  methods: {

  }

}
</script>

<style scoped>

</style>
