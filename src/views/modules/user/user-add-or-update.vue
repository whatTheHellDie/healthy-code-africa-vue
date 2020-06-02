<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t( '姓名' )" prop="realname">
            <el-input v-model="dataForm.realname" :placeholder="$t( '姓名' )"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '性别' )" prop="gender" :class="{ 'is-required': !dataForm.id }">
            <el-radio-group v-model="dataForm.gender">
              <el-radio :label="0">{{$t( '男' )}}</el-radio>
              <el-radio :label="1">{{$t( '女' )}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '证件类型' )" prop="idType" :class="{ 'is-required': !dataForm.id }">
            <el-radio-group v-model="dataForm.idType">
              <el-radio :label="0">{{$t( '身份证' )}}</el-radio>
              <el-radio :label="1">{{$t( '护照' )}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t( '证件号码' )" prop="idCard" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.idCard" :placeholder="$t( '证件号码' )"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '国籍' )" prop="nationality" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.nationality" :placeholder="$t( '国籍' )"></el-input>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '手机号码' )" prop="phone" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.phone" :placeholder="$t( '手机号码' )"></el-input>

          </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item :label="$t( '区域' )" prop="oneAddrId">

        <el-row :gutter="5">
          <el-col :span="7">
            <el-select v-model="dataForm.oneAddrId" :placeholder="$t( '请选择' )" @change="setCity(true)">
              <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="dataForm.twoAddrId" :placeholder="$t( '请选择' )" @change="setArea(true)">
              <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="dataForm.threeAddrId" :placeholder="$t( '请选择' )" @change="setLast(true)">
              <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      </el-col>
        <el-col :span="24">
          <el-form-item :label="$t( '家庭住址' )" prop="homeAddress" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.homeAddress" :placeholder="$t( '家庭住址' )"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t( '公司名称' )" prop="corporate" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.corporate" :placeholder="$t( '公司名称' )"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t( '照片' )" prop="portrait" :class="{ 'is-required': !dataForm.id }">
            <div class="id-card">
              <img class="add-img" v-if="dataForm.portrait" :src="dataForm.portrait" />
              <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
              <input @change='add_img($event,"portrait",120,120)' accept="image/*;capture=camera" type="file" id="saveImage">
            </div>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '身份证正面' )" prop="frontCertificate" :class="{ 'is-required': !dataForm.id }">
            <div class="id-card">
              <img class="add-img" v-if="dataForm.frontCertificate" :src="dataForm.frontCertificate" />
              <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
              <el-popover placement="left" trigger="hover">
                <img :src="dataForm.frontCertificate" />
                <input @change='add_img1($event,"frontCertificate",undefined,undefined)' accept="image/*;capture=camera" slot="reference" type="file" id="saveImage">
              </el-popover>
            </div>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t( '身份证反面' )" prop="versoCertificate" :class="{ 'is-required': !dataForm.id }">
            <div class="id-card">
              <img class="add-img" v-if="dataForm.versoCertificate" :src="dataForm.versoCertificate" />
              <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
              <el-popover placement="left" trigger="hover">
                <img :src="dataForm.versoCertificate" />
                <input @change='add_img1($event,"versoCertificate",undefined,undefined)' accept="image/*;capture=camera" slot="reference" type="file" id="saveImage">
              </el-popover>
            </div>
          </el-form-item>

        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t( '健康状态' )" prop="state" :class="{ 'is-required': !dataForm.id }">
            <el-radio-group v-model="dataForm.state">
              <el-radio :label="0">{{$t( '健康' )}}</el-radio>
              <el-radio :label="1">{{$t( '疑似' )}}</el-radio>
              <el-radio :label="2">{{$t( '确诊' )}}</el-radio>
              <el-radio :label="4">{{$t( '治愈' )}}</el-radio>
              <el-radio :label="5">{{$t( '死亡' )}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12"><el-form-item :label="$t( '审批' )" prop="name" :class="{ 'is-required': !dataForm.id }">
           <div v-if="dataForm.attestation===0">{{$t( '未填写' )}}</div>
           <div v-if="dataForm.attestation===1">{{$t( '审核中' )}}</div>
           <div v-if="dataForm.attestation===2">{{$t( '审核通过' )}}</div>
           <div v-if="dataForm.attestation===3">{{$t( '审核不通过' )}}</div>
        </el-form-item></el-col>-->

        <el-col :span="24">
            <div class="area-form">
          <el-form-item :label="$t( '健康问卷' )" prop="name" :class="{ 'is-required': !dataForm.id }">
            <div>1.{{$t( '是否去过疫区？' )}} </div>
            <el-radio-group v-model="dataForm.questionForm.epidemicArea">
              <el-radio :label="1">{{$t( '是的' )}}</el-radio>
              <el-radio :label="0">{{$t( '否定' )}}</el-radio>
            </el-radio-group>
            <div>2.{{$t( '是否常驻本地？' )}} </div>
            <el-radio-group v-model="dataForm.questionForm.resident">
              <el-radio :label="1">{{$t( '是的，已经在本地居住3月以上' )}}</el-radio>
              <el-radio :label="0">{{$t( '外地返回不过14日' )}}</el-radio>
            </el-radio-group>
            <div>3.{{$t( '近期接触史' )}} </div>
            <el-radio-group v-model="dataForm.questionForm.contact">
              <el-radio :label="1">{{$t( '14日内密切接触近期有境外疫区者' )}}</el-radio>
              <el-radio :label="0">{{$t( '14日内没有密切接触近期有境外疫区者' )}}</el-radio>
            </el-radio-group>
            <div>4.{{$t( '个人健康状态' )}} </div>
            <el-radio-group v-model="dataForm.questionForm.healthStatus">
              <el-radio :label="0">{{$t( '正常活动，自觉正常无不适症状' )}}</el-radio>
              <el-radio :label="1">{{$t( '居家健康服务，本地有固定住处，在家自我健康观察' )}}</el-radio>
              <el-radio :label="2">{{$t( '集中健康服务，本地无固定住处，在家自我健康观察，如住节点登实施集中观察' )}}</el-radio>
              <el-radio :label="3">{{$t( '集中医学观察，在医疗机构医学观察' )}}</el-radio>
            </el-radio-group>
            <div>5.{{$t( '您是否有以下症状？' )}} </div>
            <el-radio-group v-model="dataForm.questionForm.symptom">
              <el-radio :label="0">{{$t( '发烧' )}}</el-radio>
              <el-radio :label="1">{{$t( '乏力' )}}</el-radio>
              <el-radio :label="2">{{$t( '干咳' )}}</el-radio>
              <el-radio :label="3">{{$t( '无' )}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </div>
        </el-col>
        
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        province: [],
        city: [],
        area: [],
        fullscreenLoading: false,
        see: false,
        visible: false,
        dataForm: {
          realname: "",
          phone: "",
          gender: "",
          nationality: "",
          idType: "",
          idCard: "",
          homeAddress: "",
          corporate: "",
          portrait: "",
          frontCertificate: "",
          versoCertificate: "",
          oneAddrId: "",
          oneAddrName: "",
          twoAddrId: "",
          twoAddrName: "",
          threeAddrId: "",
          threeAddrName: "",
          questionForm: {
            epidemicArea:0,
            resident:0,
            contact:0,
            healthStatus:0,
            symptom:3,
          },
          state:"",
        },
        stateOption: [

        ],
        dataRule: {
          frontCertificate: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          versoCertificate: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          oneAddrId: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          realname: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          idType: [{
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
          idCard: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          nationality: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          homeAddress: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          corporate: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          portrait: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          state: [{
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
            return '100px';
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
       // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true
            this.$http({
              url: this.$http.adornUrl(`/business/users/save`),
              method: 'post',
              data: this.$http.adornData({
                realname: this.dataForm.realname,
          phone: this.dataForm.phone,
          gender: this.dataForm.gender,
          nationality: this.dataForm.nationality,
          idType: this.dataForm.idType,
          idCard: this.dataForm.idCard,
          homeAddress: this.dataForm.homeAddress,
          corporate: this.dataForm.corporate,
          portrait: this.dataForm.portrait,
          frontCertificate: this.dataForm.frontCertificate,
          versoCertificate: this.dataForm.versoCertificate,
          oneAddrId: this.dataForm.oneAddrId?this.dataForm.oneAddrId:0,
          oneAddrName: this.dataForm.realname,
          twoAddrId: this.dataForm.twoAddrId?this.dataForm.twoAddrId:0,
          twoAddrName: this.dataForm.realname,
          threeAddrId: this.dataForm.threeAddrId?this.dataForm.threeAddrId:0,
          threeAddrName: this.dataForm.threeAddrName,
          questionForm: this.dataForm.questionForm,
          state:this.dataForm.state,
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false
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
      init(userId) {
        this.dataForm.userId = userId || 0;
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
        //      this.fullscreenLoading=true
        //        if(this.dataForm.userId) {
        //          this.$http({
        //            url: this.$http.adornUrl(`/business/users/info/${this.dataForm.userId}`),
        //            method: 'get',
        //            params: this.$http.adornParams()
        //          }).then(({
        //            data
        //          }) => {
        //            this.fullscreenLoading=false
        //            if(data && data.code === 200) {
        //              this.dataForm = data.data
        //            }else {
        //          this.$alert(data.msg, this.$t( '提示' ), {
        //            confirmButtonText: this.$t( '确定' ),
        //          });
        //        }
        //          })
        //        }
      },
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
      uploadImg(base64, folderName, name) {
        this.fullscreenLoading = true;
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
      // 添加图片
      add_img1(event, name, width, height) {
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
              event.target.value = "" //清空input[file]
              this.uploadImg(base64Codes, 'credentials', name)
            })
          }
        }

      },
      // 添加图片
      add_img(event, name, width, height) {
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
              event.target.value = "" //清空input[file]
              this.uploadImg(base64Codes, name, name)
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

<style scoped="scoped" lang="scss">
  .id-card {
    position: relative;
    .add {
      width: 120px;
      height: 120px;
      background: #eee url(/static/img/ic_add_icon@2x.png) center no-repeat;
    }
    .add-img {
      width: 120px;
      height: 120px;
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  
  .photo-img {
    width: 120px;
    height: 120px;
  }
  .el-select{width: 100%;}
  .area-form .el-radio{margin-left: 30px;}
</style>