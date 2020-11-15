<template>
  <div>

    <Dialog ref="dialog" :entity="entity" :meta="meta" @confirm="load" :title="title" :width="width" :search="search" :param="param"></Dialog>
    <Search ref="search" :search="search" :meta="meta" :param="param"></Search>
<!--表格-->
    <div v-if="!local" style="height: 30px">
      <el-badge style="float:right" v-if="searchCount!=0" :value="searchCount" class="item">
        <el-button  type="text" size="mini" @click="clearSearch">清空检索条件</el-button>
      </el-badge>
    </div>
    <el-table
      :data="results.list"
      style="width: 100%; font-size: 12px; border-top: 1px solid; border-bottom: 1px solid; "
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      show-overflow-tooltip
      :row-class-name="tableRowClassName"
      @current-change="select"
      @sort-change="sort"
    >
<!--   展示字段   -->
      <el-table-column
        v-if="indexed"
        type="index"
        label="行号"
        width="50">
        <template slot-scope="scope">
          <span>#{{scope.$index+1}}</span>
        </template>
      </el-table-column>

      <template  v-for="col in meta" >
        <el-table-column :key="col.prop" v-if="!col.hideOnList"
                         :sortable="operation.sort? (col.sortable?'custom':false): false"
                         :prop="col.prop"
                         :label="col.label"
                         :width="(col.width&&col.width!=0)?col.width:''">
          <template  slot-scope="{row}">
            <el-image v-if="col.prop==='thumb'"
              style="height: 60px;"
              :src="'/dfs/'+row[col.prop]"
              fit="scale-down"
              :preview-src-list="['/dfs/'+row.url]"
            >
              <div slot="error" class="image-slot">
                <i class="fa fa-image"></i>
              </div>
            </el-image>
            <el-tooltip v-else :content="row[col.prop]+''" placement="bottom" effect="light" :disabled="col.tool=='object'">
              <span v-html="getValue(col,row)"></span>
            </el-tooltip>
          </template>

        </el-table-column>
      </template>

      <el-table-column
        align="center"
        v-if="!local&&operation.enable"
        fixed="right"
        width="220px"
        label="操作">
        <template slot="header"  >
<!--          <el-button @click="$message.warning('数据下载功能仍在开发中...')"  style="margin-left: 10px" type="info"  circle size="mini"><i class="fa fa-download"></i></el-button>-->
<!--          <el-button @click="$message.warning('数据上传功能仍在开发中...')" style="margin-left: 10px" type="info"  circle size="mini"><i class="fa fa-upload"></i></el-button>-->
          <el-tooltip class="item" effect="light" content="检索数据" placement="top">
            <el-button @click="$refs.search.open()" style="margin-left: 10px" type="primary"  circle size="mini"><i class="fa fa-search"></i></el-button>
          </el-tooltip>
          <el-tooltip v-if="operation.insertion" class="item" effect="light" content="添加数据" placement="top">
            <el-button   type="success"  circle size="mini" @click="$refs.dialog.open({},true)"><i class="fa fa-plus"></i></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="{row}" >
          <slot name="operation" :row="row">

          </slot>
          <el-tooltip class="item" effect="light" content="本行数据详情" placement="top">
            <el-button
              v-if="operation.view"
              size="mini"
              @click="$refs.dialog.open(row,false)" type="primary" circle plain><i class="fa fa-list"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="编辑本行数据" placement="top">
            <el-button
              v-if="operation.edit"
              size="mini"
              @click="$refs.dialog.open(row,true)" type="warning" circle plain><i class="fa fa-edit"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除本行数据条" placement="top">
            <el-button
              v-if="operation.remove"
              size="mini"
              @click="remove(row)" type="danger" circle plain><i class="fa fa-remove"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="本行数据上移" placement="top">
            <el-button
              v-if="(!operation.sort)&&operation.pop&&searchCount==0"
              size="mini"
              @click="up(row)" type="info"  circle plain><i class="fa fa-arrow-up"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="本行数据下移" placement="top">
            <el-button
              v-if="(!operation.sort)&&operation.pop&&searchCount==0"
              size="mini"
              @click="down(row)" type="info" circle plain><i class="fa fa-arrow-down"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>

    <Paging v-if="!local" :results="results" :search="search"></Paging>
  </div>
</template>

<script>
import mix from '../model'
import Dialog from '../dialog/Dialog'
import Search from '../search/Search'
import Paging from './Paging'

export default {
  name: 'index',
  components: {
    Dialog, Search, Paging
  },
  mixins: [mix],
  methods: {
    getValue (col, row) {
      let val = row[col.prop]

      if (col.tool === 'object') {
        val = val[col.selectValueKey]
      } else if (col.tool === 'select') {
        const set = this.param[col.prop]
        if (set && set instanceof Array) {
          set.filter(function (e) {
            if (e[col.selectValueKey] === val) {
              val = e.name
            }
          })
        }
      } else if (col.tool === 'switch') {
        val = val ? '✅' : '🚫'
      } else if (col.tool === 'list') {
        let str = ''
        const th = this
        const set = this.param[col.prop]
        if (set && set instanceof Array) {
          val.filter(function (e) {
            const obj = th.$utils.findById(set, e)
            str += '<span class="el-tag el-tag--mini el-tag--light">' + obj.name + '</span>'
          })
        }
        val = str
      } else {
        if (val && val.length > 20) {
          val = val.substring(0, 20) + '...'
        }
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

  .drawer{
    padding: 10px;
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
