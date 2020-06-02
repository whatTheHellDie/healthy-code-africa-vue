<template>
  <el-dialog
    :title="$t( '修改密码' )"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="$t( '账号' )">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item :label="$t( '原密码' )" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '新密码' )" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '确认密码' )" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error(this.$t( '确认密码与新密码不一致' )))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: this.$t( '原密码不能为空' ), trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: this.$t( '新密码不能为空' ), trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: this.$t( '确认密码不能为空' ), trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/password'),
              method: 'post',
              data: this.$http.adornData({
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t( '操作成功' ),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      clearLoginInfo()
                      this.$router.replace({ name: 'login' })
                    })
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

