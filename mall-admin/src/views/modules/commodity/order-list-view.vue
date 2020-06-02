<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog order-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="goodsName" header-align="center" align="center" :label="$t( '名称' )">
      </el-table-column>
      <el-table-column prop="portrait" header-align="center" align="center" width="200" :label="$t( '图片' )">
        <template slot-scope="scope">
          <img :src="scope.row.portrait" style="width: 120px;height: 120px;"/>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" width="200" :label="$t( '单价' )">
      </el-table-column>
      <el-table-column prop="number" header-align="center" align="center" width="200" :label="$t( '数量' )">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        fullscreenLoading: false,
        see: false,
        visible: false,
        dataForm: {
          uid: "",
        },
        dataList: []
      }
    },
    computed: {
      labelWidth() {
        switch(window.localStorage.language) {
          case 'zh-cn':
            return '200px';
          case 'en':
            return '242px'
        }
      }
    },
    methods: {
      init(uid) {
        this.dataForm.uid = uid || 0;
        this.visible = true
        this.fullscreenLoading = true
        if(this.dataForm.uid) {
          this.$http({
            url: this.$http.adornUrl(`/business/storeOrder/info/${this.dataForm.uid}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            this.fullscreenLoading = false
            if(data && data.code === 200) {
              this.dataList = data.data
            } else {
              this.$alert(data.msg, this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
            }
          })
        }
      },
    }
  }
</script>

<style scoped="scoped" lang="scss">
  .el-form-item {
    margin-bottom: 0;
  }
  
  .id-card {
    position: relative;
    .del {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 24px;
      cursor: pointer;
      opacity: 0.8;
    }
    .add {
      width: 375px;
      background-image: url(/static/img/ic_add_icon@2x.png);
      background-repeat: no-repeat;
      background-color: #f0f0f0;
      background-position: center center;
    }
    .add-img {
      max-width: 375px;
    }
    input {
      appearance: none;
      position: absolute;
      width: 375px;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>