<template>
  <!--费用登记-->
  <div>
    <div class="mod-demo-ueditor">
      <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="80px">
        <el-form-item :label="$t( '姓名' )" prop="contentHtml">
          <el-input v-model="dataForm.contentHtml" :rows="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t( '就诊编号' )" prop="contentHtml">
          <el-input v-model="dataForm.contentHtml" :rows="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t( '费用项目类别' )" prop="title">
          <el-select v-model="dataForm.status" :placeholder="$t('请选择')">
            <el-option v-for="item in vertifyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t( '药品类别' )" prop="title">
          <el-select v-model="dataForm.status" :placeholder="$t('请选择')">
            <el-option v-for="item in vertifyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t( '费用项目编号' )" prop="contentHtml">
          <el-input v-model="dataForm.contentHtml" :rows="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t( '费用项目名称：' )" prop="contentHtml">
          <el-input v-model="dataForm.contentHtml" :rows="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t( '价格' )" prop="contentHtml">
          <el-input v-model="dataForm.contentHtml" :rows="10"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update">{{$t( '保存' )}}</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        fullscreenLoading: false,
        visible: false,
        vertifyOptions: [{
          value: '',
          label: this.$t('全部')
        }, {
          value: 0,
          label: this.$t('医护')
        }, {
          value: 1,
          label: this.$t('社区')
        }, {
          value: 2,
          label: this.$t('市民')
        }],
        dataForm: {
          id: "",
          title: "",
          contentHtml: "",
          origin: "",
          imgList: [],
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
        },
        myValue: ""
      }
    },
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
                origin: this.dataForm.origin,
                images: this.dataForm.imgList,
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false;
              if(data && data.code === 200) {
                this.visible = false;
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
      cancelImg(index) {
        console.log(index)
        this.dataForm.imgList.splice(index, 1)
      },
      uploadImg(base64) {
        this.$http({
          url: this.$http.adornUrl(`/business/common/upload`),
          method: 'post',
          data: this.$http.adornData({
            base64: base64,
            folderName: "news"
          })
        }).then(({
          data
        }) => {
          this.fullscreenLoading = false;
          if(data && data.code === 200) {
            this.dataForm.imgList.push(data.data)
            this.$refs.img.value = ""
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
    }
  }
</script>