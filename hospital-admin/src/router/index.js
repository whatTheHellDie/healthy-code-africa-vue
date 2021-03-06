/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
//{ path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
{ path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
//{ path: '/overview', component: _import('common/overview'), name: 'overview', meta: { title: '首页' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'login' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/department-category-list', component: _import('modules/department/department-category-list'), name: 'department-category-list', meta: { title: '科室分类列表', isTab: true } },
    { path: '/doctor-list', component: _import('modules/doctor/doctor-list'), name: 'doctor-list', meta: { title: '医生管理列表', isTab: true } },
    { path: '/outpatient-list', component: _import('modules/outpatient/outpatient-list'), name: 'outpatient-list', meta: { title: '预约挂号列表', isTab: true } },
    { path: '/diagnose-list', component: _import('modules/outpatient/diagnose-list'), name: 'diagnose-list', meta: { title: '门诊诊断管理', isTab: true } },
    { path: '/registered-fee-list', component: _import('modules/outpatient-fees/registered-fee-list'), name: 'registered-fee-list', meta: { title: '预约挂号收费', isTab: true } },
    { path: '/fee-list', component: _import('modules/outpatient-fees/fee-list'), name: 'fee-list', meta: { title: '门诊项目收费', isTab: true } },
    { path: '/outpatient-project-fees', component: _import('modules/outpatient-fees/outpatient-project-fees'), name: 'outpatient-project-fees', meta: { title: '门诊费用查询', isTab: true } },
    { path: '/registered-charges', component: _import('modules/params/registered-charges'), name: 'registered-charges', meta: { title: '挂号收费标准', isTab: true } },
    { path: '/params-dispose', component: _import('modules/params/params-dispose'), name: 'params-dispose', meta: { title: '挂号参数配置', isTab: true } },
    { path: '/type-dispose', component: _import('modules/params/type-dispose'), name: 'type-dispose', meta: { title: '类型配置', isTab: true } },
    // { path: '/patient-list', component: _import('modules/patient/patient-list'), name: 'patient-list', meta: { title: '患者预约管理', isTab: true } },
    // { path: '/case-list', component: _import('modules/patient/case-list'), name: 'case-list', meta: { title: '患者病例管理', isTab: true } },
    
    


    
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 200) {
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
      }else if(data.code === 401){
        router.push({ name: 'login' })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: 'home' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

export default router
