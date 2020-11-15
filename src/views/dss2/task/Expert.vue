<template>
  <div>

    <BaseDialog ref="chatDialog"   :title="'您正在与「'+user.name+'」进行一对一决策'" :buttons="false" width="50%">
      <template >
        <P2P :user="user" :task="task"></P2P>
      </template>
    </BaseDialog>

    <BaseDialog ref="treeDialog"   :title="'「'+user.name+'」的决策结果'" :buttons="false" width="500px">
      <template >
        <ResultTree :task="task" :user="user" :state="task.state"></ResultTree>
      </template>
    </BaseDialog>

    <el-card :class="leader? 'leader' :''">
      <el-row>
        <el-col :span="10" >
          <span class="username">
            {{user.name}}
            <span style="font-size: 12px; font-weight: bold;color: dodgerblue" v-html="leader? '创建者' :''">s</span></span>
        </el-col>
        <el-col :span="14" align="right">
          <el-tooltip class="item" effect="light" content="查看决策结果" placement="top">
            <el-button
              @click="$refs.treeDialog.open()"
              size="mini" type="primary"  circle plain><i class="fa fa-bookmark"></i></el-button>
          </el-tooltip>
          <el-tooltip v-if="user.id!=$cookies.get('UID')" class="item" effect="light" content="打开对话框" placement="top">
            <el-button
              @click="$refs.chatDialog.open()"
              size="mini" type="primary"  circle plain><i class="fa fa-comment-o"></i></el-button>
          </el-tooltip>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import P2P from '../chat/P2P'
import BaseDialog from '../../../components/base/BaseDialog'
import ResultTree from '../chat/ResultTree'
export default {
  components: {
    BaseDialog, P2P, ResultTree
  },
  props: ['user', 'task', 'leader'],
  data () {
    return {}
  },
  mounted () {
  },
  methods: {

  }

}
</script>

<style scoped>
  .username{
    font-weight: bolder;
    font-size: 17px;
    color: #1f2d3d;
  }
  .leader{
    background-color: #e4d2d8;
  }
</style>
