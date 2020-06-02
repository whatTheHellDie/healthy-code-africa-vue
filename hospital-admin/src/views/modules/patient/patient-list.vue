<template>
  <!--门诊管理  患者列表-->
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
           
       <span class="label-search">{{$t( '患者姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realname" :placeholder="$t( '患者姓名' )" clearable></el-input>
      </el-form-item>
       <span class="label-search">{{$t( '预约号' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '预约号' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '就诊编号' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '就诊编号' )" clearable></el-input>
      </el-form-item>
      <div class="inb">
      <span class="label-search">{{$t( '状态' )}}</span>
      <el-select v-model="dataForm.state" :placeholder="$t('请选择')">
        <el-option v-for="item in vertifyOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </div>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
       <el-table-column prop="shopName" header-align="center" align="center" :label="$t( '患者姓名' )">
      </el-table-column>
     
      <el-table-column prop="realname" header-align="center" align="center" width="200" :label="$t( '性别' )">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" :label="$t( '科室' )">
      </el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" width="200" :label="$t( '预约时间' )">
      </el-table-column>
       <el-table-column prop="couponName" header-align="center" align="center" width="200" :label="$t( '预约医生' )">
      </el-table-column>
      <el-table-column prop="dueTime" header-align="center" align="center" width="200" :label="$t( '预约号码' )">
      </el-table-column>
      <el-table-column prop="storeName" header-align="center" align="center" width="200" :label="$t( '状态' )">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.state===0">{{$t( '预约成功' )}}</el-tag>
          <el-tag type="info" v-else>{{$t( '待就诊' )}}</el-tag>
          <el-tag type="success" v-else>{{$t( '就诊中' )}}</el-tag>
          <el-tag type="success" v-else>{{$t( '完成' )}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="callPatient(scope.row.id)">{{$t( '叫号' )}}</el-button>
          <!--<el-button v-if="isAuth('business:storeCouponUser:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:storeCouponUser:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.storeName)">{{$t( '删除' )}}</el-button>-->
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
        vertifyOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('预约成功')
        }, {
          value: 1,
          label: this.$t('待就诊')
        },{
          value: 2,
          label: this.$t('就诊中')
        },{
          value: 2,
          label: this.$t('完成')
        },],
        dataForm: {
          realname: '',
          phone:'',
          state:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
      }
    },
    activated() {
      this.getDataList()
    },
    methods: {
      //呼叫病患
      callPatient(id) {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/business/users/updateFrozen'),
          method: 'post',
          data: this.$http.adornData({
            'userId': id,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataListLoading = false;
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
      // 获取数据列表
      getDataList() {
      if(event){
                if(event.type=="click"){
                  this.pageIndex=1
                }
              }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/business/storeCouponUser/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'realname': this.dataForm.realname,
            'phone': this.dataForm.phone,
            'state': this.dataForm.state,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data = data.data
            this.dataList = data.list
            this.totalPage = data.totalCount
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
          this.dataListLoading = false
        })
      },
      initPassword(id){
        this.$confirm(this.$t( '确定要初始化密码？' ), this.$t( '提示' ), {
           confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/business/storeCouponUser/resetPassword/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              this.$message({
                message: this.$t('操作成功'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }else{
              this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
            }
          })
        }).catch(() => {})
        
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
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle(id, realname) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        var realnames = realname ? [realname] : this.dataListSelections.map(item => {
          return item.storeName
        })
        this.$confirm(this.$t('messages.template1', [realnames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/storeCouponUser/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
              this.$message({
                message: this.$t('操作成功'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>