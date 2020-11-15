import Vue from 'vue'

export default {
  props: {
    entity: {
      type: String,
      default: 'user'
    },
    type: {
      type: String,
      default: 'display'
    },
    meta: {
      type: Object
    }
  },
  data () {
    return {
      META: {
        COLUMNS: [
          {
            prop: 'id',
            label: '编号'
          },
          {
            prop: 'name',
            label: '名称'
          }
        ], // 由column的tool，toolParam，toolParamKey构造参数param:
        OPERATION: {
          enable: true,
          sort: true,
          insertion: true,
          edit: true,
          remove: true,
          view: true,
          pop: false,
          search: true
        }
      },
      loaded: false,
      selectedItem: {}
    }
  },
  methods: {
    initMeta (callback) {
      if (this.meta) {
        this.META = this.meta
        if (callback && callback instanceof Function) callback()
        return
      }
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
        const operation = res[1].data.list
        this.META.COLUMNS = columns.length !== 0 ? columns : this.META.COLUMNS
        this.META.OPERATION = operation.length === 1 ? operation[0] : this.META.OPERATION
        this.loadParam(callback)
      })
    },
    loadParam (callback) {
      const th = this
      const requests = []
      const columns = []
      this.META.COLUMNS.filter(function (column) {
        const TOOL = column.tool
        const TOOL_PARAM = column.toolParam

        // if (!TOOL_PARAM || TOOL_PARAM.trim() === '') {
        //   th.$message.error('组件' + TOOL + '的参数缺失')
        //   return
        // }
        // 数字滑块 {min,max,step}
        if (TOOL === 'number') {
          const set = JSON.parse(TOOL_PARAM)
          if (set.length === 3) {
            Vue.set(column, 'param', { min: set[0], max: set[1], step: set[2] })
          } else {
            th.$message.error('组件' + TOOL + '的参数错误:' + set)
          }
        } else
        // 单选框/复选框 [{id,name,code}]     /多对一对对象在form中远程加载
        if (TOOL === 'select' || TOOL === 'list' || TOOL === 'transfer') { // || (TOOL === 'object' && !READ_ONLY)
          if (TOOL === 'transfer') {
            console.log(column)
          }

          let url = TOOL_PARAM
          if (url === undefined) return
          let requestBody = null
          const idx = url.indexOf('?')
          if (idx !== -1) {
            requestBody = th.$utils.getQueryObject(url)
            url = (url.substring(0, idx))
            if (requestBody.columns) {
              const keys = requestBody.columns.split(',')
              Vue.delete(requestBody, 'columns')
              column.depandOn = {
                url: url,
                data: requestBody,
                keys: keys
              }
            }
          }
          const request = th.$base.http.post(url, requestBody)
          requests.push(request)
          columns.push(column)
        } else
        // 系统常量数组 [{name,code}]
        if (TOOL === 'constants') {
          const arr = th.$utils.constants[TOOL_PARAM]
          Vue.set(column, 'param', arr)
        }
        return true
      })
      this.$base.http.all(requests)
        .then((res) => {
          for (const i in res) {
            Vue.set(columns[i], 'param', res[i].data)
          }
          this.loaded = true
          if (callback && callback instanceof Function) callback()
        })
    },

    getDepandOn (column, row, callback) {
      let url = column.toolParam
      const idx = url.indexOf('?')
      if (idx !== -1) {
        const requestBody = this.$utils.getQueryObject(url)
        url = (url.substring(0, idx))
        if (requestBody.columns) {
          const keys = requestBody.columns.split(',')
          keys.filter(function (key) {
            requestBody[key] = row[key]
          })
          this.$base.http.post(url, requestBody)
            .then(res => {
              callback(res.data)
            })
        }
      }
    },
    loadDepandOn (callback) {
      const requests = []
      const columns = []
      const th = this
      this.META.COLUMNS.filter(function (column) {
        const depandOn = column.depandOn
        if (depandOn) {
          const url = depandOn.url
          const data = depandOn.data
          const keys = depandOn.keys
          for (const i in keys) {
            const col = keys[i]
            const val = th.selectedItem[col]
            data[col] = val
          }
          const request = th.$base.http.post(url, data)
          requests.push(request)
          columns.push(column)
        }
      })
      this.$base.http.all(requests)
        .then((res) => {
          for (const i in res) {
            Vue.set(columns[i].depandOn, 'param', res[i].data)
          }
          this.loaded = true
          if (callback) callback()
        })
    }
  }
}
