<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '门店名称' )" prop="storeName">
        <el-input v-model="dataForm.storeName" :placeholder="$t( '门店名称' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '门店区域' )" prop="oneAddrId">

        <el-row :gutter="5">
          <el-col :span="7">
            <el-select v-model="dataForm.oneAddrId" :placeholder="$t( '请选择' )" @change="setCity(true)">
              <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <el-select v-model="dataForm.twoAddrId" :placeholder="$t( '请选择' )" @change="setArea(true)">
              <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <el-select v-model="dataForm.threeAddrId" :placeholder="$t( '请选择' )" @change="setLast(true)">
              <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
       <el-form-item :label="$t( '详细地址' )" prop="detailedAddr">
        <el-input v-model="dataForm.detailedAddr" :placeholder="$t( '详细地址' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '登录账号' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '登录账号' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '密码' )" v-if="!dataForm.id" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t( '密码' )"></el-input>
      </el-form-item>
      <!--<el-form-item :label="$t( '确认密码' )" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t( '确认密码' )"></el-input>
      </el-form-item>-->
      <el-form-item :label="$t( '联系人' )" prop="contacts">
        <el-input v-model="dataForm.contacts" :placeholder="$t( '联系人' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '手机' )" prop="phone">
        <el-input v-model="dataForm.phone" :placeholder="$t( '手机' )"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data() {
      var validatePassword = (rule, value, callback) => {
        if(!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error(this.$t('不能为空')))
        } else {
          callback()
        }
      }
//    var validateComfirmPassword = (rule, value, callback) => {
//      if(!this.dataForm.id && !/\S/.test(value)) {
//        callback(new Error(this.$t('不能为空')))
//      } else if(this.dataForm.password !== value) {
//        callback(new Error(this.$t('确认密码与密码输入不一致')))
//      } else {
//        callback()
//      }
//    }
      return {
        province: [],
        city: [],
        area: [],
        
        oneAddrOptions: [],
        visible: false,
        roleList: [],
        dataForm: {
          storeName:"",
          id: 0,
          account: '',
          password: '',
//        comfirmPassword: '',
          oneAddrId: "",
          twoAddrId: "",
          threeAddrId: "",
          detailedAddr:"",
          contacts:"",
          phone:"",
          oneAddrName:"",
        twoAddrName:"",
        threeAddrName:"",
        },
        dataRule: {
          storeName: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          detailedAddr: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          contacts: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          password: [{
            validator: validatePassword,
            trigger: 'blur'
          }],
//        comfirmPassword: [{
//          validator: validateComfirmPassword,
//          trigger: 'blur'
//        }],
          oneAddrId: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
        }
      }
    },
    watch:{
      dataForm:{
        deep: true,
        handler(val){
        if(val.oneAddrId===0){
          this.dataForm.oneAddrId=""
        }
        if(val.twoAddrId===0){
          this.dataForm.twoAddrId=""
        }
        if(val.threeAddrId===0){
          this.dataForm.threeAddrId=""
        }
      }
      }
    },
    computed: {
      labelWidth() {
        switch(window.localStorage.language) {
          case 'zh-cn':
            return '80px';
          case 'en':
            return '142px'
        }
      }
    },
    methods: {
      setLast() {
        var data = this.area
        data.forEach((item, i) => {
          if(data[i].value == this.dataForm.threeAddrId) {
            this.dataForm.threeAddrName=data[i].label
            
          }
        })
      },
      setArea(manual) {
        var data = this.city
        if(manual){
          //如果是手动
          this.area = []
          this.dataForm.threeAddrId=""
          this.dataForm.threeAddrName=""
        }
        
        data.forEach((item, i) => {
          if(data[i].value == this.dataForm.twoAddrId) {
            this.area = data[i].children
            this.dataForm.twoAddrName=data[i].label
          }
        })
      },
      setCity(manual) {
        var data = this.province
        if(manual){
          //如果是手动
          this.city=[]
          this.dataForm.twoAddrId=""
          this.dataForm.twoAddrName=""
          this.area = []
          this.dataForm.threeAddrId=""
          this.dataForm.threeAddrName=""
        }
        
        data.forEach((item, i) => {
          if(data[i].value == this.dataForm.oneAddrId) {
            this.city = data[i].children
            this.dataForm.oneAddrName=data[i].label
          }
        })
      },
      init(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.oneAddrId=""
          this.dataForm.twoAddrId=""
          this.dataForm.threeAddrId=""
          this.dataForm.oneAddrName=""
          this.dataForm.twoAddrName=""
          this.dataForm.threeAddrName=""
          this.city=[]
          this.area = []
        })
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/business/address/selectAddress'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data = data.data
            
            data.forEach((item, i) => {
              data[i].value = item.id
              data[i].label = item.name
              data[i].children.forEach((itemx, j) => {
                if(itemx.id && itemx.name) {
                  data[i].children[j].value = itemx.id
                  data[i].children[j].label = itemx.name
                  data[i].children[j].children.forEach((itemy, k) => {
                    if(itemy.id && itemy.name) {
                      data[i].children[j].children[k].value = itemy.id
                      data[i].children[j].children[k].label = itemy.name
                    }
                  })
                }
              })
            })
            console.log(data)
            this.province = data
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/business/materialStore/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.account = data.account
              this.dataForm.storeName = data.storeName
              this.dataForm.contacts = data.contacts
              this.dataForm.phone = data.phone
              this.dataForm.oneAddrId = data.oneAddrId
              this.setCity()
              this.dataForm.twoAddrId = data.twoAddrId
              this.setArea()
              this.dataForm.threeAddrId = data.threeAddrId
              this.setLast()
              this.dataForm.oneAddrName = data.oneAddrName
              this.dataForm.twoAddrName = data.twoAddrName
              this.dataForm.threeAddrName = data.threeAddrName
              this.dataForm.detailedAddr = data.detailedAddr
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/materialStore/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'account': this.dataForm.account,
                'password': this.dataForm.password,
                'storeName': this.dataForm.storeName,
                'contacts': this.dataForm.contacts,
                'phone': this.dataForm.phone,
                'oneAddrId': this.dataForm.oneAddrId?this.dataForm.oneAddrId:0,
                'oneAddrName': this.dataForm.oneAddrName,
                'twoAddrId': this.dataForm.twoAddrId?this.dataForm.twoAddrId:0,
                'twoAddrName': this.dataForm.twoAddrName,
                'threeAddrId': this.dataForm.threeAddrId?this.dataForm.threeAddrId:0,
                'threeAddrName': this.dataForm.threeAddrName,
                'detailedAddr': this.dataForm.detailedAddr,
              })
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.$message({
                  message: this.$t('操作成功'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$alert(data.msg, this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
              }
            })
          }
        })
      }
    }
  }
</script>