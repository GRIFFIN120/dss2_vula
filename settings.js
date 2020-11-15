module.exports = {
  // title: '国家公园综合管理系统',
  title: '页岩气开发群决策支持平台',
  // baseURL: 'http://120.27.61.185:8012',
  baseURL: 'http://localhost:8001',
  system_menu: {
    id: '-1',
    name: '系统管理',
    icon: 'fa fa-cog',
    pid: 0,
    children: [
      {
        id: -11,
        name: '菜单管理',
        pid: -1,
        icon: 'fa fa-navicon',
        path: '/menuManagement'
      },
      // {
      //   id: -12,
      //   name: '元数据管理',
      //   pid: -1,
      //   icon: 'fa fa-list-alt',
      //   children: [
      //     {
      //       id: -121,
      //       name: '全局元数据',
      //       pid: -12,
      //       icon: 'fa fa-paper-plane-o',
      //       path: '/uniMetaManagement'
      //     },
      //     {
      //       id: -122,
      //       name: '实体元数据',
      //       pid: -12,
      //       icon: 'fa fa-paper-plane',
      //       path: '/metaManagement'
      //     },
      //     {
      //       id: -123,
      //       name: '元数据常量',
      //       pid: -13,
      //       icon: 'fa fa-puzzle-piece',
      //       path: '/typesManagement'
      //     }
      //   ]
      // },
      {
        id: -13,
        name: '用户管理',
        pid: -1,
        icon: 'fa fa-users',
        children: [
          {
            id: -131,
            name: '用户角色',
            pid: -13,
            icon: 'fa fa-user',
            path: '/userInfoManagement'
          },
          {
            id: -132,
            name: '角色权限',
            pid: -13,
            icon: 'fa fa-key',
            path: '/userRoleManagement'
          }
        ]
      }
      // {
      //   id: -14,
      //   name: '地图样式管理',
      //   pid: -1,
      //   icon: 'fa fa-map-o',
      //   children: [
      //     {
      //       id: -141,
      //       name: '底图样式',
      //       pid: -14,
      //       icon: 'fa fa-delicious',
      //       path: '/mapStyle'
      //     },
      //     {
      //       id: -143,
      //       name: '多边形样式',
      //       pid: -14,
      //       icon: 'fa fa-clone',
      //       path: '/polygonStyle'
      //     },
      //     {
      //       id: -144,
      //       name: '折线样式',
      //       pid: -14,
      //       icon: 'fa fa-lastfm',
      //       path: '/polylineStyle'
      //     }, {
      //       id: -142,
      //       name: '标签样式',
      //       pid: -14,
      //       icon: 'fa fa-flag',
      //       path: '/markStyle'
      //     }
      //   ]
      // }

    ]

  }
}
