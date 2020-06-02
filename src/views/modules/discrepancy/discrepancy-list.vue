<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  :label-width="labelWidth">
      <el-form-item :label="$t( '姓名' )">
        <el-input v-model="dataForm.realname" :placeholder="$t( '姓名' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '姓名' )"></el-table-column>
      <el-table-column prop="gender" header-align="center" align="center" :label="$t( '性别' )">
        <template slot-scope="scope">
          <div v-if="scope.row.gender===0">{{$t( '男' )}}</div>
          <div v-if="scope.row.gender===1">{{$t( '女' )}}</div>
        </template>
      </el-table-column>
       
      <el-table-column header-align="center" align="center" :label="$t( '身份证号码' )"  prop="idCard"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '手机号码' )"  prop="phone"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '家庭住址' )"  prop="homeAddress"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '出入地址' )"  prop="detailedAddr"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '时间' )"  prop="createTime"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        statusOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('通过')
        }, {
          value: 1,
          label: this.$t('未通过')
        },{
          value: 1,
          label: this.$t('待审核')
        },
        ],
        showPayMethod: false,
        dataForm: {
          realname:'',
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
    computed: {
      labelWidth(){
        switch(window.localStorage.language){
          case 'zh-cn':return '40px';
          case 'en':return '80px'
        }
      }
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
        this.bankReceiptVisible = false;
        this.applicationReceiptVisible = false;
        this.$http({
          url: this.$http.adornUrl('/business/accessInfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            realname:this.dataForm.realname
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
            
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
