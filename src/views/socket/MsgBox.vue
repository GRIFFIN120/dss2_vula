<template>
    <div>
      <el-button @click="send">test</el-button>

    </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
  props: ['to'],
  data () {
    return {
      stompClient: '',
      uid: null
    }
  },
  mounted () {
    this.uid = this.$cookies.get('UID')
    this.connection(this.uid)
  },
  beforeDestroy: function () {
    this.disconnect()
  },
  methods: {
    send () {
      this.stompClient.send('/app/points',
        {}, JSON.stringify({ fromId: this.uid, toId: this.to, content: 'test' }))
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
          th.$message.info(msg.content)
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
  }
}
</script>

<style scoped>

</style>
