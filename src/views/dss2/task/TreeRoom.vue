<template>
  <div>

    <BaseDrawer ref="chatDraw"   title="一对一决策室"  dir="ltr" width="20%">
      <template >
        <ChatRoom :task="bean"></ChatRoom>
      </template>
    </BaseDrawer>

    <BaseDrawer ref="hallDraw"   title="决策大厅"  dir="rtl" width="50%">
      <template >
        <P2G :task="bean"></P2G>
      </template>
    </BaseDrawer>

    <BaseDialog ref="chartDialog"   title="数据可视化" :buttons="false" width="700">
      <template v-slot="{data}">
        <Chart ref="chart" :data="data"></Chart>
      </template>
    </BaseDialog>

    <el-row>
      <el-col :span="11">
        <el-card>
          <BaseTree ref="tree" entity="task-tree" type="edit" :search="search"  :label="treeLabel"
                    :rootLabel="bean.name" :defaultExpandAll="true"
                    :checkDrop = "checkDrop"
                    :beforeEdit="beforeEdit"
                    :beforeInsert="beforeEdit"
          >
            <template #operation="{item}">
              <el-tooltip class="item" effect="light" content="决策大厅" placement="top">
                <el-button  circle size="small" type="success" @click="$refs.hallDraw.open(item)"  icon="fa fa-university"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="一对一决策" placement="top">
                <el-button  circle size="small" type="success" @click="$refs.chatDraw.open(item)"  icon="fa fa-users"></el-button>
              </el-tooltip>
            </template>
          </BaseTree>
        </el-card>
      </el-col>
      <el-col :span="12" :offset="1">
        <el-card>
          <BaseTable ref="table" entity="data" type="display" :url="url" operationColumnWidth="100px">
            <template #operation="{row}">
              <!--  2. 添加按钮  -->
              <el-tooltip class="item" effect="light" content="移动到树形菜单" placement="top">
                <el-button
                  @click="toTree(row)"
                  size="mini" type="primary"  circle plain><i class="fa fa-dot-circle-o"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="查看数据" placement="top">
                <el-button
                  @click="$refs.chartDialog.open(row)"
                  size="mini" type="success"  circle plain><i class="fa fa-line-chart"></i></el-button>
              </el-tooltip>
            </template>
          </BaseTable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseTree from '~tree'
import BaseTable from '~table'
import BaseDialog from '~dialog'
import Chart from '../dialog/Chart'
import BaseDrawer from '../../../components/base/BaseDrawer'
import ChatRoom from './ChatRoom'
import P2G from '../chat/P2G'
export default {
  props: ['bean'],
  components: {
    BaseTree, BaseTable, BaseDialog, Chart, BaseDrawer, ChatRoom, P2G

  },
  computed: {
  },
  data () {
    return {
      // bean: { id: 8, domain: 'set', name: 'test', description: '12313', date: '2020/11/12', timestamp: '2020/11/12 01:40:22', state: 'tree', scaleId: 33, uid: 12, user: { id: 12, name: '刘寅鹏', description: '无', date: '2020/11/07', timestamp: '2020/11/07 01:02:54', username: '78230696@qq.com', password: null, affiliation: ' 中国科学院科技战略咨询研究院', gender: 'male', phone: '13269211880', roles: [] }, viewId: 29, experts: [16, 15] },
      search: {
        page: 1,
        size: 0,
        exact: {
        },
        fuzzy: {}
      },
      data: [],
      dataColumn: {
        name: '指标名称'
      },
      list: [],
      url: ''
    }
  },
  beforeMount () {
    this.url = 'data-frame/getData/' + this.bean.viewId
    this.search.exact = {
      userId: this.$cookies.get('UID'),
      taskId: this.bean.id,
      domain: 'tree'
    }
    this.$base.http.get('data-frame/getData/' + this.bean.viewId)
      .then(res => {
        this.data = (res.data)
      })
  },
  methods: {
    toTree (row) {
      const item = this.$refs.tree.getSelectedItem()
      if (item.dataId) {
        this.$message.warning('无法在指标节点上添加添加节点')
      } else {
        const bean = {
          taskId: this.bean.id,
          dataId: row.id,
          pid: item.id,
          name: row.name,
          domain: 'tree'
        }
        if (bean.taskId && bean.dataId && bean.pid !== undefined && bean.name) {
          this.$base.insert('task-tree', bean)
            .then(res => {
              this.$refs.tree.load()
            })
        } else {
          console.log(bean)
          this.$message.warning('请选择一个节点')
        }
      }
    },
    checkDrop (draggingNode, dropNode, type) {
      console.log(type)
      const flag = !(dropNode.data.dataId !== undefined && type === 'inner')
      return flag
    },
    treeLabel (data) {
      let icon = 'fa fa-tasks'
      let color = '#aaaaaa'
      if (data.id !== 0) {
        icon = data.dataId ? 'fa fa-dot-circle-o' : 'fa fa-folder-o'
        color = data.dataId ? '#409EFF' : '#666666'
      }
      const str = '<i style="color:' + color + '" class="' + icon + '">&nbsp;</i> ' + '<span style="color:' + color + ';font-weight: bolder" >' + data.name + '</span>'
      return str
    },
    beforeEdit (item) {
      if (item.dataId) {
        this.$message.warning('无法编辑指标节点')
        return false
      }
      return true
    }

  }
}
</script>

<style scoped>

</style>
