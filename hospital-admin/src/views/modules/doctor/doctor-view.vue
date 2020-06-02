<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-row>
        <el-col :span="8"><el-form-item :label="$t( '医院名称' )" prop="account">
          <div>{{dataForm.shopName}}</div>
        </el-form-item></el-col>
        <el-col :span="8"><el-form-item :label="$t( '性别' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.sex}}</div>
        </el-form-item></el-col>
        <el-col :span="8"><el-form-item :label="$t( '学历' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.contacts}}</div>
        </el-form-item></el-col>
        
       <el-col :span="8"> <el-form-item :label="$t( '医生科室' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.oneAddrId}}</div>
        </el-form-item></el-col>
        <el-col :span="8"><el-form-item :label="$t( '职称' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.detailedAddr}}</div>
        </el-form-item></el-col>
        <el-col :span="8"> <el-form-item :label="$t( '岗位角色' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.role}}</div>
        </el-form-item></el-col>
        
        <el-col :span="24"> <el-form-item :label="$t( '医生头像' )" prop="name" :class="{ 'is-required': !dataForm.id }">
          <el-popover placement="left" trigger="hover">
              <img :src="dataForm.portrait" />
              <img :src="dataForm.portrait" slot="reference" class="photo-img"/>
            </el-popover>
           
        </el-form-item></el-col>

        <el-col :span="24"> <el-form-item :label="$t( '擅长内容' )" prop="account" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.account}}</div>
        </el-form-item></el-col>
        <el-col :span="24"> <el-form-item :label="$t( '备注' )" prop="remark" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.remark}}</div>
        </el-form-item></el-col>
        
      </el-row>
    </el-form>
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
          userId: "",
        },
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
    methods: {
      review(attestation){
        this.$http({
          url: this.$http.adornUrl('/business/users/review'),
           method: 'post',
          data: this.$http.adornData({
            'userId': this.dataForm.id,
            'attestation': attestation,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.init(this.dataForm.id)
            this.$emit('refreshDataList')
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
        })
      },
      init(userId) {
        this.dataForm.userId=userId||0;
        this.visible = true
        this.fullscreenLoading=true
          if(this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/business/users/info/${this.dataForm.userId}`),
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
  .photo-img{width: 120px;height: 120px;}
</style>