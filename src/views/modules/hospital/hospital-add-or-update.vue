<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" :close-on-click-modal="false" :visible.sync="visible" class="material-hospital-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '医院名称' )" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t( '医院名称' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '负责人' )" prop="principal">
        <el-input v-model="dataForm.principal" :placeholder="$t( '负责人' )"></el-input>
      </el-form-item>
       <el-form-item :label="$t( '执照号' )" prop="licenseNo">
        <el-input v-model="dataForm.licenseNo" :placeholder="$t( '执照号' )"></el-input>
      </el-form-item>
      <!--<el-form-item :label="$t( '医院类型' )" prop="classify">
       <el-select v-model="dataForm.classify" :placeholder="$t('请选择')">
        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>-->
      <el-form-item :label="$t( '医院区域' )" prop="oneAddrId">

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
       <el-form-item :label="$t( '医院地址' )" prop="address">
        <el-input v-model="dataForm.address" :placeholder="$t( '医院地址' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '电话' )" prop="phone">
        <el-input v-model="dataForm.phone" :placeholder="$t( '电话' )"></el-input>
      </el-form-item>
      
      <el-form-item :label="$t( '照片' )" prop="photoUrl">
       <div class="id-card">
              <img class="add-img" v-if="dataForm.photoUrl" :src="dataForm.photoUrl" />
              <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
              <input @change='add_img($event,"photoUrl")' ref="resetFile" accept="image/*;capture=camera" type="file" id="saveImage">
            </div>
      </el-form-item>
      <el-form-item :label="$t( '管理员账号' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '管理员账号' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '密码' )" prop="password" v-if="!dataForm.id" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t( '密码' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '确认密码' )" prop="comfirmPassword" v-if="!dataForm.id" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t( '确认密码' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '医院简介' )" prop="intro">
        <el-input type="textarea" v-model="dataForm.intro" :placeholder="$t( '医院简介' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '创建时间' )" prop="hospitalCreationTime">
        <el-date-picker
      v-model="dataForm.hospitalCreationTime"
      type="date"
      :placeholder="$t( '选择日期' )" value-format="yyyy-MM-dd">
    </el-date-picker>
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
      var validateComfirmPassword = (rule, value, callback) => {
        if(!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error(this.$t('不能为空')))
        } else if(this.dataForm.password !== value) {
          callback(new Error(this.$t('确认密码与密码输入不一致')))
        } else {
          callback()
        }
      }
      return {
        classifyOptions: [{
          value: 0,
          label: this.$t('美食')
        }, {
          value: 1,
          label: this.$t('果蔬')
        },{
          value: 2,
          label: this.$t('超市')
        },{
          value: 3,
          label: this.$t('医药')
        }, ],
        province: [],
        city: [],
        area: [],
        
        oneAddrOptions: [],
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          address:"",
          name:"",
          intro:"",
          licenseNo:"",
          phone:"",
          photoUrl:"",
          oneAddrId: "",
          twoAddrId: "",
          threeAddrId: "",
          principal: '',
          oneAddrName:"",
        twoAddrName:"",
        threeAddrName:"",
        account: '',
        password: '',
        hospitalCreationTime:""
        },
        dataRule: {
          address:[{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          intro: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          licenseNo: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          photoUrl: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          principal: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          password: [{
            validator: validatePassword,
            trigger: 'blur'
          }],
          comfirmPassword: [{
            validator: validateComfirmPassword,
            trigger: 'blur'
          }],
          oneAddrId: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          account: [{
           required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
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
            console.log(data[i].label)
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
          this.$refs.resetFile.value=""
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
            this.province = data
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/business/hospital/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.address = data.address
              this.dataForm.name = data.name
              this.dataForm.intro = data.intro
              this.dataForm.licenseNo = data.licenseNo
              this.dataForm.oneAddrId = data.oneAddrId
              this.setCity()
              this.dataForm.twoAddrId = data.twoAddrId
              this.setArea()
              this.dataForm.threeAddrId = data.threeAddrId
              this.setLast()
              this.dataForm.oneAddrName = data.oneAddrName
              this.dataForm.twoAddrName = data.twoAddrName
              this.dataForm.threeAddrName = data.threeAddrName
              this.dataForm.phone = data.phone
              this.dataForm.photoUrl = data.photoUrl
              this.dataForm.principal = data.principal
              this.dataForm.account = data.account
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/hospital/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'address': this.dataForm.address,
                'name': this.dataForm.name,
                'intro': this.dataForm.intro,
                'licenseNo': this.dataForm.licenseNo,
                'phone': this.dataForm.phone,
                'photoUrl': this.dataForm.photoUrl,
                'phone': this.dataForm.phone,
                'oneAddrId': this.dataForm.oneAddrId?this.dataForm.oneAddrId:0,
                'oneAddrName': this.dataForm.oneAddrName,
                'twoAddrId': this.dataForm.twoAddrId?this.dataForm.twoAddrId:0,
                'twoAddrName': this.dataForm.twoAddrName,
                'threeAddrId': this.dataForm.threeAddrId?this.dataForm.threeAddrId:0,
                'threeAddrName': this.dataForm.threeAddrName,
                'principal': this.dataForm.principal,
                'account': this.dataForm.account,
                'password': this.dataForm.password,
                'hospitalCreationTime':this.dataForm.hospitalCreationTime
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
      },
      uploadImg(base64, folderName, name) {
        this.$http({
          url: this.$http.adornUrl(`/business/common/upload`),
          method: 'post',
          data: this.$http.adornData({
            base64: base64,
            folderName: folderName
          })
        }).then(({
          data
        }) => {
          this.fullscreenLoading = false;
          if(data && data.code === 200) {
            this.dataForm[name] = data.data
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
       // 上传图片
      add_img(event, name, width, height, index) {
        var reader = new FileReader();
        var AllowImgFileSize = 500 * 1024; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
        var file = event.target.files[0]
        var imgUrlBase64;
        if(file) {
          //将文件以Data URL形式读入页面
          imgUrlBase64 = reader.readAsDataURL(file);
          reader.onload = (e) => {
            //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
            if(AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
             this.$alert(this.$t('上传失败，请上传不大于500k的图片!'), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
              return;
            }
            this.canvasDataURL(reader.result, {
              quality: 0.6,
              type: file.type,
              width,
              height
            }, (base64Codes) => {
             this.uploadImg(base64Codes, 'hospital', 'photoUrl')
            })
          }
        }

      },
      canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function() {
          var that = this;
          // 默认按比例压缩
          var w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          var quality = 1; // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL(obj.type, quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },
    }
  }
</script>
<style scoped="scoped" lang="scss" type="text/css">
  .id-card{
    position: relative;
    .add{
      width: 120px;height: 120px;background: #eee url(/static/img/ic_add_icon@2x.png) center no-repeat;
    }
    .add-img{width: 120px;height: 120px;}
    input{position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;}
  }
</style>