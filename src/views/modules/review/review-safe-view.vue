<template>
  <el-dialog :title="see ? $t( '查看' ) : $t( '审批' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '账号' )" prop="account">
        <div>{{dataForm.account}}</div>
      </el-form-item>
      <el-form-item :label="$t( '姓名' )" prop="name" :class="{ 'is-required': !dataForm.id }">
         <div>{{dataForm.name}}</div>
      </el-form-item>
      <el-form-item :label="$t( '身份证正面' )" prop="img">
       <div class="id-card">
              <img class="add-img" :src="dataForm.frontPicture" />
            </div>
      </el-form-item>
      <el-form-item :label="$t( '身份证背面' )" prop="img">
       <div class="id-card">
              <img class="add-img" :src="dataForm.backPicture" />
            </div>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!see">
      <el-button type="primary" @click="dataFormSubmit(1)">{{$t( '审批通过' )}}</el-button>
      <el-button type="danger" @click="dataFormSubmit(2)">{{$t( '审批不通过' )}}</el-button>
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
        options:[{
          value: 0,
          label: this.$t('首页')
        }],
        options1:[{
          value: "0",
          label: 'Android'
        }, {
          value: "1",
          label: 'IOS'
        } ],
        options2:[{
          value: 0,
          label: 'h5'
        }, {
          value: 1,
          label: 'app'
        } ],
        dataForm: {
          id: "",
          title: "",
          siteFlag: "",
          osName: "",
          jumpFlag: "",
          addressUrl: "",
          sort : "",
          img: "",
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
      
      init(id,see) {
        this.see=see
        this.dataForm.id=id||0;
        this.visible = true
        this.fullscreenLoading=true
          if(this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/forgetpwdapprove/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.fullscreenLoading=false
                this.dataForm = data.forgetPwdApprove
//              this.dataForm.salt = data.user.salt
//              this.dataForm.email = data.user.email
//              this.dataForm.mobile = data.user.mobile
//              this.dataForm.roleIdList = data.user.roleIdList
//              this.dataForm.status = data.user.status
              }
            })
          }
      },
      // 表单提交
      dataFormSubmit(status) {
            this.fullscreenLoading=true
            this.$http({
              url: this.$http.adornUrl(`/sys/forgetpwdapprove/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'status': status
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading=false
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
                this.$message.error(data.msg)
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
              quality: 1,
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
      }
    }
  }
</script>

<style scoped="scoped" lang="scss">
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