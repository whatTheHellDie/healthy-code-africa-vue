<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" :close-on-click-modal="false" :visible.sync="visible" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '名称' )" prop="name" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.name" :placeholder="$t( '名称' )"></el-input>
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
        roleList: [],
        dataForm: {
          "id":"",
          "name": "",
        },
        dataRule: {
          name: [{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('名称')] ),
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
      init(id) {
        this.dataForm.id=id||0;
        this.visible = true
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
          if(this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/helpclassify/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.dataForm = data.helpClassify
              }
            })
          }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true;
            this.$http({
              url: this.$http.adornUrl(`/sys/helpclassify/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false;
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
      }
    }
  }
</script>