import base from '../../api/utils/base'
import settings from '../../../settings'
const state = {
  collapse: false,
  menu: [],
  activedPath: null,
  activedLocation: [],
  metaEntity: 'menu',
  metaType: 'edit'

}

const mutations = {
  COLLAPSE: (state) => {
    state.collapse = !state.collapse
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SELECTED_MENU: (state, { key, keyPath }) => {
    state.activedPath = key
    const array = []
    let list = state.menu
    for (const i in keyPath) {
      const flag = parseInt(i) === (keyPath.length - 1)
      const index = flag ? keyPath[i] : parseInt(keyPath[i])
      const filterKey = flag ? 'path' : 'id'
      const res = list.filter(function (item) {
        const val = flag ? item[filterKey] : item[filterKey]
        if (val + '' === index + '') {
          return true
        }
      })
      if (res.length === 1) {
        const m = res[0]
        array.push({
          name: m.name,
          index: m[filterKey]
        })
        list = m.children
      } else {
        break
      }
    }
    state.activedLocation = array
  }
}

const actions = {
  getMenu (context, user) {
    if (user === undefined) {
      const search = { exact: { domain: 'dss2' } }
      return base.tree('menu', search)
        .then(res => {
          const arr = res.data
          arr.splice(0, 0, settings.system_menu)
          context.commit('SET_MENU', arr)
        })
    }

    if (user.roles.length !== 0) {
      base.http.get('menu/roleMenu/' + user.roles)
        .then(res => {
          const arr = res.data

          if (user.roles.indexOf(1) !== -1) {
            arr.splice(0, 0, settings.system_menu)
          }

          context.commit('SET_MENU', arr)
        })
    } else {
      console.log('无任何权限')
    }

    //
    // return base.tree('menu', search)
    //   .then(res => {
    //     const arr = res.data
    //     arr.splice(0, 0, settings.system_menu)
    //     context.commit('SET_MENU', arr)
    //   })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
