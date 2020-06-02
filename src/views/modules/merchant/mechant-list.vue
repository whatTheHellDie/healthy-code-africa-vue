<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  :label-width="labelWidth">
      <!--<el-form-item :label="$t( '区域' )">
        <el-input v-model="dataForm.detailedAddr" :placeholder="$t( '区域' )" clearable></el-input>
      </el-form-item>-->
      <span class="label-search">{{$t( '审核状态' )}}</span>
        <el-select v-model="dataForm.state" :placeholder="$t( '请选择' )">
    <el-option
      v-for="item in statusOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '申请人' )"></el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" :label="$t( '申请人电话' )"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '负责人姓名' )" prop="ownerName"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '负责人号码' )" prop="ownerPhone"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '负责人证件号码' )" prop="ownerIdCard"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="100px"  :label="$t( '状态' )">
        <template slot-scope="scope">
          <div>
            <el-tag type="warning" v-if="scope.row.state==0">{{$t( '待审核' )}}</el-tag>
            <el-tag type="success" v-if="scope.row.state==1">{{$t( '通过' )}}</el-tag>
            <el-tag type="danger" v-if="scope.row.state==2">{{$t( '未通过' )}}</el-tag>
            </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '详细地址' )" prop="detailedAddr"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '申请时间' )" prop="createTime"></el-table-column>
      <el-table-column prop="status" fixed="right" header-align="center" align="center"  :label="$t( '操作' )">
         <template slot-scope="scope">
          <div>
          <el-button type="text" @click="addOrUpdateHandle(scope.row.uid)">{{$t( '查看' )}}</el-button> 
          <el-button type="text" v-if="scope.row.state==0" @click="review(scope.row.uid,1)">{{$t( '通过' )}}</el-button> 
          <el-button type="text" v-if="scope.row.state==0" @click="review(scope.row.uid,2)">{{$t( '不通过' )}}</el-button>
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
  import AddOrUpdate from './mechant-review'
  export default {
    data() {
      return {
        addOrUpdateVisible:false,
        statusOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('待审核')
        }, {
          value: 1,
          label: this.$t('通过')
        },{
          value: 2,
          label: this.$t('未通过')
        },
        ],
        showPayMethod: false,
        dataForm: {
          review:'',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        showInfoVisible: false,
        addSmsnumVisible: false,
        addOrUpdateVisible: false,
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
    components: {
      AddOrUpdate,
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
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      review(uid,state){
        this.$http({
          url: this.$http.adornUrl('/business/publicPlace/review'),
           method: 'post',
          data: this.$http.adornData({
            'uid': uid,
            'state': state,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
        })
      },
      toDetail(id){
        if(!this.isAuth('sys:users:list')){return;}
        this.$router.push({path:'user-detail',query:{id:id}})
      },
      // 获取数据列表
      getDataList() {
		  if(event){
		            if(event.type=="click"){
		              this.pageIndex=1
		            }
		          }
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/business/publicPlace/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'state': this.dataForm.state,
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
