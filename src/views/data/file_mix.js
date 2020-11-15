export default {
  data () {
    return {
      refs: {
        table: 'table',
        selection: 'selection',
        tree: 'tree'
      }
    }
  },
  methods: {
    locationChange (data) {
      const bean = {
        id: data.id,
        lng: data.lng,
        lat: data.lat
      }
      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs[this.refs.table].load()
        })
    },
    saveLabels (item) {
      const labelIds = this.$refs[this.refs.selection].getIds()
      const bean = { id: item.id, labels: labelIds }

      console.log(bean, this.entity)

      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs[this.refs.table].load()
        })
    },
    saveDomains (item) {
      let keys = this.$refs[this.refs.tree].getCheckedKeys()
      keys = keys.filter(function (e) {
        return e !== 0
      })
      const bean = { id: item.id, domains: keys }
      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs[this.refs.table].load()
        })
    }
  }
}
