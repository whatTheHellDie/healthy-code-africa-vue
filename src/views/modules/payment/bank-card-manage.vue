<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  label-width="40px">
      <span class="label-search">{{$t( '账号' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.username" :placeholder="$t( '账号' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realName" :placeholder="$t( '姓名' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '银行名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t( '银行名称' )" clearable></el-input>
      </el-form-item>
      <div class="inb">
      <span class="label-search">{{$t( '银行卡类型' )}}</span>
      <el-select v-model="dataForm.types" :placeholder="$t('请选择')">
        <el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </div>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column header-align="center" align="center" :label="$t( '姓名' )"  prop="realName"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '账号' )"  prop="username"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '所属银行' )"  prop="name"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '银行卡账号' )"  prop="account"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '银行卡类型' )"  prop="types">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.types===0">{{$t( '储蓄卡' )}}</el-tag>
          <el-tag v-if="scope.row.types===1" type="success">{{$t( '信用卡' )}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        showPayMethod: false,
        typesOptions:[{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('储蓄卡')
        },{
          value: 1,
          label: this.$t('信用卡')
        },],
        dataForm: {
          username: '',
          realName: '',
          name:"",
          types:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        showInfoVisible: false,
        addSmsnumVisible: false,
        addOrUpdateVisible: false,
        bankReceiptVisible: false,
        applicationReceiptVisible: false,
      }
    },
    activated() {
      this.getDataList()
    },
    deactivated() {
    this.addOrUpdateVisible=false
    this.showInfoVisible=false
    this.addSmsnumVisible=false
    this.showPayMethod=false
    },
    methods: {
      // 获取数据列表
      getDataList() {
		  if(event){
		            if(event.type=="click"){
		              this.pageIndex=1
		            }
		          }
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/sys/bankcard/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.username,
            'realName': this.dataForm.realName,
            'name':this.dataForm.name,
            'types':this.dataForm.types
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
    }
  }
</script>
<style>
</style>
