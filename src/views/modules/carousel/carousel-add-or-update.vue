<template>
  <div>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" append-to-body :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
       <el-form-item :label="$t( '图片' )" prop="image">
        <div class="id-card">
          <img class="add-img" v-if="dataForm.image" :src="dataForm.image" />
          <div v-else class="add" src="/static/img/ic_add_icon@2x.png"></div>
          <div>
            <el-popover placement="left" trigger="hover">
              <img :src="dataForm.image" />
              <input @change='add_img($event,"image")' class="input" slot="reference" accept="image/*;capture=camera" type="file" ref="saveImage">
            </el-popover>
          </div>

        </div>
      </el-form-item>
      <el-form-item :label="$t( '跳转类型' )" prop="type">
        <el-radio-group v-model="type">
          <el-radio :label="0">{{$t( '商店' )}}</el-radio>
          <el-radio :label="1">{{$t( '物资' )}}</el-radio>
          <el-radio :label="2">{{$t( '医疗' )}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t( '名称' )" prop="relationId">
        {{dataForm.relationName}} <el-button type="text" size="small" @click="bindId()">{{$t( '绑定' )}}</el-button>
     <!--选择商店物资医疗-->
        <div style="background: #eee;padding: 5px 5px;" v-show="chooseList">
          <add-or-update v-show="addOrUpdateVisible" ref="addOrUpdate" @getInfomation="getInfomation"></add-or-update>  
          <add-or-update1 v-show="addOrUpdateVisible1" ref="addOrUpdate1" @getInfomation="getInfomation" ></add-or-update1>  
          <add-or-update2 v-show="addOrUpdateVisible2" ref="addOrUpdate2" @getInfomation="getInfomation" ></add-or-update2>  
        </div>
      </el-form-item>
        
      <el-form-item :label="$t( '排序' )" prop="sort">
        <el-input type="number" :min="1" v-model="dataForm.sort" :placeholder="$t( '排序' )" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
 
</div>
</template>

<script>
import AddOrUpdate from '../mall/shop-list'
import AddOrUpdate1 from '../store/materialStore'
import AddOrUpdate2 from '../hospital/hospital-list'
  export default {
    data() {
      return {
        chooseList:false,
         addOrUpdateVisible: false,
         addOrUpdateVisible1: false,
         addOrUpdateVisible2: false,
        visible: false,
        roleList: [],
        type: "",
        dataForm: {
          type:"",
          image:"",
          sort:"",
          relationId:"",
          relationName:""
        },
        dataRule: {
          goodsName: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          image: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          sort: [{
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
      },
    },
    watch: {
      type(){
            
            this.dataForm.relationId=""
              this.dataForm.relationName=""
              this.dataForm.type=this.type
     },
      visible(val) {
        if(!val) {
          this.$parent.addOrUpdateVisible = false;
          this.$parent.getDataList()
        }
      }
    },
    components: {
      AddOrUpdate,
      AddOrUpdate1,
      AddOrUpdate2,
    },
    methods: {
      bindId(){
        if(this.type===0){
               this.hideAll()
              this.addOrUpdateHandle()
            }else if(this.type===1){
               this.hideAll()
              this.addOrUpdateHandle1()
            }else if(this.type===2){
               this.hideAll()
              this.addOrUpdateHandle2()
            }
      },
      hideAll(){
        this.addOrUpdateVisible=false
         this.addOrUpdateVisible1=false
         this.addOrUpdateVisible2=false
         this.chooseList=true
         
      },
      getInfomation(id,name){
        console.log(id,name)
        this.dataForm.relationId=id
        this.dataForm.relationName=name
        this.chooseList=false
      },
      // 医疗
      addOrUpdateHandle2(id) {
        this.addOrUpdateVisible2 = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate2.init(id)
        })
      },
      // 物资
      addOrUpdateHandle1(id) {
        this.addOrUpdateVisible1 = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate1.init(id)
        })
      },
      // 商店
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      init(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.saveImage.value=""
        })
        this.dataForm.id = id || 0
        if(this.dataForm.id) {
          this.fullscreenLoading=true
          this.$http({
            url: this.$http.adornUrl(`/business/carousel/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            this.fullscreenLoading=false
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.image = data.image
              this.type = data.type
              
              this.dataForm.sort = data.sort
              
              this.$nextTick(() => {
          this.chooseList=false
          this.dataForm.relationId = data.relationId
          this.dataForm.relationName=data.relationName
        })
              
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            if(this.dataForm.price <= 0) {
              this.$alert(this.$t('价格不能小于或等于0'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
              return;
            }
            var head = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>${this.dataForm.title}</title><style>img{max-width:100%;width:auto;height:auto;display:block;}</style></head><body>`
            var foot = `</body></html>`
            this.$http({
              url: this.$http.adornUrl(`/business/carousel/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'image': this.dataForm.image,
                'type': this.type,
                'relationId': this.dataForm.relationId,
                'sort': Number(this.dataForm.sort),
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
        this.fullscreenLoading=true
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
             event.target.value = "" //清空input[file]
              this.uploadImg(base64Codes, 'carousel', 'image')
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
    .input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
</style>