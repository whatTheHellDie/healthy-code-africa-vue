<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" v-loading.fullscreen.lock="fullscreenLoading" :close-on-click-modal="false" :visible.sync="visible" class="material-store-add">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '优惠券名称' )" prop="couponName">
        <el-input v-model="dataForm.couponName" :placeholder="$t( '店铺名称' )"></el-input>
      </el-form-item>
       <el-form-item :label="$t( '发放类型' )" prop="state">
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">{{$t( '通用' )}}</el-radio>
          <el-radio :label="1">{{$t( '满减' )}}</el-radio>
          <el-radio :label="2">{{$t( '打折' )}}</el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item :label="$t( '优惠券金额' )" prop="amount">
        <el-input  v-model="dataForm.amount" :placeholder="$t( '优惠券金额' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '扫码发放' )" prop="automatic">
        <el-radio-group v-model="dataForm.automatic">
          <el-radio :label="0">{{$t( '否' )}}</el-radio>
          <el-radio :label="1">{{$t( '是' )}}</el-radio>
        </el-radio-group>
      </el-form-item>
     
      <el-form-item :label="$t( '优惠券有效期' )" prop="dueTime">
        <el-date-picker
      v-model="dataForm.dueTime" value-format="yyyy-MM-dd HH:mm:ss" 
      type="date" :placeholder="$t('选择日期')" :picker-options="pickerOptions0">
    </el-date-picker>
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
pickerOptions0: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }

        },

        visible: false,
        roleList: [],
        dataForm: {
          couponName:"",
          id: 0,
          number:"",
          dueTime:"",
          couponName:"",
          automatic:"",
          state:"",
          number:""
        },
        dataRule: {
          number:[{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          state: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          automatic: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          couponName: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          amount: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          number: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
          dueTime: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
//        content: [
//          { required: true, message: this.$t( '不能为空' ), trigger: 'change' }
//        ],
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
      visible(val) {
        if(!val) {
          this.$parent.addOrUpdateVisible = false;
          this.$parent.getDataList()
        }
      }
    },
    methods: {
      // 初始化
      init(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.id = id || 0
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/business/storeCoupon/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data = data.data
              this.dataForm.couponName = data.couponName
              this.dataForm.amount = data.amount
              this.dataForm.dueTime = data.dueTime
              this.dataForm.automatic = data.automatic
              this.dataForm.state = data.state
              this.dataForm.number = data.number
              
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            if(this.dataForm.state===1){
              //满减格式像300-100
              if(this.dataForm.amount.indexOf("-")!= -1){
                var value =this.dataForm.amount.split("-")
                if(value[0]-value[1]<=0){
                  this.$alert(this.$t("优惠券金额格式错误"), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
                return;
                }
                
              }else{
                this.$alert(this.$t("满减优惠券金额输入格式错误，如500-100"), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
                return;
              }
              
            }
            if(this.dataForm.state!==1&&!Number(this.dataForm.amount)){
                  this.$alert(this.$t("优惠券金额格式错误"), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
                return;
                }
            this.fullscreenLoading = true
            this.$http({
              url: this.$http.adornUrl(`/business/storeCoupon/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'couponName': this.dataForm.couponName,
                'amount': this.dataForm.amount,
                'automatic': this.dataForm.automatic,
                'state': this.dataForm.state,
                'number': Number(this.dataForm.number),
                'dueTime': this.dataForm.dueTime,
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
      },
      toGMT8(time){
        var dt = new Date(time);
var date = [
  [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
  [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':')
].join(' ').replace(/(?=\b\d\b)/g, '0');
return date;
      }
    }
  }
</script>
