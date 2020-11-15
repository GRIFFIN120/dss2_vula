import axios from 'axios'
import { Message, Loading } from 'element-ui'

let loading = null
const instance = axios.create({
  timeout: 5000
})

instance.interceptors.request.use(config => {
  loading = Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.15)'
  })

  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken()
  // }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  loading.close()
  const res = response.data
  if (res.code !== 200) {
    Message({
      message: res.message || 'Error',
      type: 'warning',
      duration: 2 * 1000
    })
    // return Promise.reject(new Error(res.message || 'Error'))
  } else {
    if (res.message) {
      Message({
        message: res.message,
        type: 'success',
        duration: 1 * 1000
      })
    }
  }
  return response.data
}, error => {
  loading.close()
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  console.log(error)
  return Promise.reject(error)
})

export default instance
