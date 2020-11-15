<template>
  <div><!-- 工具栏容器 -->
    <el-row style="margin-bottom: 10px">
      <el-col :span="20">
        <el-input v-model="data.name" size="medium">
          <template slot="prepend">文章标题</template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="medium" style="float: right" type="success" plain icon="fa fa-image" @click="$refs.imageDialog.open()"> 已上传图片</el-button>
      </el-col>
    </el-row>

    <div id="toolbar-container"></div>
    <!-- 编辑器容器 -->
    <div id="editor" style="border: 1px solid #eeeeee"></div>

    <BaseDialog ref="imageDialog" width="50%" title="已上传图片" :buttons="false">
      <template >
        <EditorImageList :data="data" :entity="entity"></EditorImageList>
      </template>
    </BaseDialog>
  </div>

</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import BaseDialog from '~dialog'
import EditorImageList from './EditorImageList'

export default {
  components: {
    BaseDialog,
    EditorImageList
  },
  props: {
    entity: {
      type: String
    },
    data: {
      type: Object
    },
    field: {
      type: String,
      default: 'url'
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    if (this.data.server && this.data[this.field]) {
      this.$base.dfs.get(this.data, this.field)
        .then(res => {
          const html = res.data
          this.initCKEditor(html)
        })
    } else {
      this.initCKEditor()
    }
  },
  methods: {
    initCKEditor (html) {
      const param = this.$utils.param({ id: this.data.id, entity: this.entity })

      console.log('param', param)

      const url = '/api/' + this.entity + '/editor/image?' + param
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        ckfinder: {
          uploadUrl: url
        }
      }).then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)
        this.editor = editor // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        if (html) editor.setData(html)
      }).catch(error => {
        console.error(error)
      })
    },
    getData () {
      const bean = {
        id: this.data.id,
        name: this.data.name
      }
      let html = this.editor.getData()
      if (html.trim() === '') {
        html = '<div></div>'
      }
      bean[this.field] = html
      return bean
    }
  }
}

</script>

<style scoped>

</style>
