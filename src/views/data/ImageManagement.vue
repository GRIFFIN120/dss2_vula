<template>
  <div>
    <!--    上传按钮  -->
    <el-button @click="$refs.dialog.open({id:-1})" icon="fa fa-cloud-upload" type="success" size="small"> 新的全景影像</el-button>

    <!--    重新上传-对话框  -->
    <BaseDialog ref="dialog" title="上传图片" width="400px">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <BaseUpload :entity="entity" type="image" :data="data" @success="confirm"></BaseUpload>
      </template>
    </BaseDialog>

    <!--    全景查看-对话框  -->
    <BaseDialog ref="playDialog" width="60%" title="图片剪裁" :buttons="false">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        {{data}}
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
    <BaseTable ref="table" :entity="entity" type="edit" >
      <template #operation="data">
        <!--  2. 添加按钮  -->

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

        <!--    重新上传-按钮  -->
        <el-tooltip class="item" effect="light" content="重新上传" placement="top">
          <el-button
            @click="$refs.dialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-upload"></i></el-button>
        </el-tooltip>
        <!--    全景查看-按钮  -->
        <el-tooltip class="item" effect="light" content="图片剪裁" placement="top">
          <el-button
            @click="$refs.playDialog.open(data.row)"
            size="mini" type="success"  circle plain><i class="fa fa-cut"></i></el-button>
        </el-tooltip>

      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import BaseUpload from '../../components/base/BaseUpload'

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
    BaseUpload,
    BaseLocation,
    BaseMap,
    BaseTree,
    LabelSelection
  },
  data () {
    return {
      entity: 'image'
    }
  },
  mounted () {
  },
  methods: {
    confirm () {
      // 4. 表单提交后的操作
      this.$refs.dialog.close()
      this.$refs.table.load()
    }
  }
}
</script>

<style scoped>

</style>
