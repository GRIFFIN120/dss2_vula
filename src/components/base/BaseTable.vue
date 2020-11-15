<template>
  <div v-if="loaded">
    <BaseDialog ref="dialog" :title="title" width="400px" @confirm="save">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <BaseForm ref="form" :item="data" :meta="META" :editable="editable"></BaseForm>
      </template>
    </BaseDialog>

    <BaseDialog ref="transfer" title="数据筛选" width="650px" @confirm="transfer">
      <template >
        <!--  3. 引入对话框中的模版  -->
        <BaseTransfer ref="trans"></BaseTransfer>
      </template>
    </BaseDialog>

    <BaseDrawer ref="drawer" title="数据检索" width="20%" :clone="false">
      <template >
        <!--  3. 引入对话框中的模版  -->
        <SearchForm :search="search" :meta="META"></SearchForm>
      </template>
    </BaseDrawer>

    <!--搜索条件数-->
    <div  >
      <el-badge style="float:right" v-if="searchCount!=0" :value="searchCount" class="item">
        <el-button  type="text" size="mini" @click="clearSearch">清空检索条件</el-button>
      </el-badge>
    </div>
    <!--表格-->
    <el-table
      :data="results.list"
      style="width: 100%; font-size: 12px; border-top: 1px solid; border-bottom: 1px solid; margin-top: 5px"
      :header-cell-style="{background:'#f3f3f3',color:'#606266'}"
      show-overflow-tooltip
      :row-class-name="tableRowClassName"
      @current-change="select"
      @sort-change="sort"
      border
    >
      <!--  序号字段   -->
      <el-table-column
        v-if="indexed"
        type="index"
        label="行号"
        width="50">
        <template slot-scope="scope">
          <span>#{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!--  展示字段   -->
      <template  v-for="column in META.COLUMNS"  >
        <el-table-column
          v-if="!column.hideOnList"
          :key="column.prop"
          :sortable="!META.OPERATION.enable || (META.OPERATION.sort? (column.sortable?'custom':false): false)"
          :prop="column.prop"
          :label="column.label"
          :width="(column.width&&column.width!=0)?column.width:''"
          :align="column.tool=='switch'?'center':'left'"
        >
          <!--  展示字段内容   -->
          <template  slot-scope="{row}">
            <el-image
              v-if="column.prop==='thumb'"
              style="height: 30px;"
              :src="'/dfs/'+row.thumb"
              fit="scale-down"
              :preview-src-list="['/dfs/'+row.url]"
            >
              <div slot="error" class="image-slot">
                <i class="fa fa-image"></i>
              </div>
            </el-image>
            <el-button
              v-else-if="column.tool==='transfer'"
              @click="openTransfer(row,column)"
              type="text" size="small"
              :disabled="column.readOnly"
            >
              数量: {{row[column.prop].length}}
            </el-button>
            <el-tooltip v-else :content="getContent(column,row)" placement="bottom" effect="light">
              <span v-html="getValue(column,row)"></span>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>

      <!--  操作   -->
      <el-table-column
        align="center"
        v-if="META.OPERATION.enable"
        fixed="right"
        :width="operationColumnWidth"
        label="操作">

        <!--  表头操作   -->
        <template slot="header"  >
<!--          <el-tooltip v-show="true" class="item" effect="light" content="刷新表格" placement="top">-->
<!--            <el-button  @click="initMeta(load())" type="primary" plain circle size="mini" style="margin-left: 10px"><i class="fa fa-refresh"></i></el-button>-->
<!--          </el-tooltip>-->
          <el-tooltip v-show="META.OPERATION.export" class="item" effect="light" content="数据上传" placement="top">
            <el-button  type="info" circle size="mini" style="margin-left: 10px"><i class="fa fa-download"></i></el-button>
          </el-tooltip>
          <el-tooltip v-show="META.OPERATION.upload" class="item" effect="light" content="数据下载" placement="top">
            <el-button  type="info" circle size="mini" style="margin-left: 10px"><i class="fa fa-upload"></i></el-button>
          </el-tooltip>
          <el-tooltip v-show="true||META.OPERATION.search" class="item" effect="light" content="检索数据" placement="top">
            <el-button @click="openSearch" type="primary" circle size="mini" style="margin-left: 10px"><i class="fa fa-search"></i></el-button>
          </el-tooltip>
          <el-tooltip v-show="META.OPERATION.insertion" class="item" effect="light" content="添加数据" placement="top">
            <el-button @click="openInsert" type="success" circle size="mini" ><i class="fa fa-plus"></i></el-button>
          </el-tooltip>
        </template>

        <!--  行内操作   -->
        <template slot-scope="{row}" >
          <!--  按钮扩充插槽   -->
          <slot name="operation" :row="row">
          </slot>
          <el-tooltip class="item" effect="light" content="数据详情" placement="top">
            <el-button
              v-show="META.OPERATION.view"
              @click="openView(row)"
              size="mini" type="primary" circle plain><i class="fa fa-list"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="编辑数据" placement="top">
            <el-button
              v-show="META.OPERATION.edit"
              @click="openEdit(row)"
              size="mini" type="warning" circle plain><i class="fa fa-edit"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除本行数据条" placement="top">
            <el-button
              v-show="META.OPERATION.remove"
              @click="remove(row)"
              size="mini" type="danger" circle plain><i class="fa fa-remove"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="本行数据上移" placement="top">
            <el-button
              v-show="(!META.OPERATION.sort)&&META.OPERATION.pop"
              @click="up(row)"
              size="mini" type="info"  circle plain><i class="fa fa-arrow-up"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="本行数据下移" placement="top">
            <el-button
              v-show="(!META.OPERATION.sort)&&META.OPERATION.pop"
              @click="down(row)"
              size="mini" type="info" circle plain><i class="fa fa-arrow-down"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <Paging  :results="results" :search="search"></Paging>

  </div>
