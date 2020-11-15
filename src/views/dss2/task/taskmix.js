export default {

  methods: {
    tree (row) {
      console.log('tree', row)
    },
    weight (row) {
      console.log('weight', row)
    },
    finish (row) {
      console.log('finish', row)
    },
    publish (row) {
      this.$refs.editorDialog.open(row)
    },
    withdraw (row) {
      const bean = { id: row.id, state: 'over' }
      this.$confirm('是否撤销已发布的任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$base.update(this.entity, bean)
          .then(res => {
            this.$refs.table.load()
          })
      }).catch(() => {})
    }
  }

}
