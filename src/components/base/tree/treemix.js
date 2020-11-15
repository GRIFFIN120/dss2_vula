import Vue from 'vue'

export default {
  props: {
    rootLabel: {
      default: '根结点'
    },
    defaultExpandAll: {
      default: false
    },
    checkDrop: {
      type: Function
    },
    beforeInsert: {
      type: Function
    },
    beforeEdit: {
      type: Function
    }
  },
  data () {
    return {
      meta: [],
      operation: {},
      param: {}
    }
  },
  methods: {
    load (callback) {
      const root = {
        name: this.rootLabel,
        icon: 'fa fa-home',
        id: 0,
        pid: -1
      }
      this.$base.tree(this.entity, this.search)
        .then(res => {
          root.children = res.data
          this.tree = [root]
          this.$refs.elTree.setCheckedKeys(this.checkedKeys)
          if (callback) callback()
        })
    },
    loadMeta () {
      const metaSearch = {
        exact: {
          entity: this.entity,
          type: this.type
        }
      }
      this.$base.http.all([
        this.$base.search('meta', metaSearch),
        this.$base.search('meta-operation', metaSearch)
      ]).then((res) => {
        const columns = res[0].data.list
        const operations = res[1].data.list
        this.meta = columns.length !== 0 ? columns : this.meta
        this.operation = operations.length === 1 ? operations[0] : this.operation
        this.loadParam()
      })
    },
    loadParam () {
      const th = this
      this.meta.filter(function (e) {
        const prop = e.prop
        const tool = e.tool
        if (tool === 'number') {
          const temp = e.selectTypes
          if (temp) {
            const set = JSON.parse(temp)
            const obj = {
              min: set[0],
              max: set[1],
              step: set[2]
            }
            Vue.set(th.param, prop, obj)
          }
        } else if (tool === 'select') {
          const url = e.selectTypes
          th.$base.http.get(url)
            .then(res => {
              Vue.set(th.param, prop, res.data)
            })
        } else if (tool === 'constants') {
          const cst = e.selectTypes
          const arr = th.$utils.constants[cst]
          Vue.set(th.param, prop, arr)
        }
        return true
      })
    }
  }
}
