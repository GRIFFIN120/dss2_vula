<template>
  <div>

    <BaseDialog ref="editorDialog"   title="视图可视化" width="700" @confirm="saveEditor">
      <template v-slot="{data}">
        <BaseEditor ref="editor" :entity="entity" :data="data"></BaseEditor>
      </template>
    </BaseDialog>

    <BaseDialog ref="chartDialog"   title="视图可视化" :buttons="false" width="700">
      <template v-slot="{data}">
        <Charts :data="data"></Charts>
      </template>
    </BaseDialog>

    <BaseDialog ref="insertDialog" @confirm="insert"  title="创建任务" width="400px">
      <template v-slot="{data}">
        <!--  3. 引入对话框中的模版  -->
        <Baseform :item="data" :entity="entity" type="control"></Baseform>
      </template>
    </BaseDialog>

    <BaseDialog ref="expertsDialog" @confirm="saveExperts"  title="专家组" width="650px">
      <template>
        <BaseTransfer ref="userTransfer"></BaseTransfer>
      </template>
    </BaseDialog>

    <BaseDialog ref="viewDialog" @confirm="saveView"  title="更改任务视图" width="650px">
      <template v-slot="{data}">
        <el-row>
          <el-col :span="17">
            <BaseSelect ref="viewSelect" title="任务视图" url="data-frame/simple" :default-value="data.viewId"></BaseSelect>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-button icon="fa fa-line-chart" @click="openChart(data.row)" plain type="success"> 查看视图</el-button>
          </el-col>
        </el-row>
      </template>
    </BaseDialog>

    <BaseDialog ref="treeRoom" :buttons="false"  title="指标体系决策" width="90%">
      <template v-slot="{data}">
        <TreeRoom :bean="data"></TreeRoom>
      </template>
    </BaseDialog>

    <BaseDialog ref="weightRoom" :buttons="false"  title="指标权重决策" width="90%">
      <template v-slot="{data}">
        <WeightRoom :bean="data"></WeightRoom>
      </template>
    </BaseDialog>

    <!--  1. 修改 entity 和 type  -->
    <el-button @click="$refs.insertDialog.open({})" type="success" size="small"  icon="fa fa-plus"> 创建任务</el-button>
    <BaseTable ref="table" :entity="entity" :type="type" :search="search" >
      <template #operation="data">

        <el-tooltip v-if="data.row.state=='over'"
                    class="item" effect="light" content="发布报告" placement="top">
          <el-button
            @click="submitReport(data.row)"
            size="mini" type="success" circle ><i class="fa fa-upload"></i></el-button>
        </el-tooltip>

        <el-tooltip v-if="data.row.state=='tree'||data.row.state=='weight'"
          class="item" effect="light" content="决策室" placement="top">
          <el-button
            @click="$refs[data.row.state+'Room'].open(data.row)"
            size="mini" type="success" circle ><i class="fa fa-university"></i></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" :content="status[data.row.state].title" placement="top">
          <el-button
            @click="operation(data.row)"
            size="mini" type="info"  circle plain><i :class="status[data.row.state].icon"></i></el-button>
        </el-tooltip>

        <!--  2. 添加按钮  -->
        <el-tooltip v-if="data.row.state=='prepare'"
          class="item" effect="light" content="编辑专家组" placement="top">
          <el-button
            @click="openExperts(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-users"></i></el-button>
        </el-tooltip>
        <el-tooltip  v-if="data.row.state=='prepare'"
          class="item" effect="light" content="选择任务视图" placement="top">
          <el-button
            @click="$refs.viewDialog.open(data.row)"
            size="mini" type="primary"  circle plain><i class="fa fa-chain"></i></el-button>
        </el-tooltip>

      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~table'
import BaseDialog from '~dialog'
import Baseform from '~form'
import BaseSelect from '../../components/base/BaseSelect'
import BaseTransfer from '../../components/base/BaseTransfer'
import taskmix from './task/taskmix'
import Charts from './dialog/Charts'
import TreeRoom from './task/TreeRoom'
import WeightRoom from './task/WeightRoom'
import BaseEditor from '../../components/base/editor/BaseEditor'

