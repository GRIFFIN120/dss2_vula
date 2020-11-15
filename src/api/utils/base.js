import request from './request'
import axios from 'axios'
// import en from 'element-ui/src/locale/lang/en'

const BaseURL = '/api/'
const DfsURL = '/dfs/'

const dfs = {
  text: (entity, bean) => {
    const url = BaseURL + entity + '/set/text'
    return request({
      url,
      method: 'post',
      data: bean
      // headers: {
      //   'Content-Type': 'text/html'
      // }
    })
  },
  blob: (entity, id, bl) => {
    const url = BaseURL + entity + '/blob/' + id

    const param = new FormData() // 创建form对象
    param.append('file', bl)

    return request({
      url,
      method: 'post',
      data: param,
      headers: { // 设置请求头
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  get: (bean, field) => {
    const url = field ? bean[field] : bean.url
    return axios.get(DfsURL + url)
  },
  action: (entity, type, id) => {
    return BaseURL + entity + '/set/' + type + '/' + id
  }
}

const http = {
  get0: function (url, params) {
    return request({
      url,
      method: 'get',
      params
    })
  },
  get: function (url, params) {
    url = BaseURL + url
    const req = request({
      url,
      method: 'get',
      params
    })
    return req
  },
  post: function (url, data, params) {
    url = BaseURL + url
    if (!data) { data = {} }
    return request({
      url,
      method: 'post',
      data,
      params
    })
  },
  all: function (arr) {
    return axios.all(arr)
  }
}

const search = function (entity, searchBean) {
  const url = BaseURL + entity + '/search'
  return request({
    url,
    method: 'post',
    data: searchBean
  })
}

const tree = function (entity, searchBean) {
  if (searchBean === undefined)searchBean = {}
  const url = BaseURL + entity + '/search/tree'
  return request({
    url,
    method: 'post',
    data: searchBean
  })
}

const types = function (domain) {
  const url = BaseURL + 'types/search'
  return request({
    url,
    method: 'post',
    data: { exact: { domain: domain } }
  })
}

const insert = function (entity, bean) {
  const url = BaseURL + entity + '/insert'
  return request({
    url,
    method: 'post',
    data: bean
  })
}

const get = function (entity, id) {
  const url = BaseURL + entity + '/get/' + id
  return request({
    url,
    method: 'get'
  })
}

const update = function (entity, bean) {
  const url = BaseURL + entity + '/update'
  return request({
    url,
    method: 'post',
    data: bean
  })
}

const remove = function (entity, id) {
  const url = BaseURL + entity + '/delete/' + id
  return request({
    url,
    method: 'get'
  })
}

const removeAll = function (entity, ids) {
  const url = BaseURL + entity + '/deleteAll/' + ids
  return request({
    url,
    method: 'get'
  })
}

const place = function (entity, draggingId, dropId, direction) {
  const url = BaseURL + [entity, 'place', draggingId, dropId, direction].join('/')
  return request({
    url,
    method: 'get'
  })
}

const order = function (entity, id, direction, exact) {
  const url = BaseURL + entity + '/order/' + id + '/' + direction
  const data = exact || {}
  return request({
    url,
    method: 'post',
    data
  })
}

const meta = function (entity, type) {
  return search('meta', {
    exact: {
      entity, type
    }
  })
}

const operation = function (entity, type) {
  return search('meta/operation', {
    exact: {
      entity, type
    }
  })
}

const base = {
  search,
  tree,
  insert,
  get,
  update,
  remove,
  removeAll,
  place,
  order,
  http,
  types,
  meta,
  operation,
  dfs,
  BaseURL
}

export default base
