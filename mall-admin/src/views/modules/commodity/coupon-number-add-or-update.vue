<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" v-loading.fullscreen.lock="fullscreenLoading" :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '物资名称' )">
        <el-input  v-model="dataForm.name" readonly></el-input>
      </el-form-item>
       <el-form-item :label="$t( '数量' )" prop="stock">
        <el-input type="number" v-model="dataForm.stock" :placeholder="$t( '数量' )"></el-input>
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
          name:"",
          id: 0,
          stock:""
        },
        dataRule: {
          stock: [{
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
      init(id,name) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.id = id || 0
        this.dataForm.name = name 
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true
            this.$http({
              url: this.$http.adornUrl(`/business/storeCoupon/addNumber`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'stock': this.dataForm.stock,
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