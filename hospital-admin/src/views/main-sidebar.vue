<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'sys-user'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item index="home"  @click="$router.push({ name: 'home' })">
        <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '首页' )}}</span>
      </el-menu-item>
      <el-submenu index="department">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '科室' )}}</span>
          </template>
          <el-menu-item index="department-category-list" @click="$router.push({ name: 'department-category-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '科室分类列表' )}}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="doctor">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '医生管理' )}}</span>
          </template>
          <el-menu-item index="doctor-list" @click="$router.push({ name: 'doctor-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '医生管理列表' )}}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="outpatient">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '门诊管理' )}}</span>
          </template>
          <el-menu-item index="outpatient-list" @click="$router.push({ name: 'outpatient-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '预约挂号列表' )}}</span>
          </el-menu-item>
          <el-menu-item index="diagnose-list" @click="$router.push({ name: 'diagnose-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '门诊诊断管理' )}}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="outpatient-fees">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '门诊收费管理' )}}</span>
          </template>
          <el-menu-item index="registered-fee-list" @click="$router.push({ name: 'registered-fee-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '预约挂号收费' )}}</span>
          </el-menu-item>
          <el-menu-item index="fee-list" @click="$router.push({ name: 'fee-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '门诊项目收费' )}}</span>
          </el-menu-item>
          <el-menu-item index="outpatient-project-fees" @click="$router.push({ name: 'outpatient-project-fees' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '门诊费用查询' )}}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="params">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '参数配置' )}}</span>
          </template>
          <el-menu-item index="registered-charges" @click="$router.push({ name: 'registered-charges' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '挂号收费标准' )}}</span>
          </el-menu-item>
          <el-menu-item index="params-dispose" @click="$router.push({ name: 'params-dispose' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '挂号参数配置' )}}</span>
          </el-menu-item>
          <el-menu-item index="type-dispose" @click="$router.push({ name: 'type-dispose' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '类型配置' )}}</span>
          </el-menu-item>
        </el-submenu>
        
        <!-- <el-submenu index="patient">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '患者信息' )}}</span>
          </template>
          <el-menu-item index="patient-list" @click="$router.push({ name: 'patient-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '患者预约管理' )}}</span>
          </el-menu-item>
          <el-menu-item index="case-list" @click="$router.push({ name: 'case-list' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '患者病例管理' )}}</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu> -->
        <!--<el-submenu index="sys">
          <template slot="title">
            <icon-svg name="system" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '系统管理' )}}</span>
          </template>
          <el-menu-item index="sys-user" @click="$router.push({ name: 'sys-user' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '管理员列表' )}}</span>
          </el-menu-item>
          <el-menu-item index="sys-role" @click="$router.push({ name: 'sys-role' })">
            <icon-svg name="role" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '角色管理' )}}</span>
          </el-menu-item>
          <el-menu-item index="sys-menu" @click="$router.push({ name: 'sys-menu' })">
            <icon-svg name="menu" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '菜单管理' )}}</span>
          </el-menu-item>
          <el-menu-item index="sys-log" @click="$router.push({ name: 'sys-log' })">
            <icon-svg name="log" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '系统日志' )}}</span>
          </el-menu-item>
        </el-submenu> -->
         <!--<el-submenu index="user">
          <template slot="title">
            <icon-svg name="userInfo" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '用户管理' )}}</span>
          </template>
          <el-menu-item index="user-info" @click="$router.push({ name: 'user-info' })">
            <icon-svg name="userInfo" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '用户信息管理' )}}</span>
          </el-menu-item>
        </el-submenu> -->
        <!--<el-submenu index="payment">
          <template slot="title">
            <icon-svg name="payment" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '支付管理' )}}</span>
          </template>
          <el-menu-item index="payment-bank-card-manage" @click="$router.push({ name: 'payment-bank-card-manage' })">
            <icon-svg name="bankcard" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '银行卡管理' )}}</span>
          </el-menu-item>
        </el-submenu> 
        <el-submenu index="transaction">
          <template slot="title">
            <icon-svg name="trade" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '交易管理' )}}</span>
          </template>
          <el-menu-item index="transaction-record" @click="$router.push({ name: 'transaction-record' })">
            <icon-svg name="tradeRecord" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '交易记录' )}}</span>
          </el-menu-item>
          <el-menu-item index="transaction-statistics" @click="$router.push({ name: 'transaction-statistics' })">
            <icon-svg name="tradeTotal" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '交易统计' )}}</span>
          </el-menu-item>
        </el-submenu> 
        <el-submenu index="message">
          <template slot="title">
            <icon-svg name="log" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '内容管理' )}}</span>
          </template>
          <el-menu-item index="messages-list" @click="$router.push({ name: 'messages-list' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '消息管理' )}}</span>
          </el-menu-item>
          <el-menu-item index="messages-feeback" @click="$router.push({ name: 'messages-feeback' })">
            <icon-svg name="pinglun" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '信息反馈' )}}</span>
          </el-menu-item>
        </el-submenu> 
        <el-submenu index="advertising">
          <template slot="title">
            <icon-svg name="adversing" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '广告管理' )}}</span>
          </template>
          <el-menu-item index="advertising-manage" @click="$router.push({ name: 'advertising-manage' })">
            <icon-svg name="adversing" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '广告管理' )}}</span>
          </el-menu-item>
        </el-submenu> 
         <el-submenu index="server">
          <template slot="title">
            <icon-svg name="sql" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '服务器管理' )}}</span>
          </template>
          <el-menu-item index="server-overview" @click="$router.push({ name: 'server-overview' })">
            <icon-svg name="zonghe" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '服务器概览' )}}</span>
          </el-menu-item>
          <el-menu-item index="server-list" @click="$router.push({ name: 'server-list' })">
            <icon-svg name="duanxin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '服务器列表' )}}</span>
          </el-menu-item>
        </el-submenu> 
        <el-submenu index="merchant">
          <template slot="title">
            <icon-svg name="zhedie" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{$t( '第三方应用' )}}</span>
          </template>
          <el-menu-item index="merchant-list" @click="$router.push({ name: 'merchant-list' })">
            <icon-svg name="zhedie" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">{{$t( '第三方应用管理' )}}</span>
          </el-menu-item>
        </el-submenu> -->
        <!--<el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">首页</span>
        </el-menu-item>-->
         <!--<el-submenu index="demo">
          <template slot="title">
            <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>
            <span>demo</span>
          </template>
          <el-menu-item index="demo-echarts" @click="$router.push({ name: 'demo-echarts' })">
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">echarts</span>
          </el-menu-item>
          <el-menu-item index="demo-ueditor" @click="$router.push({ name: 'demo-ueditor' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">ueditor</span>
          </el-menu-item>
        </el-submenu>-->
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
        dynamicMenuRoutes: []
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      var menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      menuList.forEach((item,i)=>{
        menuList[i].name=this.$t( item.name )
        if(menuList[i].list){
        menuList[i].list.forEach((itemx,j)=>{
          menuList[i].list[j].name=this.$t( itemx.name )
        })
        }
      })
      this.menuList = menuList
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error(this.$t( '未能找到可用标签页!' ))
              }
            }
            console.log(route)
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>
