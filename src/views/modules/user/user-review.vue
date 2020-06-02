<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-row>
        <el-col :span="12"><el-form-item :label="$t( '姓名' )" prop="account">
          <div>{{dataForm.realname}}</div>
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item :label="$t( '性别' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.gender===0">{{$t( '男' )}}</div>
           <div v-if="dataForm.gender===1">{{$t( '女' )}}</div>
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item :label="$t( '证件类型' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.idType===0">{{$t( '身份证' )}}</div>
           <div v-if="dataForm.idType===1">{{$t( '护照' )}}</div>
        </el-form-item></el-col>
        
       <el-col :span="12"> <el-form-item :label="$t( '证件号码' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.idCard}}</div>
        </el-form-item></el-col>
        <el-col :span="12"> <el-form-item :label="$t( '身份证正面' )" prop="name" :class="{ 'is-required': !dataForm.id }">
          <el-popover placement="left" trigger="hover">
              <img :src="dataForm.frontCertificate" />
              <img :src="dataForm.frontCertificate" slot="reference" class="photo-img"/>
            </el-popover>
           
        </el-form-item></el-col>
        <el-col :span="12"> <el-form-item :label="$t( '身份证反面' )" prop="name" :class="{ 'is-required': !dataForm.id }">
          <el-popover placement="left" trigger="hover">
              <img :src="dataForm.versoCertificate" />
              <img :src="dataForm.versoCertificate" slot="reference" class="photo-img"/>
            </el-popover>
           
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item :label="$t( '国籍' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.nationality}}</div>
        </el-form-item></el-col>
        <el-col :span="12"> <el-form-item :label="$t( '手机号码' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.phone}}</div>
        </el-form-item></el-col>
        <el-col :span="24"> <el-form-item :label="$t( '家庭住址' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.homeAddress}}</div>
        </el-form-item></el-col>
        <el-col :span="24"> <el-form-item :label="$t( '公司名称' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div>{{dataForm.corporate}}</div>
        </el-form-item></el-col>
        <el-col :span="24"> <el-form-item :label="$t( '照片' )" prop="name" :class="{ 'is-required': !dataForm.id }">
          <el-popover placement="left" trigger="hover">
              <img :src="dataForm.portrait" />
              <img :src="dataForm.portrait" slot="reference" class="photo-img"/>
            </el-popover>
           
        </el-form-item></el-col>
        
        <el-col :span="12"><el-form-item :label="$t( '健康状态' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.state===0">{{$t( '健康' )}}</div>
           <div v-if="dataForm.state===1">{{$t( '疑似' )}}</div>
           <div v-if="dataForm.state===2">{{$t( '确诊' )}}</div>
           <div v-if="dataForm.state===3">{{$t( '重症' )}}</div>
           <div v-if="dataForm.state===4">{{$t( '治愈' )}}</div>
           <div v-if="dataForm.state===5">{{$t( '死亡' )}}</div>
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item :label="$t( '审批' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.attestation===0">{{$t( '未填写' )}}</div>
           <div v-if="dataForm.attestation===1">{{$t( '审核中' )}}</div>
           <div v-if="dataForm.attestation===2">{{$t( '审核通过' )}}</div>
           <div v-if="dataForm.attestation===3">{{$t( '审核不通过' )}}</div>
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item :label="$t( '冻结' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.frozen===0">{{$t( '否' )}}</div>
           <div v-if="dataForm.frozen===1">{{$t( '是' )}}</div>
        </el-form-item></el-col>
        <el-col :span="24"><el-form-item :label="$t( '健康问卷' )" prop="name" :class="{ 'is-required': !dataForm.id }" v-if="dataForm.questionnaire">
           <div>1.{{$t( '是否去过疫区？' )}} <span class="span" v-if="dataForm.questionnaire.epidemicArea===1">{{$t( '是的' )}}</span><span class="span" v-if="dataForm.questionnaire.epidemicArea===0">{{$t( '否定' )}}</span></div>
           <div>2.{{$t( '是否常驻本地？' )}} <span class="span" v-if="dataForm.questionnaire.resident===1">{{$t( '是的，已经在本地居住3月以上' )}}</span><span class="span" v-if="dataForm.questionnaire.resident===0">{{$t( '外地返回不过14日' )}}</span></div>
           <div>3.{{$t( '近期接触史' )}} <span class="span" v-if="dataForm.questionnaire.contact===1">{{$t( '14日内密切接触近期有境外疫区者' )}}</span><span class="span" v-if="dataForm.questionnaire.contact===0">{{$t( '14日内没有密切接触近期有境外疫区者' )}}</span></div>
           <div>4.{{$t( '个人健康状态' )}} <span class="span" v-if="dataForm.questionnaire.healthStatus===0">{{$t( '正常活动，自觉正常无不适症状' )}}</span><span class="span" v-if="dataForm.questionnaire.healthStatus===1">{{$t( '居家健康服务，本地有固定住处，在家自我健康观察' )}}</span><span class="span" v-if="dataForm.questionnaire.healthStatus===2">{{$t( '集中健康服务，本地无固定住处，在家自我健康观察，如住节点登实施集中观察' )}}</span><span class="span" v-if="dataForm.questionnaire.healthStatus===3">{{$t( '集中医学观察，在医疗机构医学观察' )}}</span></div>
           <div>5.{{$t( '您是否有以下症状？' )}} <span class="span" v-if="dataForm.questionnaire.symptom===0">{{$t( '发烧' )}}</span><span class="span" v-if="dataForm.questionnaire.symptom===1">{{$t( '乏力' )}}</span><span class="span" v-if="dataForm.questionnaire.symptom===2">{{$t( '干咳' )}}</span><span class="span" v-if="dataForm.questionnaire.symptom===3">{{$t( '无' )}}</span></div>
        </el-form-item></el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" >
      <el-button type="primary" v-if="dataForm.attestation===1" @click="review(2)">{{$t( '审批通过' )}}</el-button>
      <el-button type="danger" v-if="dataForm.attestation===1" @click="review(3)">{{$t( '审批不通过' )}}</el-button>
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
        this.fullscreenLoading = true
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
          this.fullscreenLoading = false
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