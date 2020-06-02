<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" v-loading.fullscreen.lock="fullscreenLoading" :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '护理名称' )" prop="shopName">
        <el-input v-model="dataForm.shopName" :placeholder="$t( '护理名称' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '价格' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '价格' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '国家' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '国家' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '诊疗编号' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '服务设施编号' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '单位' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '单位' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '厂家' )" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t( '厂家' )"></el-input>
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
      return {
        fullscreenLoading: false, 
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
          shopName:"",
          id: 0,
          account: '',
          password: '',
          comfirmPassword: '',
          oneAddrId: "",
          twoAddrId: "",
          threeAddrId: "",
          detailedAddr:"",
          contacts:"",
          phone:"",
          oneAddrName:"",
        twoAddrName:"",
        threeAddrName:"",
        logo:"",
        classify:""
        },
        dataRule: {
          shopName: [{
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
    methods: {
      init(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.id = id || 0
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/business/store/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.account = data.account
              this.dataForm.shopName = data.shopName
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
              this.dataForm.classify = data.classify
              this.dataForm.logo = data.logo
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true
            this.$http({
              url: this.$http.adornUrl(`/business/store/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'account': this.dataForm.account,
                'password': this.dataForm.password,
                'shopName': this.dataForm.shopName,
                'logo': this.dataForm.logo,
                'classify': this.dataForm.classify,
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
              if(index !== undefined) {
                var data = this.dataForm[name]
                data[index] = base64Codes
                this.dataForm[name] = data;
                this.$forceUpdate()
              } else {
                this.dataForm[name] = base64Codes;
              }
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