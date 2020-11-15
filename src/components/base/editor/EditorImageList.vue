<template>
  <div>

    <BaseDialog ref="dialog"  width="940px" title="图片链接" :buttons="false">
      <template v-slot="{data}">
        <a target="_blank" :href="data.server+data.url">{{data.server+data.url}}</a>
      </template>
    </BaseDialog>

    <BaseTable ref="table" entity="editor-image" type="edit" :search="search" >
      <template #operation="data">
        <el-tooltip class="item" effect="light" content="图片链接" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-link"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'

export default {
  props: ['data', 'entity'],
  components: {
    BaseTable,
    BaseDialog
  },
  data () {
    return {
      search: {
        page: 1,
        size: 5,
        exact: {
          beanId: this.data.id,
          beanEntity: this.entity
        }
      }
    }
  },
  mounted () {
  },
  methods: {
  }

}
</script>

<style scoped>

</style>
