<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realname" :placeholder="$t( '姓名' )" clearable></el-input>
      </el-form-item>
       <span class="label-search">{{$t( '电话' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '电话' )" clearable></el-input>
      </el-form-item>
      <div class="inb">
        <span class="label-search">{{$t( '状态' )}}</span>
        <el-select v-model="dataForm.state" :placeholder="$t('请选择')">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '申领人' )"></el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" :label="$t( '联系号码' )">
      </el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" :label="$t( '金额' )">
      </el-table-column>
      <el-table-column prop="couponName" header-align="center" align="center" :label="$t( '优惠券名称' )">
      </el-table-column>
      <el-table-column prop="dueTime" header-align="center" align="center" :label="$t( '有效期' )">
      </el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" :label="$t( '优惠券状态' )">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state===0">{{$t( '未使用' )}}</el-tag>
          <el-tag type="info" v-else>{{$t( '已使用' )}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    
 <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        statusOptions:[{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('未使用')
        }, {
          value: 1,
          label: this.$t('使用')
        } ],
        dataForm: {
          state: '',
          realname:"",
          phone:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
      }
    },
    activated() {
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
          this.dataListLoading = false
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
      // 删除
      deleteHandle(id, userName) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        var userNames = userName ? [userName] : this.dataListSelections.map(item => {
          return item.tradeName
        })
        this.$confirm(this.$t('messages.template1', [userNames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
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