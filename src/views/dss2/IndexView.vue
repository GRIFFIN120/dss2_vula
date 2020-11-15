<template>
  <div>

    <BaseDialog ref="dialog"   title="视图可视化" :buttons="false" width="700">
      <template v-slot="{data}">
        <Charts :data="data"></Charts>
      </template>
    </BaseDialog>
    <BaseDialog ref="uploadDialog"   title="视图上传" :buttons="false" width="400px">
      <template >
        <ViewUploadDialog action="/api/data-frame/file" :create="true"  @success="uploadSuccess"></ViewUploadDialog>
      </template>
    </BaseDialog>
    <BaseDialog ref="insertDialog" @confirm="insert"   title="新建视图"  width="400px">
      <template >
        <ViewInsertDialog ref="insert"></ViewInsertDialog>
      </template>
    </BaseDialog>

    <el-row>
      <el-col :span="12">
        <el-button @click="$refs.insertDialog.open()" size="small" type="primary" icon="fa fa-plus"> 创建视图 </el-button>
        <el-button @click="$refs.uploadDialog.open()" size="small" type="success" icon="fa fa-upload"> 导入视图 </el-button>
      </el-col>
    </el-row>

    <BaseTable ref="table" :entity="entity" :type="type" :search="search" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <el-tooltip  class="item" effect="light" content="可视化" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-line-chart"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>

  </div>
</template>

<script>
import Vue from 'vue'
import BaseTable from '~table'
import BaseDialog from '~dialog'
import ViewUploadDialog from './dialog/ViewUploadDialog'
import ViewInsertDialog from './dialog/ViewInsertDialog'
import Charts from './dialog/Charts'

export default {
  components: {
    BaseTable,
    BaseDialog,
    ViewUploadDialog,
    ViewInsertDialog,
    Charts
  },
  data () {
    return {
      local: true,
      entity: 'data-frame',
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
    insert (data) {
      const bean = this.$refs.insert.getBean()
      if (bean.name !== null && bean.name.trim() !== '' && bean.domain !== null && bean.scaleId !== null) {
        this.$base.insert('data-frame', bean)
          .then(res => {
            this.$refs.table.load()
          })
      } else {
        this.$message.warning('名称、结构类型、数据尺度不能为空')
      }
    },
    uploadSuccess (data) {
      this.$refs.table.load()
      this.$refs.uploadDialog.close()
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
    },
    select (val) {
      this.search.exact.domain = val
      if (val === 'set') {
        this.type = 'edit'
      } else if (val === 'series') {
        this.type = 'control'
      } else if (val === 'number') {
        this.type = 'display'
      }
    }
  }
}
</script>

<style scoped>

</style>
