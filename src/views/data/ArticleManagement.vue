<template>
  <div>
<!--    上传按钮  -->
    <el-button @click="insertArticle" icon="fa fa-cloud-upload" type="success" size="small"> 新的文章</el-button>

<!--    富文本编辑-对话框  -->
    <BaseDialog ref="dialog" @confirm="confirm" width="940px" title="编辑文章" :clone="true"><!-- @cancel="insertCancel" -->
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <BaseEditor ref="editor" :data="data" :entity="entity" ></BaseEditor>
      </template>
    </BaseDialog>

<!--    预览-对话框  -->
    <BaseDialog ref="viewDialog" width="940px" title="文章预览" :buttons="false">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <EditorView  :data="data"  ></EditorView>
      </template>
    </BaseDialog>

<!--    类别-对话框  -->
    <BaseDialog ref="domainDialog"  @confirm="saveDomains" width="500px" title="类别">
      <template v-slot="{data}">
        <BaseTree :ref="refs.tree" entity="domain" type="display" :checked="data.domains"  ></BaseTree>
      </template>
    </BaseDialog>

<!--    标签-对话框  -->
    <BaseDialog ref="labelDialog" @confirm="saveLabels" width="500px"  title="标签">
      <template v-slot="{data}">
        <LabelSelection :ref="refs.selection" :labels="data.labels" ></LabelSelection>
      </template>
    </BaseDialog>

<!--    设定坐标-对话框  -->
    <BaseDialog ref="locationDialog"  @confirm="locationChange"  width="60%" title="坐标">
      <template v-slot="{data}">
        <BaseMap ref="map" :style-param="3" >
          <template v-slot="{map}">
            <BaseLocation :data="data" :map="map"></BaseLocation>
          </template>
        </BaseMap>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <BaseTable :ref="refs.table" :entity="entity" type="edit" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <!--    编辑文章-按钮  -->
       <div style="margin-bottom: 5px">
         <!--    设定类别-按钮  -->
         <el-tooltip class="item" effect="light" content="类别" placement="top">
           <el-button
             @click="$refs.domainDialog.open(data.row)"
             size="mini" type="primary"  circle plain><i class="fa fa-sitemap"></i></el-button>
         </el-tooltip>
         <!--    设定标签-按钮  -->
         <el-tooltip class="item" effect="light" content="标签" placement="top">
           <el-button
             @click="$refs.labelDialog.open(data.row)"
             size="mini" type="primary"  circle plain><i class="fa fa-tags"></i></el-button>
         </el-tooltip>
         <!--    设定坐标-按钮  -->
         <el-tooltip class="item" effect="light" content="地理坐标" placement="top">
           <el-button
             @click="$refs.locationDialog.open(data.row)"
             size="mini" type="primary"  circle plain><i class="fa fa-location-arrow"></i></el-button>
         </el-tooltip>
       </div>
        <el-tooltip class="item" effect="light" content="编辑文章" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-file"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="文章预览" placement="top">
          <el-button
            @click="$refs.viewDialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-desktop"></i></el-button>
        </el-tooltip>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import BaseEditor from '../../components/base/editor/BaseEditor'
import EditorView from '../../components/base/editor/EditorView'
// 用于location,domain,label的设定
import BaseTree from '~tree'
import LabelSelection from '../../components/base/LabelSelection'
import BaseLocation from '../../components/base/BaseLocation'
import BaseMap from '../../components/map/BaseMap'
import fileMix from './file_mix'
export default {
  mixins: [fileMix],
  components: {
    BaseTable,
    BaseDialog,
    BaseEditor,
    BaseTree,
    LabelSelection,
    BaseLocation,
    BaseMap,
    EditorView
  },
  data () {
    return {
      entity: 'article'
    }
  },
  mounted () {
  },
  methods: {
    insertArticle () {
      // $refs.dialog.open()
      const th = this
      this.$base.insert(this.entity, {})
        .then(res => {
          this.$refs.table.load(function () {
            th.$refs.dialog.open(res.data)
          })
        })
    },
    insertCancel (item) {
      const html = this.$refs.editor.getData()
      if ((!item.name || item.name.trim() === '') && html.trim() === '') {
        this.$base.remove(this.entity, item.id)
          .then(res => {
            this.$refs.table.load()
          })
      } else {
        this.confirm(item)
      }
    },
    confirm (data) {
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
