<template>
  <div>

    <BaseDialog ref="chartDialog"   title="决策结果" :buttons="false" width="700">
      <template v-slot="{data}">
        <Chart ref="chart" :data="data" ></Chart>
      </template>
    </BaseDialog>

    <BaseDialog ref="resultDialg"   title="决策结果" :buttons="false" width="700">
      <template v-slot="{data}">
        <ResultChart :userId="data.userId" :nodeId="data.nodeId" :data="bean"></ResultChart>
      </template>
    </BaseDialog>

    <BaseDialog ref="weightDialog"   title="数据可视化" @confirm="updateWeight" width="400px" :sync="true">
      <template v-slot="{data}">
        <WeightBox ref="weight" :node="data"></WeightBox>
      </template>
    </BaseDialog>

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

    <el-row>
      <el-col :span="24">
        <el-card>
          <BaseTree ref="tree" entity="task-tree" type="display" :search="search"  :label="treeLabel" :checkable="false"
                    :rootLabel="bean.name" :defaultExpandAll="true"
          >
            <template #operation="{item}">

              <el-tooltip class="item" effect="light" content="决策大厅" placement="top">
                <el-button  circle size="small" type="success" @click="$refs.hallDraw.open(item)"  icon="fa fa-university"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="一对一决策" placement="top">
                <el-button  circle size="small" type="success" @click="$refs.chatDraw.open(item)"  icon="fa fa-users"></el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="light" content="设定权重" placement="top">
                <el-button  circle size="small" type="success" @click="openWeightBox(item)" icon="fa fa-balance-scale"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="查看数据" placement="top">
                <el-button  circle size="small" type="info" @click="openChart(item)" icon="fa fa-line-chart"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="查看加权结果" placement="top">
                <el-button  circle size="small" type="warning" @click="getResult(item)" icon="fa fa-area-chart"></el-button>
              </el-tooltip>

            </template>
          </BaseTree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseTree from '~tree'
import BaseDialog from '~dialog'
import Chart from '../dialog/Chart'
import WeightBox from '../task/WeightBox'
import ResultChart from '../task/ResultChart'
import BaseDrawer from '../../../components/base/BaseDrawer'
import ChatRoom from './ChatRoom'
import P2G from '../chat/P2G'
export default {
  props: ['bean'],
  components: {
    BaseTree, BaseDialog, Chart, WeightBox, ResultChart, BaseDrawer, ChatRoom, P2G
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
      domain: 'weight'
    }
    console.log(this.search)
    this.$base.http.get('data-frame/getData/' + this.bean.viewId)
      .then(res => {
        this.data = (res.data)
      })
  },
  methods: {
    openChart (item) {
      if (item.dataId) {
        this.$base.get('data', item.dataId)
          .then(res => {
            this.$refs.chartDialog.open(res.data)
          })
      }
      //
    },
    check (node) {
      const children = node.children
      if (children !== undefined && children.length !== 0) {
        let sum = 0
        for (const i in children) {
          const child = children[i]
          const weight = child.weight
          if (weight !== undefined) {
            sum += weight
            const flag = this.check(child)
            if (!flag) return false
          } else {
            return false
          }
        }
        if (sum !== 100) return false
      }
      return true
    },

    getResult (item) {
      let nodeId = item.id
      if (!nodeId) {
        nodeId = 0
        item = this.$refs.tree.getRoot()
      }
      const flag = this.check(item)
      if (flag) {
        const userId = this.$cookies.get('UID')
        const data = {
          userId,
          nodeId
        }
        // const url = 'task-tree/getResult/' + this.bean.id + '/' + uid + '/' + nodeId
        // this.$base.http.get(url)
        //   .then(res => {
        this.$refs.resultDialg.open(data)
        // })
      } else {
        this.$message.warning('节点下"' + item.name + '"还有未分配的权重！')
      }
    },
    openWeightBox (item) {
      if (item.id === undefined || item.children === undefined || item.children.length === 0) {
        this.$message.warning('请选择一个分类节点，不能是根结点')
      } else if (item.children.length === 1) {
        const bean = { id: item.children[0].id, weight: 100 }
        this.$base.update('task-tree', bean)
          .then(res => {
            this.$message.success('当前分类节点下只有一个子节点，已为您自动设置子节点权重')
            this.$refs.tree.load()
          })
      } else {
        this.$refs.weightDialog.open(item)
      }
    },

    updateWeight (item, callback) {
      const arr = this.$refs.weight.getList()
      if (arr != null) {
        this.$base.http.post('task-tree/update/all', arr)
          .then(res => {
            // eslint-disable-next-line standard/no-callback-literal
            callback(true)
            this.$refs.tree.load()
          })
      } else {
        this.$message.warning('还有剩余权重，或权重已溢出！')
      }

      // eslint-disable-next-line standard/no-callback-literal
      // callback(true)
      // const bean = { id: item.id, weight: item.weight }
      // this.$base.update('task-tree', bean)
      //   .then(res => {
      //     this.$refs.tree.load()
      //
      //   })
    },
    treeLabel (data) {
      let icon = 'fa fa-tasks'
      let color = '#aaaaaa'
      let weight = ''
      if (data.id !== 0) {
        icon = data.dataId ? 'fa fa-dot-circle-o' : 'fa fa-folder-o'
        color = data.dataId ? '#409EFF' : '#666666'
        weight = data.weight !== undefined ? data.weight + '%' : '-'
        const weightColor = data.weight !== undefined ? '#67C23A' : '#cccccc'
        weight = '<div style="color: ' + weightColor + ';font-size: 12px; font-weight: bold;width: 30px;display: inline-block; padding-right:3px; text-align: center">' + weight + '</div>'
      }

      let str = weight + '<i style="color:' + color + '" class="' + icon + '">&nbsp;</i> ' + '<span style="color:' + color + ';font-weight: bolder" >' + data.name + '</span>'
      if (data.description) {
        str += '<span style="color: #999999;font-size: 12px"> (' + data.description + ')</span>'
      }

      return str
    }

  }
}
</script>

<style scoped>

</style>
