<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'sys-user' })">
        <a class="site-navbar__brand-lg" href="javascript:;" style="font-size: 17px;">{{$t( 'Heathy-qr管理平台' )}}</a>
        <a class="site-navbar__brand-mini" href="javascript:;">{{$t( '后台' )}}</a>
      </h1>
    </div>
    <div class="site-navbar__body">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <!-- <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-badge value="hot">
            <a href="//www.renren.io/" target="_blank">官方社区</a>
          </el-badge>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">Git源码</template>
          <el-menu-item index="2-1"><a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">前端</a></el-menu-item>
          <el-menu-item index="2-2"><a href="//git.oschina.net/renrenio/renren-fast" target="_blank">后台</a></el-menu-item>
          <el-menu-item index="2-3"><a href="//git.oschina.net/renrenio/renren-generator" target="_blank">代码生成器</a></el-menu-item>
        </el-submenu> -->
        <img src="/static/img/message.png" class="context-message" @click="addOrUpdateHandle"/>
        <el-submenu index="2">
          <template slot="title">language</template>
          <el-menu-item index="2-3" @click="switchLanguage('fr')"><a>Français</a></el-menu-item>
          <el-menu-item index="2-2" @click="switchLanguage('en')"><a>English</a></el-menu-item>
          <el-menu-item index="2-1" @click="switchLanguage('zh-cn')"><a>中文</a></el-menu-item>
        </el-submenu>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">{{$t( '修改密码' )}}</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">{{$t( '退出' )}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 聊天弹窗 -->
    <add-or-update ref="addOrUpdate" ></add-or-update>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import AddOrUpdate from './modules/instruction/contactMerchant'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        showTip:false,
        addOrUpdateVisible: false,
      }
    },
    components: {
      AddOrUpdate,
      UpdatePassword
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    created(){
      window.addEventListener("resize", this.renderResize, false)
      this.renderResize()
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      switchLanguage(lang){
        this.$confirm(this.$t( '确定要切换语言吗，切换后您未保存的操作将会被清除' ), this.$t( '提示' ), {
          distinguishCancelAndClose: true,
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' )
        })
          .then(() => {
            this.$setLang(lang)
          })
          
        
        
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(this.$t( `确定进行[退出]操作?` ), this.$t( '提示' ), {
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 200) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
       renderResize() {
         
        var userAgent=/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 'phone':'pc';
        if(userAgent=='pc'){
            this.showTip=false
            return ;
          }
        // 判断横竖屏
        if (window.orientation == 90 || window.orientation == -90) {
            this.showTip=false
        }else{
          this.showTip=true
        }
        // 做页面适配
        // 注意：renderResize方法执行时虚拟dom尚未渲染挂载，如果要操作vue实例，最好在this.$nextTick()里进行。
    }

    }
  }
</script>

<style type="text/css">

</style>
