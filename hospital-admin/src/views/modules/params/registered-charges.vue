<template>
  <!--住院管理  出院记录-->
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
     
      <el-row>
        <div class="inb">
          <span class="label-search">{{$t( '普通医生' )}}</span>
          <el-form-item>
            <el-input v-model="dataForm.realname" clearable></el-input>
            <span class="unit">F</span>
          </el-form-item>
        </div>
        <div class="inb">
          <span class="label-search">{{$t( '主治医生' )}}</span>
          <el-form-item>
            <el-input v-model="dataForm.realname" clearable></el-input>
            <span class="unit">F</span>
          </el-form-item>
        </div>
        <div class="inb">
          <span class="label-search">{{$t( '主任' )}}</span>
          <el-form-item>
            <el-input v-model="dataForm.realname" clearable></el-input>
            <span class="unit">F</span>
          </el-form-item>
        </div>
        <div class="inb">
          <span class="label-search">{{$t( '副主任' )}}</span>
          <el-form-item>
            <el-input v-model="dataForm.realname" clearable></el-input>
            <span class="unit">F</span>
          </el-form-item>
        </div>
        <div class="inb">
          <span class="label-search">{{$t( '专家' )}}</span>
          <el-form-item>
            <el-input v-model="dataForm.realname" clearable>6</el-input>
            <span class="unit">F</span>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <el-button type="success" @click="getDataList()">{{$t( '保存' )}}</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        realname: "",
        phone: "",
        state: ""
      },
      addOrUpdateVisible: false
    };
  },
  methods: {
    //呼叫病患
    callPatient(id) {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/business/users/updateFrozen"),
        method: "post",
        data: this.$http.adornData({
          userId: id
        })
      }).then(({ data }) => {
        this.dataListLoading = false;
        if (data && data.code === 200) {
          this.getDataList();
        } else {
          this.$alert(data.msg, this.$t("提示"), {
            confirmButtonText: this.$t("确定")
          });
        }
      });
    },
    initPassword(id) {
      this.$confirm(this.$t("确定要初始化密码？"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              `/business/storeCouponUser/resetPassword/${id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t("操作成功"),
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$alert(data.msg, this.$t("提示"), {
                confirmButtonText: this.$t("确定")
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.el-input {
  width: 60%
}
.unit{
  margin-left: 5px;
}
</style>