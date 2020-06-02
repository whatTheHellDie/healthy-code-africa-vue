<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '预约码' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.code" :placeholder="$t( '预约码' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '姓名' )"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" :label="$t( '预约码' )">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" :label="$t( '手机号码' )">
      </el-table-column>
      <el-table-column prop="idCard" header-align="center" align="center" :label="$t( '证件号码' )">
      </el-table-column>
      <el-table-column prop="tradeName" header-align="center" align="center" :label="$t( '物资名称' )">
      </el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" :label="$t( '申领数量' )">
      </el-table-column>
      <el-table-column prop="dueTime" header-align="center" align="center" :label="$t( '过期时间' )">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.state===0" @click="receive(scope.row.id)">{{$t( '领取' )}}</el-button>
          <el-tag type="info" v-else>{{$t( '已领取' )}}</el-tag>
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.tradeName)">{{$t( '删除' )}}</el-button>-->
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
        dataForm: {
          code: ''
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
      receive(id){
        this.$confirm(this.$t( '确定设为已领取？设为领取后状态不可更改'), this.$t( '提示' ), {
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          this.$http({
              url: this.$http.adornUrl(`/business/materialSubscribe/register`),
              method: 'post',
              data: this.$http.adornData({
                'id': id,
                'state': 1,
              })
            }).then(({
              data
            }) => {
              this.dataListLoading = false
              if(data && data.code === 200) {
                this.$message({
                message: this.$t( '操作成功' ),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
              } else {
                this.$alert(data.msg, this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                });
              }
            })
            
        }).catch(() => {})
         
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
          url: this.$http.adornUrl('/business/materialSubscribe/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'code': this.dataForm.code,
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
            url: this.$http.adornUrl('/business/materialSubscribe/delete'),
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