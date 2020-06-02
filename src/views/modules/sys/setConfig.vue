<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="getDataList()" label-width="180px">
      <el-row :gutter="24">
        <div>
          <el-col :span="24"><font size="4"><b>支付配置:</b></font></el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="24"><span style="color: red">注意：此栏目所有的比例总和必须为1，并且BTC部分不得低于0.3</span></el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item label="支付币种（BTC）：" prop="pay_btc" >
              <el-input v-model.number="dataForm.pay_btc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付币种（Love Bird）：" prop="pay_lovebird" >
              <el-input v-model.number="dataForm.pay_lovebird"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="24"><font size="4"><b>奖励配置:</b></font></el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="24"><span style="color: red">注意：最大奖金总和不得高于{{limitPrice}}元</span></el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item label="直推奖：" prop="bonus_first" >
              <el-input v-model.number="dataForm.bonus_first"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="间推奖：" prop="bonus_second" >
              <el-input v-model.number="dataForm.bonus_second"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区级代理管理奖：" prop="area_proxy_bonus" >
              <el-input v-model.number="dataForm.area_proxy_bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市级代理管理奖：" prop="city_proxy_bonus" >
              <el-input v-model.number="dataForm.city_proxy_bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="省级代理管理奖：" prop="province_proxy_bonus" >
              <el-input v-model.number="dataForm.province_proxy_bonus"></el-input>
            </el-form-item>
            （备注：区级、市级、省级代理管理奖拨付为级差模式，配置的为最大拨出金额）
          </el-col>
          <el-col :span="12">
            <el-form-item label="区级平级补助（代）：" prop="area_allowance_number" >
              <el-input v-model.number="dataForm.area_allowance_number"></el-input>
            </el-form-item>
            （如3，代表3代以内）
          </el-col>
          <el-col :span="12">
            <el-form-item label="区级平级补助（元）：" prop="area_allowance_bonus" >
              <el-input v-model.number="dataForm.area_allowance_bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市级平级补助（代）：" prop="city_allowance_number" >
              <el-input v-model.number="dataForm.city_allowance_number"></el-input>
            </el-form-item>
            （如3，代表3代以内）
          </el-col>
          <el-col :span="12">
            <el-form-item label="市级平级补助（元）：" prop="city_allowance_bonus" >
              <el-input v-model.number="dataForm.city_allowance_bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省级平级补助（代）：" prop="province_allowance_number" >
              <el-input v-model.number="dataForm.province_allowance_number"></el-input>
            </el-form-item>
            （如3，代表3代以内）
          </el-col>
          <el-col :span="12">
            <el-form-item label="省级平级补助（元）：" prop="province_allowance_bonus" >
              <el-input v-model.number="dataForm.province_allowance_bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分红日期：" prop="bonus_day" >
              <el-input v-model.number="dataForm.bonus_day"></el-input>
            </el-form-item>
            （如1，代表每月1日分红）
          </el-col>
          <el-col :span="12">
            <el-form-item label="分红金额（元）：" prop="bonus_money" >
              <el-input v-model.number="dataForm.bonus_money"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="24"><font size="4"><b>其他参数配置:</b></font></el-col>
          <el-col :span="24">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item label="复销套餐折扣：" prop="package_discount" >
              <el-input v-model.number="dataForm.package_discount"></el-input>
            </el-form-item>
            （如0.7，代表7折）
          </el-col>
          <el-col :span="12">
            <el-form-item label="体验价套餐折扣：" prop="package_experience_discount" >
              <el-input v-model.number="dataForm.package_experience_discount"></el-input>
            </el-form-item>
            （如0.5，代表5折）
          </el-col>
          <el-col :span="24" align="center">
              <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        limitPrice:'',
        dataForm: {
          pay_btc: '',
          pay_lovebird: '',
          bonus_first: '',
          bonus_second: '',
          area_proxy_bonus: '',
          city_proxy_bonus: '',
          province_proxy_bonus: '',
          area_allowance_number: '',
          area_allowance_bonus: '',
          city_allowance_number: '',
          city_allowance_bonus: '',
          province_allowance_number: '',
          province_allowance_bonus: '',
          bonus_day: '',
          bonus_money: '',
          package_discount: '',
          package_experience_discount: ''
        },
        dataRule: {
          pay_btc: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          pay_lovebird: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          bonus_first: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          bonus_second: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          area_proxy_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          city_proxy_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          province_proxy_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          area_allowance_number: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          area_allowance_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          city_allowance_number: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          city_allowance_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          province_allowance_number: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          province_allowance_bonus: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          bonus_day: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          bonus_money: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          package_discount: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
          package_experience_discount: [{ required: true,type: 'number', message: '不能为空且只能为数字', trigger: 'blur' }],
        }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
		  if(event){
		            if(event.type=="click"){
		              this.pageIndex=1
		            }
		          }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/config/setList'),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.pay_btc = Number(data.data.pay_btc)
            this.dataForm.pay_lovebird = Number(data.data.pay_lovebird)
            this.dataForm.bonus_first = Number(data.data.bonus_first)
            this.dataForm.bonus_second = Number(data.data.bonus_second)
            this.dataForm.area_proxy_bonus = Number(data.data.area_proxy_bonus)
            this.dataForm.city_proxy_bonus = Number(data.data.city_proxy_bonus)
            this.dataForm.province_proxy_bonus = Number(data.data.province_proxy_bonus)
            this.dataForm.area_allowance_number = Number(data.data.area_allowance_number)
            this.dataForm.area_allowance_bonus = Number(data.data.area_allowance_bonus)
            this.dataForm.city_allowance_number = Number(data.data.city_allowance_number)
            this.dataForm.city_allowance_bonus = Number(data.data.city_allowance_bonus)
            this.dataForm.province_allowance_number = Number(data.data.province_allowance_number)
            this.dataForm.province_allowance_bonus = Number(data.data.province_allowance_bonus)
            this.dataForm.bonus_day = Number(data.data.bonus_day)
            this.dataForm.bonus_money = Number(data.data.bonus_money)
            this.dataForm.package_discount = Number(data.data.package_discount)
            this.dataForm.package_experience_discount = Number(data.data.package_experience_discount)
            this.limitPrice = Number(data.data.limitPrice)
          }
          this.dataListLoading = false
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.pay_btc <0.3){
              this.$message.error("支付币种（BTC）不能低于0.3")
              return ;
            }
            if(this.dataForm.pay_btc+this.dataForm.pay_lovebird !=1){
              this.$message.error("支付配置总和必须为1")
              return ;
            }
            let totalPrice=this.dataForm.bonus_first+this.dataForm.bonus_second+this.dataForm.province_proxy_bonus
              +this.dataForm.area_allowance_bonus+this.dataForm.city_allowance_bonus
              +this.dataForm.province_allowance_bonus+this.dataForm.bonus_money
            if(totalPrice >this.limitPrice){
              this.$message.error("最大奖金总和不得高于"+this.limitPrice+"元")
              return ;
            }
            this.$http({
              url: this.$http.adornUrl(`/sys/config/updateList`),
              method: 'post',
              params: this.$http.adornParams({
                'pay_btc': this.dataForm.pay_btc,
                'pay_lovebird': this.dataForm.pay_lovebird,
                'bonus_first': this.dataForm.bonus_first,
                'bonus_second': this.dataForm.bonus_second,
                'area_proxy_bonus': this.dataForm.area_proxy_bonus,
                'city_proxy_bonus': this.dataForm.city_proxy_bonus,
                'province_proxy_bonus': this.dataForm.province_proxy_bonus,
                'area_allowance_number': this.dataForm.area_allowance_number,
                'area_allowance_bonus': this.dataForm.area_allowance_bonus,
                'city_allowance_number': this.dataForm.city_allowance_number,
                'city_allowance_bonus': this.dataForm.city_allowance_bonus,
                'province_allowance_number': this.dataForm.province_allowance_number,
                'province_allowance_bonus': this.dataForm.province_allowance_bonus,
                'bonus_day': this.dataForm.bonus_day,
                'bonus_money': this.dataForm.bonus_money,
                'package_discount': this.dataForm.package_discount,
                'package_experience_discount': this.dataForm.package_experience_discount
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
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
