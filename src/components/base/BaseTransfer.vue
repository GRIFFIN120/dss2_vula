<template>
    <el-col style="margin-bottom: 40px">
      <el-transfer
        v-model="value"
        filterable
        :data="data"
        :props="{
          key: 'id',
          label: 'name'
        }"
      >
      </el-transfer>
    </el-col>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      data: [],
      editable: false

    }
  },
  methods: {
    init (data, value, editable) {
      this.editable = !!editable
      const th = this
      this.value = value
      data.filter(function (d) {
        d.disabled = !th.editable
      })
      this.data = data
    },
    getValue () {
      return this.value
    }
  }
}
</script>

<style scoped>

</style>
