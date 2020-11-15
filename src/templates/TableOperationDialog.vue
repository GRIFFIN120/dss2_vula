<template>
  <div>
    <BaseDialog ref="dialog" @confirm="confirm"  title="对话框" width="400px">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        {{data}}
      </template>
    </BaseDialog>
    <!--  1. 修改 entity 和 type  -->
    <BaseTable ref="table" :entity="entity" :type="type" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <el-tooltip class="item" effect="light" content="操作" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-circle"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
export default {
  components: {
    BaseTable, BaseDialog
  },
  data () {
    return {
      entity: 'vala',
      type: 'edit'
    }
  },
  mounted () {
  },
  methods: {
    confirm () {
      // 4. 表单提交后的操作
      this.$refs.table.load()
    }
  }
}
</script>

<style scoped>

</style>
