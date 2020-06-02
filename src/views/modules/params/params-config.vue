<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  :label-width="labelWidth">
      <el-form-item :label="$t( '名称' )">
        <el-input v-model="dataForm.name" :placeholder="$t( '名称' )" clearable></el-input>
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
      <el-table-column header-align="center" align="center" :label="$t( '名称' )" prop="name">
         <template slot-scope="scope">
          <div> {{ $t(scope.row.name) }} </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '键名' )" prop="paramKey"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '键值' )" prop="paramValue"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '排序' )" prop="sort"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '备注' )" prop="remark">
        <template slot-scope="scope">
          <div> {{ $t(scope.row.remark) }} </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" fixed="right" header-align="center" align="center" width="100px"  :label="$t( '操作' )">
        <template slot-scope="scope">
          <div v-if="isAuth('sys:paramconfig:update')">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button> 
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './params-update'
  export default {
    data() {
      return {
        showPayMethod: false,
        dataForm: {
          phone:'',
          name:'',
          applicationName: '',
          projectAccount: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible:false,
      }
    },
    components: {
      AddOrUpdate
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
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
          url: this.$http.adornUrl('/sys/paramconfig/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name
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
