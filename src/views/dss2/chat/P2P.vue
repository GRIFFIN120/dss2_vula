<template xmlns:el-col="http://www.w3.org/1999/html">
  <div>
    <el-row justify="space-between" class="bg" id="talk">
      <template v-for="(msg,index) in messages">
        <div :key="index">
          <el-col v-if="user.id==msg.fromId&&me===msg.toId" :span="24" align="left"  >
            <el-row style="min-height: 80px">
              <el-col :span="2" style="padding: 10px">
                <el-avatar style="background-color: #44617b">
                  {{user.name.substring(0,1)}}
                </el-avatar>
              </el-col>
              <el-col :span="20">
                <div style="font-weight: bold;text-indent: 10px;padding-bottom: 5px">{{msg.timestamp}}</div>
                <span class="msg">{{msg.content}}</span>
              </el-col>
            </el-row>

          </el-col>
          <el-col v-if="user.id==msg.toId&&me===msg.fromId" :span="24" align="right"  >

            <el-row style="min-height: 80px">
              <el-col :span="20">
                <div style="font-weight: bold;text-indent: 10px;padding-bottom: 5px">{{msg.timestamp}}</div>
                <span class="msg">{{msg.content}}</span>
              </el-col>
              <el-col :span="2" style="padding: 10px">
                <el-avatar style="background-color: #674196">
                  我
                </el-avatar>
              </el-col>
            </el-row>

          </el-col>
        </div>
      </template>
    </el-row>

    <el-row class="send">
      <el-col :span="19" >
        <el-input v-model="text" placeholder="请输入..."></el-input>
      </el-col>
      <el-col :span="4" :offset="1" >
        <el-button @click="send" type="success" style="width:100%" :disabled="text==''">发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  props: ['user', 'task'],
  data () {
    return {
      me: parseInt(this.$cookies.get('UID')),
      messages: [],
      text: '',
      stompClient: ''
    }
  },
  mounted () {
    const url = 'message/p2p/all'
    this.connection(this.me)
    const bean = {
      fromId: this.me,
      toId: this.user.id,
      taskId: this.task.id
    }
    this.$base.http.post(url, bean)
      .then(res => {
        console.log(res)
        this.messages = res.data
        this.toBottom()
      })
  },
  methods: {
    send () {
      const temp = this.text
      const msg = { fromId: this.me, toId: this.user.id, content: temp, taskId: this.task.id }

      this.$base.insert('message', msg)
        .then(res => {
          this.text = ''
          this.messages.push(res.data)
          this.stompClient.send('/app/points',
            {}, JSON.stringify(res.data))
          this.toBottom()
        })
    },
    connection (uid) {
      const socket = new SockJS('http://192.168.1.20:8001/endpointSang')
      this.stompClient = Stomp.over(socket)
      const headers = {
        name: uid
      }
      const th = this
      const url = '/user/' + uid + '/queue/points'
      this.stompClient.connect(headers, () => {
        this.stompClient.subscribe(url, function (data) { // 订阅消息
          const msg = JSON.parse(data.body)
          th.messages.push(msg)
          th.toBottom()
        }, headers)
      }, (err) => {
        this.$message.error('连接失败')
        console.log(err)
      })
    },
    // 断开连接
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    },
    toBottom () {
      this.$nextTick(() => {
        const container = this.$el.querySelector('#talk')
        container.scrollTop = container.scrollHeight
      })
    }
  },
  beforeDestroy: function () {
    this.disconnect()
  }

}
</script>

<style scoped>
  .bg{
    border: 1px solid #cccccc;
    padding: 20px;
    border-radius: 5px;
    height:500px;
    overflow-y: auto;
    background-color: #888;
    margin-bottom: 15px;
  }
  .send{
    padding: 10px;
    background-color: #ccc;
    border-radius: 5px
  }
  .msg{
    min-width: 100px;
    background-color: #93b881;
    color: white;
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 3px 3px 3px #ccc;
  }
  .toUser{
    font-size: 15px;
    margin-right: 10px;
  }
</style>
