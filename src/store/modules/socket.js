
const state = {
  allowed: false,
  socket: null
}

const mutations = {
  SET_ALLOWED () {
    state.allowed = true
  },
  SET_SOCKET () {
    state.allowed = true
  }
}

const actions = {
  load (context) {
    if (typeof (WebSocket) === 'undefined') {
      this.$message.warning('您的浏览器不支持WebSocket')
    } else {
      context.commit('SET_ALLOWED')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
