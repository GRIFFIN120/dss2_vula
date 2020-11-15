<template>
  <div>
    <el-row justify="space-between" class="bg" id="talk">
      <template v-for="(msg,index) in messages">
        <div :key="index">
          <el-col v-if="me===msg.fromId" :span="24" align="right"  >
            <span class="msg">{{msg.content}}</span>
            <el-avatar  style="background-color: #674196">
              我
            </el-avatar>
          </el-col>
          <el-col v-else :span="24" align="left"  style="height: 50px" >
<!--            <el-avatar style="background-color: #44617b" shape="square">-->
            <span class="other">{{substr(msg.fromId)}}</span>
<!--            </el-avatar>-->
            <span class="msg">{{msg.content}}</span>
          </el-col>

        </div>
      </template>
    </el-row>

    <el-row class="send">
      <el-col :span="19" >
        <el-input v-model="text" placeholder="请输入..."></el-input>
      </el-col>
      <el-col :span="4" :offset="1" >
        <el-button @click="send" type="success" style="width:100%">发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  components: {},
  props: ['task'],
  data () {
    return {
      me: parseInt(this.$cookies.get('UID')),
      messages: [
      ],
      text: '',
      user: {}
    }
  },
  mounted () {
    this.loadUsers(this.getMessages)
  },
  methods: {
    getMessages () {
      const url = 'message/p2g/all'
      this.connection()
      const bean = {
        taskId: this.task.id
      }
      this.$base.http.post(url, bean)
        .then(res => {
          this.messages = res.data
          this.toBottom()
        })
    },
    loadUsers (callback) {
      let list = []
      list.push(this.task.user.id)
      list = list.concat(this.task.experts)
      const url = 'user/get/all/' + list
      this.$base.http.post(url)
        .then(res => {
          console.log(res)
          const object = {}
          res.data.filter(function (e) {
            object[e.id] = e
          })
          object[this.task.user.id] = this.task.user
          this.user = object
          callback()
        })
    },
    substr (id) {
      const u = this.user[id]
      if (u) {
        let string = u.name
        if (string.length > 3) {
          string = string.substring(0, 3) + ' ...'
        }
        return string
      } else {
        return '...'
      }
    },
    send () {
      const temp = this.text
      const msg = { fromId: this.me, content: temp, taskId: this.task.id, domain: 'group' }
      this.$base.insert('message', msg)
        .then(res => {
          this.text = ''
          // this.messages.push(res.data)
          this.stompClient.send('/app/points',
            {}, JSON.stringify(res.data))
          this.toBottom()
        })
    },
    toBottom () {
      this.$nextTick(() => {
        const container = this.$el.querySelector('#talk')
        container.scrollTop = container.scrollHeight
      })
    },
    connection (uid) {
      const socket = new SockJS('http://192.168.1.20:8001/endpointSang')
      this.stompClient = Stomp.over(socket)
      const headers = {
        name: uid
      }
      const th = this
      const url = '/user/' + this.task.id + '_' + '/queue/points'
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
    }
  },
  beforeDestroy () {
    this.disconnect()
  }

}
</script>

<style scoped>
  .bg{
    border: 1px solid #cccccc;
    padding: 20px;
    border-radius: 5px;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
    background-color: #dfdfdf;
    margin-bottom: 15px;
  }
  .send{
    padding: 10px;
    background-color: #dddddd;
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
  .other{
    font-size: 13px;
    font-weight: bold;
    width: 50px;
  }
</style>
