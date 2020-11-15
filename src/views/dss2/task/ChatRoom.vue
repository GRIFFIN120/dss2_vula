<template>
  <div>
    <Expert :user="task.user" :task="task" :leader="true"></Expert>
    <template v-for="user in users">
      <Expert v-if="user.id!=$cookies.get('UID')" :key="user.id" :user="user" :task="task"></Expert>
    </template>
  </div>
</template>

<script>
import Expert from './Expert'
export default {
  components: { Expert },
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
