<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible" >
    <div id="printMe" type="primary">
      <span  style="display: inline-block;">
        <img :src="dataForm.qrCode"  style="display: block;margin: 0 auto;"width="232px"/>
        <div style="font-size: 30px;text-align: center;">{{dataForm.realname}}</div>
        </span>
    </div>
<el-button v-print="printObj">{{$t( '打印' )}}</el-button>
  </el-dialog>
</template>

<script>
  import print from 'vue-print-nb'
  export default {
    data() {
      return {
        fullscreenLoading:false,
        see:false,
        visible: false,
        dataForm: {
          userId: "",
          qrCode:"",
          realname:""
        },
        printObj: {
              id: "printMe",
              popTitle: '',
            }
      }
    },
    computed: {
      labelWidth() {
        switch(window.localStorage.language) {
          case 'zh-cn':
            return '100px';
          case 'en':
            return '142px'
        }
      }
    },
     directives: {
    print   
},
    methods: {
      init(userId) {
        this.dataForm.userId=userId||0;
        this.visible = true
        this.fullscreenLoading=true
          if(this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/business/users/getQrCode/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              this.fullscreenLoading=false
              if(data && data.code === 200) {
                this.dataForm.qrCode = data.data.qrCode
                this.dataForm.realname = data.data.realname
              }else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
            })
          }
      },
    }
  }
</script>

<style scoped="scoped" lang="scss">
</style>