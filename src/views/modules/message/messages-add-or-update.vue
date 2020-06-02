<template>
  <el-dialog :title="!dataForm.id ? $t('新增') : $t('修改')" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible" top="5vh" custom-class="wew" width="80%">
    <div>
      <div class="mod-demo-ueditor">
        <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="80px">

          <el-form-item :label="$t( '标题' )" prop="title">
            <el-input v-model="dataForm.title" :placeholder="$t( '标题' )"></el-input>
          </el-form-item>
          <el-form-item :label="$t( '内容' )" prop="contentHtml">
            <el-input type="textarea" v-model="dataForm.contentHtml" :placeholder="$t( '内容' )"></el-input>
            <!--<editor v-model="dataForm.contentHtml" :init="editorInit"></editor>-->
          </el-form-item>
          <el-form-item :label="$t( '来源' )" prop="origin">
            <el-input v-model="dataForm.origin" :placeholder="$t( '来源' )"></el-input>
          </el-form-item>
          <el-form-item :label="$t( ' 图片' )">
            <div class="id-card">
             <el-button type="primary">{{$t( '添加图片' )}}</el-button>
           <input @change='add_img($event,"imgList")' class="input" ref="img" slot="reference" accept="image/*;capture=camera" type="file" id="saveImage">
           </div>
           <div>
             <div class="list-img-wrap" v-for="item,i in dataForm.imgList">
            <el-popover placement="left" trigger="hover">
              <img :src="item" />
              <img class="list-img" :src="item" slot="reference"/>
            </el-popover>
            <div class="close" @click="cancelImg(i)">✖</div>
             </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">{{$t( '保存' )}}</el-button>

          </el-form-item>
        </el-form>

      </div>
    </div>
  </el-dialog>
</template>

<script>
//import tinymce from 'tinymce/tinymce'
//import Editor from '@tinymce/tinymce-vue'
//import 'tinymce/themes/silver/theme'
//import 'tinymce/plugins/image'
//import 'tinymce/plugins/media'
//import 'tinymce/plugins/table'
//import 'tinymce/plugins/lists'
//import 'tinymce/plugins/wordcount'
//import 'tinymce/plugins/colorpicker'
//import 'tinymce/plugins/link'
//import 'tinymce/plugins/preview'
  export default {
    data() {
      return {
        
        fullscreenLoading:false,
        visible: false,
        dataForm: {
          id: "",
          title: "",
          contentHtml: "",
          origin:"",
          imgList:[],
        },
        dataRules: {
          title: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          contentHtml: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'change'
          }],
          origin: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'change'
          }],
        },
        myValue: ""
      }
    },
//  computed: {
//    editorInit() {
//      var lang = this.$getLang()
//      switch(lang) {
//        case 'zh-cn':
//          lang = 'zh_CN';
//          break;
//        case 'fr':
//          lang = 'fr_FR';
//          break;
//        case 'en':
//          lang = undefined;
//      }
//      return {
//        language_url: `/static/tinymce/langs/${lang}.js`,
//        language: lang,
//        //      skin_url: '/static/tinymce/skins/lightgray',
//        base_url: '/static/tinymce/',
//        height: 300,
//        plugins: 'lists media table  wordcount  link preview',
//        fontsize_formats: "10px 12px 14px 18px 20px 22px 24px 36px",
//        toolbar: 'undo redo |  formatselect | bold italic contextmenu | textcolor forecolor |  alignleft aligncenter alignright alignjustify | fontselect fontsizeselect backcolor link | bullist numlist outdent indent | lists  table | preview removeformat',
//        branding: false,
//        menubar: false,
//        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
//        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
////        images_upload_handler: (blobInfo, success, failure) => {
////          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
////          success(img)
////        }
//      }
//    }
//  },
//  components: {
//    Editor
//  },
    //  activated(){
    //    tinymce.init(this.editorInit)
    //    this.init()
    //  },
    //  deactivated(){
    //    tinymce.remove()
    //  },
    watch: {
      visible(val) {
        if(!val) {
//        tinymce.remove()
          this.$parent.addOrUpdateVisible = false;
          this.$parent.getDataList()
        }
      }
    },
//  mounted() {
//    tinymce.init(this.editorInit)
//  },
    methods: {
      update() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
//          var head = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>${this.dataForm.title}</title><style>img{max-width:100%;width:auto;height:auto;display:block;}</style></head><body>`
//          var foot = `</body></html>`
            this.fullscreenLoading = true;
            this.$http({
              url: this.$http.adornUrl(`/business/news/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id ? this.dataForm.id : undefined,
                title: this.dataForm.title,
                contentHtml: this.dataForm.contentHtml,
                origin:this.dataForm.origin,
                images:this.dataForm.imgList,
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false;
              if(data && data.code === 200) {
                this.visible=false;
              } else {
                this.$alert(data.msg, this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
              }
            })
          }
        });

      },
      init(id) {
//      tinymce.init(this.editorInit)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if(!this.dataForm.id) {

        } else {
          this.$http({
            url: this.$http.adornUrl(`/business/news/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              this.dataForm.title = data.data.title
//            var contentHtml = data.data.contentHtml;
//            var first = contentHtml.indexOf('<body>') + 6;
//            var end = contentHtml.indexOf('</body>');
//            data.data.contentHtml = contentHtml.slice(first, end)
              this.dataForm.contentHtml = data.data.contentHtml
              this.dataForm.origin = data.data.origin
              this.dataForm.imgList = data.data.images
            } else {
              this.$alert(data.msg, this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
            }
          })
        }
      },
      cancelImg(index){
        console.log(index)
         this.dataForm.imgList.splice(index,1)
      },
      uploadImg(base64){
        this.$http({
              url: this.$http.adornUrl(`/business/common/upload`),
              method: 'post',
              data: this.$http.adornData({
                base64: base64,
                folderName:"news"
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false;
              if(data && data.code === 200) {
                 this.dataForm.imgList.push(data.data)
                 this.$refs.img.value=""
              } else {
                this.$alert(data.msg, this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
              }
            })
      },
       // 上传图片
      add_img(event, name, width, height, index) {
        if(this.dataForm.imgList.length==6){
           this.$alert(this.$t('最多上传6张图片'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
              return;
        }
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
this.fullscreenLoading = true;
        this.uploadImg(base64Codes)
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
    position: relative;margin-bottom: 10px;
    .input{position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;cursor: pointer;}
  }
  .list-img-wrap{position: relative;display: inline-block;vertical-align: top;margin-right: 5px;
    .close{cursor: pointer;
       font-size: 12px;position: absolute;right: 0;top: 0;background: green;height: 16px;width: 16px;text-align: center;line-height: 16px;color: #fff;
    }
  }
  .list-img{width: 120px;}
</style>