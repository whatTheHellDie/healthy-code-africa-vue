<template>
  <el-dialog :title="!dataForm.id ? $t('新增') : $t('修改')" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible" top="5vh" custom-class="wew" width="80%">
    <div>
      <div class="mod-demo-ueditor">
        <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="80px">
          <el-form-item :label="$t( '省份' )" prop="types">
            <el-select v-model="dataForm.types" :placeholder="$t('请选择')" @change="getCity">
        <el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
          </el-form-item>
          <el-form-item :label="$t( '城市' )" prop="types">
            <el-select v-model="dataForm.types" :placeholder="$t('请选择')">
        <el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
          </el-form-item>
          <el-form-item :label="$t( '地区' )" prop="types">
            <el-select v-model="dataForm.types" :placeholder="$t('请选择')">
        <el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
          </el-form-item>
          <el-form-item :label="$t( '语言' )" prop="language">
            <el-input v-model="dataForm.title" :placeholder="$t( '标题' )" clearable></el-input>
          </el-form-item>
        </el-form>

      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="update">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/preview'
  export default {
    data() {
      return {
        fullscreenLoading :false,
        typesOptions:[{
          value:0,
          label:this.$t('用户协议'),
        },{
          value:1,
          label:this.$t('银行协议'),
        },{
          value:2,
          label:this.$t('支付协议'),
        },],
        visible: false,
        dataForm: {
          id: "",
          types: "",
          content: "",
          language: ""
        },
        dataRules: {
          types: [{
            required: true,
            message: this.$t('标题不能为空'),
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: this.$t('内容不能为空'),
            trigger: 'blur'
          }],
          language: [{
            required: true,
            message: this.$t('语言不能为空'),
            trigger: 'blur'
          }],
        },
        myValue: ""
      }
    },
    computed: {
      editorInit() {
        var lang = this.$getLang()
        switch(lang) {
          case 'zh-cn':
            lang = 'zh_CN';
            break;
          case 'fr':
            lang = 'fr_FR';
            break;
          case 'en':
            lang = undefined;
        }
        return {
          language_url: `/static/tinymce/langs/${lang}.js`,
          language: lang,
          //      skin_url: '/static/tinymce/skins/lightgray',
          base_url: '/static/tinymce/',
          height: 300,
          plugins: 'lists image media table  wordcount  link preview',
          toolbar: 'undo redo |  formatselect | bold italic contextmenu | textcolor forecolor |  alignleft aligncenter alignright alignjustify | fontselect fontsizeselect backcolor link | bullist numlist outdent indent | lists image media table | preview removeformat',
          branding: false,
          menubar: false,
          //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64()
            success(img)
          }
        }
      }
    },
    components: {
      Editor
    },
    //  activated(){
    //    tinymce.init({})
    //    this.init() 
    //  },
    destroyed() {
      tinymce.remove()
    },
    watch: {
      visible(val) {
        if(!val) {
          tinymce.remove()
          this.$parent.addOrUpdateVisible = false;
          this.$parent.getDataList()
        }
      }
    },
    methods: {
      getCity(){
        alert(1)
      },
      update() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            var head = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>${this.dataForm.types}</title><style>img{max-width:100%;width:auto;height:auto;display:block;}</style></head><body>`
            var foot = `</body></html>`
            this.fullscreenLoading = true;
            this.$http({
              url: this.$http.adornUrl(`/sys/useragreement/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id ? this.dataForm.id : undefined,
                types: this.dataForm.types,
                content: head + this.dataForm.content + foot,
                language: this.dataForm.language
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
        tinymce.init(this.editorInit)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if(!this.dataForm.id) {

        } else {
          this.$http({
            url: this.$http.adornUrl(`/sys/useragreement/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              this.dataForm.types = parseInt(data.userAgreement.types)
              var content = data.userAgreement.content;
              var first = content.indexOf('<body>') + 6;
              var end = content.indexOf('</body>');
              data.userAgreement.content = content.slice(first, end)
              this.dataForm.content = data.userAgreement.content
              this.dataForm.language = data.userAgreement.language
            } else {
              this.$alert(data.msg, this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
            }
          })
        }
      },
      dataFormSubmit() {

      }
    }
  }
</script>

<style lang="scss">

</style>