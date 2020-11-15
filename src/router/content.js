
module.exports = [
  {
    path: '/',
    name: '主页',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: '欢迎使用',
    // redirect: '/MyTask'
    component: () => import('../views/Welcome')
  },
  {
    path: '/menuManagement',
    name: '菜单管理',
    component: () => import('../components/base/system/MenuManagement')
  },
  {
    path: '/userInfoManagement',
    name: '用户列表',
    component: () => import('../components/base/system/UserInfoManagement')
  },
  {
    path: '/userRoleManagement',
    name: '角色管理',
    component: () => import('../components/base/system/UserRoleManagement')
  },
  {
    path: '/metaManagement',
    name: '实体元数据管理',
    component: () => import('../components/base/system/major/EntityMeta')
  },
  {
    path: '/uniMetaManagement',
    name: '全局元数据管理',
    component: () => import('../components/base/system/major/UniMeta')
  },
  {
    path: '/typesManagement',
    name: '类型常量管理',
    component: () => import('../components/base/system/major/SysTypes')
  },
  {
    path: '/mapStyle',
    name: '底图样式管理',
    component: () => import('../components/map/style/MapStyle')
  },
  {
    path: '/polygonStyle',
    name: '多边形样式管理',
    component: () => import('../components/map/style/PolygonStyle')
  },
  {
    path: '/polylineStyle',
    name: '折线样式管理',
    component: () => import('../components/map/style/PolylineStyle')
  },
  {
    path: '/markStyle',
    name: '标签样式管理',
    component: () => import('../components/map/style/MarkStyle')
  },
  // 数据管理
  {
    path: '/domainManagement',
    name: '信息类别管理',
    component: () => import('../views/category/DomainManagement')
  },
  {
    path: '/labelManagement',
    name: '信息标签管理',
    component: () => import('../views/category/LabelManagement')
  },
  {
    path: '/articleManagement',
    name: '文章管理',
    component: () => import('../views/data/ArticleManagement')
  },
  {
    path: '/imageManagement',
    name: '图片管理',
    component: () => import('../views/data/ImageManagement')
  },
  {
    path: '/videoManagement',
    name: '视频管理',
    component: () => import('../views/data/VideoManagement')
  },
  {
    path: '/panoramaManagement',
    name: '全景影像管理',
    component: () => import('../views/data/PanoramaManagement')
  },
  // 公园管理
  {
    path: '/parkManagement',
    name: '国家公园管理',
    component: () => import('../views/park/ParkManagement')
  },
  {
    path: '/parkBorder',
    name: '公园边界管理',
    component: () => import('../views/park/elements/ParkBorder')
  },
  {
    path: '/parkArea',
    name: '公园区域管理',
    component: () => import('../views/park/elements/ParkArea')
  },
  {
    path: '/parkRoad',
    name: '公园线路管理',
    component: () => import('../views/park/elements/ParkRoad')
  },
  {
    path: '/parkFacility',
    name: '公园设施管理',
    component: () => import('../views/park/elements/ParkFacility')
  },
  // 数据监测
  {
    path: '/capacityMonitor',
    name: '容量监测',
    component: () => import('../views/monitor/CapacityMonitor')
  },
  {
    path: '/environmentMonitor',
    name: '生态监测',
    component: () => import('../views/monitor/EnvironmentMonitor')
  },
  {
    path: '/positionMonitor',
    name: '偏航监测',
    component: () => import('../views/monitor/PositionMonitor')
  },
  // 综合管理
  {
    path: '/tripService',
    name: '行程审批',
    component: () => import('../views/service/TripService')
  },
  {
    path: '/storyService',
    name: '游记审核',
    component: () => import('../views/service/StoryService')
  },
  {
    path: '/imageService',
    name: '图片审核',
    component: () => import('../views/service/ImageService')
  },
  {
    path: '/BroadCast',
    name: '广播',
    component: () => import('../views/socket/BroadCast')
  },
  {
    path: '/PeerToPeer',
    name: '点对点通讯',
    component: () => import('../views/socket/PeerToPeer')
  },
  {
    path: '/IndexTable', /// //////
    name: '决策指标',
    component: () => import('../views/dss2/IndexTable')
  },
  {
    path: '/IndexView',
    name: '指标视图',
    component: () => import('../views/dss2/IndexView')
  },
  {
    path: '/MyTask',
    name: '我的任务',
    component: () => import('../views/dss2/MyTask')
  },
  {
    path: '/OthersTask',
    name: '参与任务',
    component: () => import('../views/dss2/OthersTask')
  },
  {
    path: '/TaskPublish',
    name: '任务发布',
    component: () => import('../views/dss2/TaskPublish')
  },
  {
    path: '/IndexScale',
    name: '指标尺度',
    component: () => import('../views/dss2/IndexScale')
  }
]
