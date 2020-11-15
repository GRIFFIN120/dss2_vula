<template>
  <div>
    <el-button type="success" size="mini" plain @click="openOverview">边界总览</el-button>
    <BaseDialog ref="overviewDialog" @confirm="textareaConfirm" width="60%" title="边界总览" :buttons="false">
      <template v-slot="{data}">
        <BaseMap :StyleParam="15" :changeable="true">
          <template v-slot="{map}">
            <BasePolygon v-for="item in data" :key="item.id"  :map="map" :style-param="item.polygonStyleId" :bean="item" :show-label="true" ></BasePolygon>
          </template>
        </BaseMap>
      </template>
    </BaseDialog>

    <BaseDialog ref="pathDialog" @confirm="mapConfirm" width="60%" title="边界编辑">
      <template v-slot="{data}">
        <BaseMap :StyleParam="3">
          <template v-slot="{map}">
            <BasePolygon ref="polygon" :map="map" :style-param="data.polygonStyleId" :bean="data"  :show-label="false">
              <template v-slot="{polygon}">
                <PolygonEditor :map="map" :polygon="polygon" :data="data"></PolygonEditor>
              </template>
            </BasePolygon>
          </template>
        </BaseMap>
      </template>
    </BaseDialog>

    <BaseDialog ref="viewDialog"  width="60%" title="边界截图" :buttons="false" >
      <template v-slot="{data}">
        <BaseMap ref="viewMap" :StyleParam="6">
          <template v-slot="{map}">
            <BaseBoundary :map="map" :style-param="data.polygonStyleId" :paths="[data.path]" :fit-view="true" >
            </BaseBoundary>
          </template>
        </BaseMap>
        <el-row>
          <el-col :offset="22" :span="2">
            <el-button  style="margin-top: 20px; width: 100%" type="success" plain icon="fa fa-camera" @click="viewConfirm(data)"> 截图</el-button>
          </el-col>
        </el-row>
      </template>
    </BaseDialog>

    <BaseDialog ref="textareaDialog" @confirm="textareaConfirm" width="60%" title="边界数据">
      <template v-slot="{data}">
        <PathData ref="pathData" :bean="data"></PathData>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <BaseTable ref="table" :entity="entity" type="edit" >
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <el-tooltip class="item" effect="light" content="编辑边界" placement="top">
          <el-button
            @click="$refs.pathDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-flag-o"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="边界数据" placement="top">
          <el-button
            @click="$refs.textareaDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-file-code-o"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="边界截图" placement="top">
          <el-button
            @click="$refs.viewDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-camera-retro"></i></el-button>
        </el-tooltip>

      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import PolygonEditor from '../../../components/map/editor/PolygonEditor'
import BaseMap from '../../../components/map/BaseMap'
import BasePolygon from '../../../components/map/overlayer/BasePolygon'
import PathData from './dialog/PathData'
import BaseBoundary from '../../../components/map/overlayer/BaseBoundary'
export default {
  components: {
    BaseTable, BaseDialog, PolygonEditor, BaseMap, BasePolygon, PathData, BaseBoundary
  },
  data () {
    return {
      entity: 'border'
    }
  },
  mounted () {
  },
  methods: {

    openOverview () {
      this.$base.search('border', {
        page: 1, size: 0
      }).then(res => {
        this.$refs.overviewDialog.open(res.data.list)
      })
    },
    viewConfirm (data) {
      const th = this
      this.$refs.viewMap.takePicture(canvas => {
        const b64 = canvas.toDataURL('image/png')
        const blb = th.$utils.dataURLtoBlob(b64)

        // canvas.toBlob(function (blb) {
        th.$base.dfs.blob(th.entity, data.id, blb)
          .then(() => {
            th.$refs.viewDialog.close()
            th.$refs.table.load()
          })
      })
    },
    mapConfirm (data) {
      // 4. 表单提交后的操作
      const arr = this.$refs.polygon.getPath()
      const path = JSON.stringify(arr)
      this.$base.dfs.text(this.entity, { id: data.id, path })
        .then(() => {
          this.$refs.table.load()
        })
    },
    textareaConfirm () {
      const bean = this.$refs.pathData.getData()
      if (bean) {
        this.$base.dfs.text(this.entity, bean)
          .then(() => {
            this.$refs.table.load()
          })
      }
    }

  }
}
</script>

<style scoped>

</style>
