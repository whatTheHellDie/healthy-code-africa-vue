<template>
  <transition name="fade">
    <router-view></router-view>
    
  </transition>
</template>

<script>
  export default {
    mounted(){
      document.title=this.$t('Heathy-qr管理平台')
    }
  }
</script>
