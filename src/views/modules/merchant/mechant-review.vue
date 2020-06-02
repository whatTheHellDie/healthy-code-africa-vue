<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '申请人' )" prop="account">
        <div>{{dataForm.realname}}</div>
      </el-form-item>
      <el-form-item :label="$t( '申请人电话' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.phone}}</div>
      </el-form-item>
      <el-form-item :label="$t( '负责人姓名' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.ownerName}}</div>
      </el-form-item>
      <el-form-item :label="$t( '负责人号码' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.ownerPhone}}</div>
      </el-form-item>
      <el-form-item :label="$t( '负责人证件号码' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.ownerIdCard}}</div>
      </el-form-item>
      <el-form-item :label="$t( '状态' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div><el-tag type="warning" v-if="dataForm.state==0">{{$t( '待审核' )}}</el-tag>
            <el-tag type="success" v-if="dataForm.state==1">{{$t( '通过' )}}</el-tag>
            <el-tag type="danger" v-if="dataForm.state==2">{{$t( '未通过' )}}</el-tag></div>
      </el-form-item>
      <el-form-item :label="$t( ' 详细地址' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.detailedAddr}}</div>
      </el-form-item>
      <el-form-item :label="$t( '申请时间' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.createTime}}</div>
      </el-form-item>
      <el-form-item :label="$t( '审核时间' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.modifyTime}}</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!see">
      <el-button type="primary" v-if="dataForm.state===0" @click="review(dataForm.uid,1)">{{$t( '审批通过' )}}</el-button>
      <el-button type="danger" v-if="dataForm.state===0" @click="review(dataForm.uid,2)">{{$t( '审批不通过' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        fullscreenLoading:false,
        see:false,
        visible: false,
        dataForm: {
          uid: "",
        },
      }
    },
    computed: {
      labelWidth() {
        switch(window.localStorage.language) {
          case 'zh-cn':
            return '200px';
          case 'en':
            return '242px'
        }
      }
    },
    methods: {
      review(uid,state){
        this.$http({
          url: this.$http.adornUrl('/business/publicPlace/review'),
           method: 'post',
          data: this.$http.adornData({
            'uid': uid,
            'state': state,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.init(uid)
            this.$emit('refreshDataList')
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
        })
      },
      init(uid) {
        this.dataForm.uid=uid||0;
        this.visible = true
        this.fullscreenLoading=true
          if(this.dataForm.uid) {
            this.$http({
              url: this.$http.adornUrl(`/business/publicPlace/info/${this.dataForm.uid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              this.fullscreenLoading=false
              if(data && data.code === 200) {
                this.dataForm = data.data
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
.el-form-item {
    margin-bottom: 0;
}
  .id-card {
    position: relative;
    .del{position: absolute;right: 5px;top: 5px;width: 24px;cursor: pointer;opacity: 0.8;}
    .add {
      width: 375px;
      background-image: url(/static/img/ic_add_icon@2x.png);
      background-repeat: no-repeat;
      background-color: #f0f0f0;
      background-position: center center;
    }
    .add-img {
      max-width: 375px;
    }
    input {
      appearance: none;
      position: absolute;
      width: 375px;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>