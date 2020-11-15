
import { removeToken, setToken } from '../../api/utils/auth'
import base from '../../api/utils/base'

const state = {
  token: null,
  user: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, user) => {
    console.log(123)
    state.user = user
  }
}

const actions = {
  login (context, userInfo) {
    base.http.post('/user/login', userInfo)
      .then(res => {
        const user = res.data
        if (res.code === 200 && user) {
          const user = res.data
          context.commit('SET_TOKEN', user.token)
          context.commit('SET_USER_INFO', user)
          setToken(user.token)
        }
      })
  },
  logout (context, userInfo) {
    base.http.post('user/logout')
      .then(() => {
        removeToken()
        context.commit('SET_TOKEN', null)
        context.commit('SET_USER_INFO', null)
      })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
