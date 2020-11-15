import meta from './meta'
import Vue from 'vue'

export default {
  mixins: [meta],
  props: {
    search: {
      type: Object,
      default: function () {
        return {
          exact: {},
          fuzzy: {},
          page: 1,
          size: 10
        }
      }
    },
    width: {
      default: '40%'
    },
    indexed: {
      default: false
    },
    operationColumnWidth: {
      type: String,
      default: '220px'
    },
    url: {
      type: String
    },
    paras: {
      type: Object
    }
  },
  data () {
    return {
      exact: {},
      results: {},
      item: {},
      editable: false,
      title: '',
      temp: '<i class="fa fa-user"></i>',
      column: {}
    }
  },
  mounted () {
    this.exact = this.$utils.deepClone(this.search.exact) // 默认的exact搜索条件不作为表格的搜素条件，需要固定住
    this.initMeta(this.load())
  },
  computed: {
    searchCount () {
      let count = 0
      for (const key in this.search.exact) {
        // 不统计默认的exact搜索条件
        if (this.exact[key]) {
          continue
        } else if (this.search.exact[key]) {
          count++
        }
      }
      for (const key in this.search.fuzzy) {
        if (this.search.fuzzy[key]) {
          count++
        }
      }
      return count
    }
  },
  watch: {
    // 搜索条件发生变化时，重新搜索
    search: {
      handler: function () {
        // （清理掉搜索中的空字符）
        console.log('search changed', this.search)
        for (const key in this.search.exact) {
          if (this.search.exact[key] === '') {
            delete this.search.exact[key]
          }
        }
        for (const key in this.search.fuzzy) {
          if (this.search.fuzzy[key] === '') {
            delete this.search.fuzzy[key]
          }
        }
        this.load()
      },
      deep: true
    },
    type () {
      this.loaded = false
      this.initMeta(this.load())
    }
  },
  methods: {
    getMeta () {
      return this.META
    },
    getData () {
      return this.results.list
    },
    load (callback) {
      if (this.url) {
        this.$base.http.post(this.url, this.paras)
          .then(res => {
            const list = res.data
            if (list) {
              const length = list.length
              this.results = {
                list: list,
                resultsTotal: length,
                resultsCount: length,
                pagingNumber: 1,
                pagingSize: 0,
                pagingTotal: 1,
                orderColumn: 'timestamp',
                orderDirection: 'desc'
              }
            }

            if (callback && callback instanceof Function) callback()
          })
      } else {
        this.$base.search(this.entity, this.search)
          .then(res => {
            this.results = res.data
            // 防止分页页数溢出
            const { pagingNumber, pagingTotal } = res.data
            if (pagingNumber > pagingTotal) {
              this.search.page = pagingTotal
            }
            if (callback && callback instanceof Function) callback()
          })
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      let clazz = ''
      if (this.item != null && row.id === this.item.id) {
        clazz = 'success-row'
      }
      return clazz
    },
    clearSearch () {
      this.$confirm('是否清空 ' + this.searchCount + ' 项数据检索条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.search.exact = this.exact
        this.search.fuzzy = {}
      }).catch(() => {
      })
    },
    sort (params) {
      if (params.order === null) {
        Vue.delete(this.search, 'sortColumn')
        Vue.delete(this.search, 'direction')
      } else {
        const direction = params.order === 'descending' ? 'desc' : 'asc'
        Vue.set(this.search, 'sortColumn', params.prop)
        Vue.set(this.search, 'direction', direction)
      }
    },
    select (row) {
      if (row != null) { this.item = row }
    },
    remove (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$base.remove(this.entity, row.id)
          .then(res => {
            this.load()
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    up (row) {
      let search = this.$utils.deepClone(this.search.fuzzy)
      search = this.$utils.objectMerge(search, this.search.exact)

      this.$base.order(this.entity, row.id, 'before', search)
        .then(() => {
          this.load(() => {
            const filter = this.results.list.filter((e) => { return e.id === row.id })
            if (filter.length === 0) {
              this.search.page--
            }
          })
        })
    },
    down (row) {
      let search = this.$utils.deepClone(this.search.fuzzy)
      search = this.$utils.objectMerge(search, this.search.exact)
      this.$base.order(this.entity, row.id, 'after', search)
        .then(() => {
          this.load(() => {
            const filter = this.results.list.filter((e) => { return e.id === row.id })
            if (filter.length === 0) {
              this.search.page++
            }
          })
        })
    }

  }
}
