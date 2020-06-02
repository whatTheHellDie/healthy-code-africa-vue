<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" v-loading.fullscreen.lock="fullscreenLoading" :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '物资名称' )" prop="tradeName">
        <el-input v-model="dataForm.tradeName" :placeholder="$t( '物资名称' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '图片' )" prop="portrait">
       <div class="id-card">
              <img class="add-img" v-if="dataForm.portrait" :src="dataForm.portrait" />
              <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
              <input @change='add_img($event,"portrait",120,120)' accept="image/*;capture=camera" type="file" id="saveImage">
            </div>
      </el-form-item>
       <!--<el-form-item :label="$t( '库存数量' )" prop="stock">
        <el-input type="number" v-model="dataForm.stock" :placeholder="$t( '库存数量' )"></el-input>
      </el-form-item>-->
      <el-form-item :label="$t( '物资单位' )" prop="unit">
        <el-input v-model="dataForm.unit" :placeholder="$t( '物资单位' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '限购数量' )" prop="quota">
        <el-input  type="number"v-model="dataForm.quota" :placeholder="$t( '限购数量' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '领取间隔(天数)' )" prop="drawInterval">
        <el-input type="number" v-model="dataForm.drawInterval" :placeholder="$t( '领取间隔(天数)' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '到期(天数)' )" prop="expire">
        <el-input type="number" v-model="dataForm.expire" :placeholder="$t( '到期(天数)' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '下架' )" prop="expire">
        <el-radio-group v-model="dataForm.state">
              <el-radio :label="1">{{$t( '是' )}}</el-radio>
              <el-radio :label="0">{{$t( '否' )}}</el-radio>
            </el-radio-group>
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
        fullscreenLoading: false, 
        visible: false,
        roleList: [],
        dataForm: {
          tradeName:"",
          id: 0,
          unit: '',
          comfirmPassword: '',
          quota:"",
          phone:"",
          unit:"",
          portrait:"",
          state:"",
          drawInterval:"",
//        stock:""
        },
        dataRule: {
          tradeName: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          portrait: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          state: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          expire: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          quota: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          drawInterval: [{
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
    methods: {
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
              event.target.value=""
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
      init(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.id = id || 0
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/business/material/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.tradeName = data.tradeName
//            this.dataForm.stock = data.stock
              this.dataForm.unit = data.unit
              this.dataForm.quota = data.quota
              this.dataForm.state = data.state
              this.dataForm.expire = data.expire
              this.dataForm.drawInterval = data.drawInterval
              this.dataForm.portrait = data.portrait
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
              url: this.$http.adornUrl(`/business/material/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'tradeName': this.dataForm.tradeName,
                'portrait': this.dataForm.portrait,
                'unit': this.dataForm.unit,
                'quota': this.dataForm.quota,
                'state': this.dataForm.state,
                'expire': this.dataForm.expire,
                'drawInterval': this.dataForm.drawInterval,
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