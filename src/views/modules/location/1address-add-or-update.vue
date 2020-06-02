<template>
  <el-dialog :title="!dataForm.id ? $t('新增') : $t('修改')" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible" top="5vh" custom-class="wew" width="80%">
    <div>
      <div class="mod-demo-ueditor">
        <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="80px">
          <el-form-item :label="$t( '省份' )" prop="provinceCode">
            <el-select v-model="dataForm.provinceCode" :placeholder="$t('请选择')" @change="setCity">
              <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t( '城市' )" prop="cityCode">
            <el-select v-model="dataForm.cityCode" :placeholder="$t('请选择')" @change="setArea">
              <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t( '地区' )" prop="areaCode">
            <el-select v-model="dataForm.areaCode" :placeholder="$t('请选择')">
              <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t( '详细地址' )" prop="location">
            <el-input v-model="dataForm.location" :placeholder="$t( '详细地址' )" clearable></el-input>
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
  export default {
    data() {
      return {
        province: [],
        city: [],
        area: [],
        fullscreenLoading: false,
        typesOptions: [{
          value: 0,
          label: this.$t('用户协议'),
        }, {
          value: 1,
          label: this.$t('银行协议'),
        }, {
          value: 2,
          label: this.$t('支付协议'),
        }, ],
        visible: false,
        dataForm: {
          id: "",
          provinceCode: "",
          cityCode: "",
          areaCode: "",
          location :""
        },
        dataRules: {
          provinceCode: [{
            required: true,
            message: this.$t('省份不能为空'),
            trigger: 'blur'
          }],
          cityCode: [{
            required: true,
            message: this.$t('城市不能为空'),
            trigger: 'blur'
          }],
          location: [{
            required: true,
            message: this.$t('详细地址不能为空'),
            trigger: 'blur'
          }],
        },
        myValue: ""
      }
    },
    methods: {
      setArea() {
        var data = this.city
        data.forEach((item, i) => {
          if(data[i].value == this.dataForm.cityCode) {
            this.area = data[i].children
          }
        })
      },
      setCity() {
        var data = this.province
        data.forEach((item, i) => {
          if(data[i].value == this.dataForm.provinceCode) {
            this.city = data[i].children
          }
        })
      },
      update() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true;
            this.$http({
              url: this.$http.adornUrl(`/business/address/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id ? this.dataForm.id : undefined,
                provinceCode: this.dataForm.provinceCode,
                cityCode: this.dataForm.cityCode,
                areaCode: this.dataForm.areaCode,
                location: this.dataForm.location,
                
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false;
              if(data && data.code === 200) {
                this.visible = false;
                this.$emit('refreshDataList')
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
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })

        this.$http({
          url: this.$http.adornUrl('/business/address/selectAddress'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data = data.data
            data.forEach((item, i) => {
              data[i].value = item.code
              data[i].label = item.name
              data[i].children.forEach((itemx, j) => {
                if(itemx.code && itemx.name) {
                  data[i].children[j].value = itemx.code
                  data[i].children[j].label = itemx.name
                  data[i].children[j].children.forEach((itemy, k) => {
                    if(itemy.code && itemy.name) {
                      data[i].children[j].children[k].value = itemy.code
                      data[i].children[j].children[k].label = itemy.name
                    }
                  })
                }
              })
            })
            this.province = data
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
        if(!this.dataForm.id) {

        } else {
          this.$http({
            url: this.$http.adornUrl(`/business/address/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              data=data.data;
              this.dataForm.provinceCode=data.provinceCode
              this.setCity()
              this.dataForm.cityCode=data.cityCode
              this.setArea()
              this.dataForm.areaCode=data.areaCode
              this.dataForm.location=data.location
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