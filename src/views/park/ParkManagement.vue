<template>
  <div>
    <BaseDialog ref="viewDialog" >
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        {{data}}
      </template>
    </BaseDialog>
    <!--  公园主页 - 对话框  -->
    <BaseDialog ref="articleDialog" @confirm="articleConfirm" width="940px" title="公园主页" :clone="true">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <BaseEditor ref="editor" :data="data" :entity="entity" field="home"></BaseEditor>
      </template>
    </BaseDialog>
    <!--  主页图片 - 对话框  -->
    <BaseDialog ref="imageDialog" title="上传公园封面图">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <BaseUpload :entity="entity" type="image" :data="data" @success="imageConfirm" ></BaseUpload>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <BaseTable ref="table" :entity="entity" type="edit" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <!--  全貌预览 - 按钮  -->
        <el-tooltip class="item" effect="light" content="全貌预览" placement="top">
          <el-button
            @click="$refs.viewDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-eye"></i></el-button>
        </el-tooltip>
        <!--  文章主页 - 按钮  -->
        <el-tooltip class="item" effect="light" content="公园主页" placement="top">
          <el-button
            @click="$refs.articleDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-file"></i></el-button>
        </el-tooltip>
        <!--  主页图片 - 按钮  -->
        <el-tooltip class="item" effect="light" content="公园封面图" placement="top">
          <el-button
            @click="$refs.imageDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-image"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import BaseUpload from '../../components/base/BaseUpload'
import BaseEditor from '../../components/base/editor/BaseEditor'

export default {
  components: {
    BaseTable, BaseDialog, BaseUpload, BaseEditor
  },
  data () {
    return {
      entity: 'park'
    }
  },
  mounted () {
  },
  methods: {
    imageConfirm () {
      // 4. 表单提交后的操作
      this.$refs.imageDialog.close()
      this.$refs.table.load()
    },
    articleConfirm () {
      const bean = this.$refs.editor.getData()
      this.$base.dfs.text(this.entity, bean)
        .then(res => {
          console.log(res)
          this.$refs.table.load()
        })
    }
  }
}
</script>

<style scoped>

</style>