</template>

<script>
import mix from './model'
import Paging from './table/Paging'
import BaseDialog from './BaseDialog'
import BaseForm from './BaseForm'
import BaseDrawer from './BaseDrawer'
import SearchForm from './search/SearchForm'
import BaseTransfer from './BaseTransfer'

export default {
  name: 'index',
  components: {
    Paging,
    BaseDialog,
    BaseForm,
    BaseDrawer,
    SearchForm,
    BaseTransfer
  },
  mixins: [mix],
  methods: {
    transfer (data) {
      const value = this.$refs.trans.getValue()
      const bean = { id: data.id }
      bean[this.column.prop] = value

      console.log(bean)

      this.$base.update(this.entity, bean)
        .then(res => {
          this.load()
        })
    },
    openTransfer (row, column) {
      this.column = column
      this.selectedItem = row
      const th = this
      this.getDepandOn(column, row, function (data) {
        const value = row[column.prop]
        const editalble = th.META.OPERATION.edit
        th.$refs.transfer.open(row, function () {
          setTimeout(function () {
            th.$refs.trans.init(data, value, editalble)
          }, 300)
        })
      })

      // const th = this
      // this.loadDepandOn(function () {
      //   console.log(column)
      //   const data = column.param
      //   const value = row[column.prop]
      //   const editalble = th.META.OPERATION.edit
      //   th.column = column

      // })
    },
    save (data) {
      const item = this.$refs.form.getData()
      if (data.id) {
        item.id = data.id
      }

      this.$base.update(this.entity, item)
        .then(res => {
          this.dialogVisible = false
          this.load()
        })
    },
    openSearch () {
      this.$refs.drawer.open(this.search)
    },
    openInsert () {
      this.title = '新增数据'
      this.editable = true
      let object = {}
      object = this.$utils.objectMerge(object, this.search.exact)
      object = this.$utils.objectMerge(object, this.search.fuzzy)
      this.$refs.dialog.open(object)
    },
    openEdit (row) {
      this.title = '编辑数据'
      this.editable = true
      this.$refs.dialog.open(row)
    },
    openView (row) {
      this.title = '数据详情'
      this.editable = false
      this.$refs.dialog.open(row)
    },
    getContent (column, row) {
      let val = row[column.prop]
      if (column.tool === 'object') {
        val = val[column.toolParamKey]
      } else if (column.tool === 'select') {
        const set = column.param
        if (set && set instanceof Array) {
          set.filter(function (e) {
            if (e[column.toolParamKey] === val) {
              val = e.name
            }
          })
        }
      } else if (column.tool === 'switch') {
        const flag = val === undefined ? false : val
        val = flag ? '是' : '否'
      } else if (column.tool === 'list') {
        let str = ''
        const th = this
        const set = column.param
        if (set && set instanceof Array) {
          val.filter(function (e) {
            const obj = th.$utils.findById(set, e)
            str += obj.name + ' '
          })
        }
        val = str
      }
      return val + ''
    },
    getValue (column, row) {
      let val = row[column.prop]
      if (column.tool === 'object') {
        val = column.toolParamKey ? val[column.toolParamKey] : val.name
      } else if (column.tool === 'select') {
        const set = column.param
        if (set && set instanceof Array) {
          set.filter(function (e) {
            if (e[column.toolParamKey] === val) {
              val = e.name
            }
          })
        }
      } else if (column.tool === 'switch') {
        const flag = val === undefined ? false : val
        val = flag ? '<i class="fa fa-check" style="color:#b8d200"></i>' : '<i class="fa fa-remove" style="color:#f2c9ac"></i>'
        return val
      } else if (column.tool === 'list') {
        let str = ''
        const th = this
        const set = column.param
        if (set && set instanceof Array && set.length < 5) {
          val.filter(function (e) {
            const obj = th.$utils.findById(set, e)
            str += '<span class="el-tag el-tag--mini el-tag--light">' + obj.name + '</span>'
          })
        } else {
          str = '数量:' + set.length
        }
        val = str
        return val
      }

      if (val && val.length > 20) {
        val = val.substring(0, 20) + '...'
      }

      return val
    }
  }
}
</script>

<style>
  .el-table .success-row {
    background: #e4dc8a;
    color: #007bbb;
  }

  .el-table .header {
    color: #337ab7;
  }

  .image-slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 20px;
  }
</style>