export default {
  mixins: [taskmix],
  components: {
    BaseTable, BaseDialog, Baseform, BaseTransfer, BaseSelect, TreeRoom, Charts, WeightRoom, BaseEditor
  },
  data () {
    return {
      entity: 'task',
      type: 'edit',
      search: {
        page: 1,
        size: 10,
        exact: {
        },
        fuzzy: {}
      },
      status: {
        prepare: {
          icon: 'fa fa-sitemap',
          title: '开始指标体系决策',
          operation: this.tree,
          forward: 'tree'

        },
        tree: {
          icon: 'fa fa-balance-scale',
          title: '开始权重决策',
          operation: this.weight,
          forward: 'weight'
        },
        weight: {
          icon: 'fa fa-stop',
          title: '结束任务',
          operation: this.finish,
          forward: 'over'
        },
        over: {
          icon: 'fa fa-pencil ',
          title: '编写决策报告',
          operation: this.publish
        },
        pending: {
          icon: 'fa fa-undo ',
          title: '撤回发布',
          operation: this.withdraw
        },
        published: {
          icon: 'fa fa-undo ',
          title: '撤回发布',
          operation: this.withdraw
        }
      }
    }
  },
  beforeMount () {
    this.search.exact.uid = this.$cookies.get('UID')
  },
  methods: {
    submitReport (data) {
      const bean = { id: data.id, state: 'pending' }
      this.$confirm('是否发布任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$base.update(this.entity, bean)
          .then(res => {
            this.$refs.table.load()
          })
      }).catch(() => {})
    },
    saveEditor (data) {
      const bean = this.$refs.editor.getData()
      this.$base.dfs.text(this.entity, bean)
        .then(res => {
          this.$refs.table.load()
        })
    },
    openChart (row) {
      const viewId = this.$refs.viewSelect.getValue()
      this.$base.get('data-frame', viewId)
        .then(res => {
          this.$refs.chartDialog.open(res.data)
        })
    },
    operation (row) {
      if (row.experts.length === 0) {
        this.$message.error('您还未组件专家组，请点击"编辑专家组"按钮')
        return
      }
      if (!row.viewId) {
        this.$message.error('您还未设置任务视图，请点击"选择任务视图"按钮')
        return
      }

      const title = this.status[row.state].title
      const state = this.status[row.state].forward
      if (state) {
        const msg = '任务"' + row.name + '"已经' + title
        this.$confirm('任务将' + title + '，请确认！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // const bean = { id: row.id, state }
          const url = 'task/changeState/' + row.id + '/' + state
          this.$base.http.get(url)
            .then((res) => {
              this.$message.success(msg)
              this.status[row.state].operation(row)
              this.$refs.table.load()
            })
        }).catch(() => {})
      } else {
        this.status[row.state].operation(row)
      }
    },

    insert (data) {
      // 4. 表单提交后的操作
      this.$base.insert(this.entity, data)
        .then(() => {
          this.$refs.table.load()
        })
    },
    openExperts (row) {
      this.$base.search('user', {})
        .then(res => {
          const list = res.data.list
          const data = list.filter(function (user) {
            return user.username !== 'admin' && user.name !== undefined && user.name.trim() !== '' && user.id !== row.user.id
          })
          const th = this
          this.$refs.expertsDialog.open(row, function () {
            th.$refs.userTransfer.init(data, row.experts, true)
          })
        })
    },
    saveExperts (data) {
      const value = this.$refs.userTransfer.getValue()
      const obj = { id: data.id, experts: value }
      this.$base.update(this.entity, obj)
        .then(res => {
          this.$refs.table.load()
        })
    },
    openData (row) {
      const th = this
      if (row.scaleId === undefined) {
        this.$message.warning('指标尺度信息未设定，请点击"编辑数据"按钮设定此项')
        return
      }

      this.$base.search('data', {
        exact: {
          domain: row.domain,
          scaleId: row.scaleId
        }
      }).then(res => {
        const list = res.data.list
        this.$refs.dataDialog.open(row, function () {
          th.$refs.dataTransfer.init(list, [], true)
        })
      })
    },
    saveView (row) {
      const viewId = this.$refs.viewSelect.getValue()
      const bean = { id: row.id, viewId }
      this.$base.update(this.entity, bean)
        .then(res => {
          this.$refs.table.load()
        })
    }
  }
}
</script>

<style scoped>

</style>
