<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" v-loading.fullscreen.lock="fullscreenLoading" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '标题' )" prop="title">
        <el-input v-model="dataForm.title" :placeholder="$t( '标题' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '广告位置' )" prop="siteFlag" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="dataForm.siteFlag" :placeholder="$t('请选择')">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item :label="$t( '客户端类型' )" prop="osName" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="dataForm.osName" :placeholder="$t('请选择')">
        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item :label="$t( '跳转类型' )" prop="jumpFlag" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="dataForm.jumpFlag" :placeholder="$t('请选择')">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item :label="$t( '链接地址' )" prop="addressUrl">
        <el-input v-model="dataForm.addressUrl" :placeholder="$t( '链接地址' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '排序' )" prop="sort">
        <el-input v-model="dataForm.sort" :placeholder="$t( '排序' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '图片' )" prop="img">
       <div class="id-card">
              <img class="add-img" v-if="dataForm.img" :src="dataForm.img" />
              <div v-else class="add" src=""></div>
              <input @change='add_img($event,"img")' accept="image/*;capture=camera" type="file" id="saveImage">
            </div>
      </el-form-item>
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
        fullscreenLoading:false,
        visible: false,
        options:[{
          value: 0,
          label: '首页'
        }],
        options1:[{
          value: "Android",
          label: 'Android'
        }, {
          value: "Ios",
          label: 'Ios'
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
        dataRule: {
          title: [{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('标题')] ),
            trigger: 'blur'
          }],
          siteFlag:[{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('广告位置')] ),
            trigger: 'blur'
          }],
          osName: [{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('客户端类型')] ),
            trigger: 'blur'
          }],
          jumpFlag:[{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('跳转类型')] ),
            trigger: 'blur'
          }],
          addressUrl:[{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('链接地址')] ),
            trigger: 'blur'
          }],
           img:[{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('图片')] ),
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
    methods: {
      
      init(id) {
        this.dataForm.id=id||0;
        this.visible = true
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
          if(this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/advertisement/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.dataForm = data.advertisement
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
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading=true
            this.$http({
              url: this.$http.adornUrl(`/sys/advertisement/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'title': this.dataForm.title,
                'siteFlag': this.dataForm.siteFlag,
                'osName': this.dataForm.osName,
                'jumpFlag': this.dataForm.jumpFlag,
                'addressUrl': this.dataForm.addressUrl,
                'sort': this.dataForm.sort,
                'img': this.dataForm.img,
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
    height: 200px;
    .del{position: absolute;right: 5px;top: 5px;width: 24px;cursor: pointer;opacity: 0.8;}
    .add {
      width: 375px;
      height: 200px;
      background-image: url(/static/img/ic_add_icon@2x.png);
      background-repeat: no-repeat;
      background-color: #f0f0f0;
      background-position: center center;
    }
    .add-img {
      max-width: 375px;
      height: 200px;
    }
    input {
      appearance: none;
      position: absolute;
      width: 375px;
      height: 200px;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
    .logo {
      width: 80px;
      height: 80px;
    }
  }
  
</style>