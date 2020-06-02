<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '名称' )" prop="name">
        <div>{{ $t(dataForm.name) }}</div>
        <!--<el-input v-model="dataForm.name" :placeholder="$t( '名称' )"></el-input>-->
      </el-form-item>
      <!--<el-form-item :label="$t( '键名' )" prop="paramKey" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.paramKey" :placeholder="$t( '键名' )"></el-input>
      </el-form-item>-->
      <el-form-item :label="$t( '键值' )" prop="paramValue" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.paramValue" :placeholder="$t( '键值' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '排序' )" prop="sort" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.sort" :placeholder="$t( '排序' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '备注' )" prop="remark">
         <div>{{ $t(dataForm.remark) }}</div>
        <!--<el-input v-model="dataForm.remark" :placeholder="$t( '备注' )"></el-input>-->
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
          "id": "",
          "name": "",
          "paramKey": "",
          "paramValue": "",
          "sort": "",
          "remark": "",
        },
        dataRule: {
          name: [{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('名称')] ),
            trigger: 'blur'
          }],
//        paramKey:[{
//          required: true,
//          message: this.$t( 'messages.template3',[this.$t('键名')] ),
//          trigger: 'blur'
//        }],
          paramValue: [{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('键值')] ),
            trigger: 'blur'
          }],
          "sort":[{
            required: true,
            message: this.$t( 'messages.template3',[this.$t('排序')] ),
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
              url: this.$http.adornUrl(`/sys/paramconfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.dataForm = data.paramConfig
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
              url: this.$http.adornUrl(`/sys/paramconfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'paramValue': this.dataForm.paramValue,
                'sort': this.dataForm.sort,
                'remark': this.dataForm.remark,
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
      }
    }
  }
</script>