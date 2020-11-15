<template>
  <div>
    <BaseSelect url="park/simple" title="国家公园" @select="changePark"></BaseSelect>
    <el-button type="success" size="small" plain @click="openOverview">路线总览</el-button>
    <BaseDialog ref="overviewDialog" @confirm="textareaConfirm" width="60%" title="路线总览" :buttons="false">
      <template >
        <BaseMap :StyleParam="1" :changeable="true">
          <template v-slot="{map}">
            <BaseBoundary :map="map" :style-param="6" :paths="borders" >
              <template v-slot="{border}">
                <BasePolyline v-for="item in areas" :key="item.id" :map="map" :style-param="item.polylineStyleId" :bean="item"  :show-label="false" :border="border" >
                </BasePolyline>
              </template>
            </BaseBoundary>
          </template>
        </BaseMap>
      </template>
    </BaseDialog>

    <BaseDialog ref="editorDialog" @confirm="mapConfirm" width="60%" title="编辑路线">
      <template v-slot="{data}">
        <BaseMap :StyleParam="1" :changeable="true">
          <template v-slot="{map}">
            <BaseBoundary :map="map" :style-param="6" :paths="borders" >
              <template v-slot="{border}">
                <BasePolyline ref="polygon" :map="map" :style-param="data.polylineStyleId" :bean="data"  :show-label="false" :border="border" >
                  <template v-slot="{polygon}">
                    <PolygonEditor :map="map" :polygon="polygon" :data="data"></PolygonEditor>
                    <BaseLocationSearch :map="map" @search="placeSearch"></BaseLocationSearch>
                  </template>
                </BasePolyline>
              </template>
            </BaseBoundary>
          </template>
        </BaseMap>
      </template>
    </BaseDialog>

    <BaseDialog ref="viewDialog"  width="60%" title="路线截图" :buttons="false" >
      <template v-slot="{data}" >
        <BaseMap ref="viewMap" :StyleParam="6" :changeable="true">
          <template v-slot="{map}">
            <BaseBoundary :map="map" :style-param="6" :paths="borders" >
              <template v-slot="{border}">
                <BasePolyline ref="polygon" :map="map" :style-param="data.polylineStyleId" :bean="data"  :show-label="false" :border="border" >
                </BasePolyline>
              </template>
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

    <BaseDialog ref="textareaDialog" @confirm="textareaConfirm" width="60%" title="路线数据">
      <template v-slot="{data}">
        <PathData ref="pathData" :bean="data"></PathData>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <BaseTable ref="table" :entity="entity" type="edit" :search="search">
      <template #operation="data">
        <!--  2. 添加按钮  -->
        <el-tooltip class="item" effect="light" content="编辑路线" placement="top">
          <el-button
            @click="openEditor(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-road"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="路线数据" placement="top">
          <el-button
            @click="$refs.textareaDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-file-code-o"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="路线截图" placement="top">
          <el-button
            @click="openView(data.row)"
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
import BasePolyline from '../../../components/map/overlayer/BasePolyline'
import PathData from './dialog/PathData'
import BaseBoundary from '../../../components/map/overlayer/BaseBoundary'
import BaseLocationSearch from '../../../components/map/overlayer/BaseLocationSearch'
import BaseSelect from '../../../components/base/BaseSelect'
export default {
  components: {
    BaseTable,
    BaseDialog,
    PolygonEditor,
    BaseMap,
    BasePolyline,
    BaseBoundary,
    PathData,
    BaseLocationSearch,
    BaseSelect
  },
  data () {
    return {
      entity: 'road',
      borders: [],
      borderStyleId: 1,
      borderLoaded: false,
      areas: [],
      search: { page: 1, size: 10, exact: {}, fuzzy: {} },
      parkId: null
    }
  },
  mounted () {
  },
  methods: {
    changePark (val) {
      this.parkId = val
      this.search.exact.parkId = val
      this.$refs.table.load()
    },
    placeSearch (map, position, address) {
      console.log(position, address)
      map.setZoomAndCenter(17, position)
      this.$message.info('已定位到：' + address)
    },
    openEditor (row) {
      this.$base.search('border', {
        exact: { parkId: row.parkId }
      }).then(res => {
        const arr = []
        res.data.list.filter(function (bean) {
          arr.push(bean.path)
        })
        this.borders = arr
        this.borderLoaded = true
        this.$refs.editorDialog.open(row)
      })
    },
    openView (row) {
      this.$base.search('border', {
        exact: { parkId: row.parkId }
      }).then(res => {
        const arr = []
        res.data.list.filter(function (bean) {
          arr.push(bean.path)
        })
        this.borders = arr
        this.borderLoaded = true
        this.$refs.viewDialog.open(row)
      })
    },
    openOverview () {
      this.$base.search('border', {
        page: 1, size: 0, exact: { parkId: this.parkId }
      }).then(res => {
        const arr = []
        res.data.list.filter(function (bean) {
          arr.push(bean.path)
        })
        this.borders = arr
        this.$base.search(this.entity, { page: 1, size: 0 })
          .then(res1 => {
            this.areas = res1.data.list
            this.$refs.overviewDialog.open(res.data.list)
          })
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
