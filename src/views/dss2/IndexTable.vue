<template>
  <div>

    <BaseDialog ref="dataDialog"   title="指标数据" :buttons="false" width="700">
      <template v-slot="{data}">
        <DataItem :data-id="data.id" :local="local"></DataItem>
      </template>
    </BaseDialog>

    <BaseDialog ref="chartDialog"   title="数据可视化" :buttons="false" width="700">
      <template v-slot="{data}">
        <Chart ref="chart" :data="data"></Chart>
      </template>
    </BaseDialog>

    <BaseDialog ref="insertDialog"   title="添加指标" @confirm="insert" width="400px" >
      <template v-slot="{data}">
        <DataInsertDialog :bean="data"></DataInsertDialog>
      </template>
    </BaseDialog>

    <BaseDialog ref="uploadDialog"   title="导入指标" :buttons="false" width="700">
      <template >
        <ViewUploadDialog action="/api/data-frame/file" :create="false"  @success="uploadSuccess"></ViewUploadDialog>
      </template>
    </BaseDialog>

    <el-row>
      <el-col :span="8">
        <el-button @click="$refs.insertDialog.open({})" size="small" type="primary" icon="fa fa-plus"> 创建指标 </el-button>
        <el-button @click="$refs.uploadDialog.open({})" size="small" type="success" icon="fa fa-upload"> 导入指标 </el-button>
      </el-col>
      <el-col :span="16" align="right">
        <el-switch
          v-model="local"
          active-text="我的指标"
          @change="changeLocal"
          inactive-text="所有指标"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-col>
    </el-row>

    <BaseTable ref="table" :entity="entity" :type="type" :search="search" >
      <template #operation="data">
        <!--  编辑数据  -->
        <el-tooltip  class="item" effect="light" content="指标数据" placement="top">
          <el-button
            @click="$refs.dataDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-table"></i></el-button>
        </el-tooltip>
        <!--  数据可视化  -->
        <el-tooltip  class="item" effect="light" content="数据可视化" placement="top">
          <el-button
            @click="$refs.chartDialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-line-chart"></i></el-button>
        </el-tooltip>

      </template>
    </BaseTable>

  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import DataItem from './dialog/DataItem'
import Chart from './dialog/Chart'
import DataInsertDialog from './dialog/DataInsertDialog'
import ViewUploadDialog from './dialog/ViewUploadDialog'
import Vue from 'vue'
export default {
  components: {
    BaseTable,
    BaseDialog,
    DataItem,
    Chart,
    DataInsertDialog,
    ViewUploadDialog
  },
  data () {
    return {
      local: true,
      entity: 'data',
      type: 'edit',
      structure: {
        edit: 'set',
        control: 'series',
        display: 'number'
      },
      search: {
        page: 1,
        size: 10,
        exact: {
          uid: this.$cookies.get('UID')
        },
        fuzzy: {}
      }
    }
  },
  mounted () {

  },
  methods: {
    uploadSuccess (data) {
      this.$refs.table.load()
      this.$refs.uploadDialog.close()
    },
    insert (data) {
      this.$base.insert('data', data)
        .then(res => {
          this.$refs.table.load()
        })
    },
    changeLocal (val) {
      const meta = this.$refs.table.getMeta()
      Vue.set(meta.OPERATION, 'export', val)
      Vue.set(meta.OPERATION, 'upload', val)
      Vue.set(meta.OPERATION, 'insertion', val)
      Vue.set(meta.OPERATION, 'edit', val)
      Vue.set(meta.OPERATION, 'remove', val)
      Vue.set(meta.OPERATION, 'insertion', val)
      if (val) {
        Vue.set(this.search.exact, 'uid', this.$cookies.get('UID'))
      } else {
        Vue.delete(this.search.exact, 'uid')
      }
    }
  }
}
</script>

<style scoped>

</style>
