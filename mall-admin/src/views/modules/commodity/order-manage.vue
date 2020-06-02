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
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button v-if="isAuth('business:materialRecords:save')" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button v-if="isAuth('business:materialRecords:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
     <el-table-column prop="realname" header-align="center" align="center" width="200" :label="$t( '姓名' )">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" width="200" :label="$t( '电话' )">
      </el-table-column>
      <el-table-column prop="actualPrice" header-align="center" align="center" width="200" :label="$t( '总价' )">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" :label="$t( '下单时间' )">
      </el-table-column>
      <el-table-column prop="modifyTime" header-align="center" align="center" width="200" :label="$t( '状态' )">
        <template slot-scope="scope">
          <div v-if="!scope.row.showChange">
            <el-tag type="success" v-if="scope.row.state===1">{{$t( '已完成' )}}</el-tag>
            <el-tag type="warning" v-if="scope.row.state===2">{{$t( '未完成' )}}</el-tag>
            <el-tag type="info" v-if="scope.row.state===3">{{$t( '取消' )}}</el-tag>
            <el-button  type="text" size="small" @click="scope.row.showChange=true">{{$t( '修改状态' )}}</el-button>
          </div>
          <div v-else>
            <el-select v-model="beChangeState" :placeholder="$t('请选择')">
          <el-option v-for="item in statusOptions1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button  type="text" size="small" @click="changeStatus(scope.row.id,scope.row.state)">{{$t( '修改' )}}</el-button>
          </div>
          
          
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
           <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '查看' )}}</el-button>
          
        </template>
      </el-table-column>
    </el-table>
    
 <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    
  </div>
</template>

<script>
  import AddOrUpdate from './order-list-view'
  export default {
    data() {
      return {
        beChangeState:"",
        statusOptions:[{
          value: '',
          label: this.$t('全部')
        }, {
          value: 1,
          label: this.$t('已完成')
        },{
          value: 2,
          label: this.$t('未完成')
        } ,{
          value: 3,
          label: this.$t('取消')
        }],
        statusOptions1:[{
          value: 1,
          label: this.$t('完成')
        }, {
          value: 2,
          label: this.$t('未完成')
        } ],
        dataForm: {
          realname: '',
          state:'',
          phone:'',
        },
        addOrUpdateVisible: false,
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
    components: {
      AddOrUpdate,
    },
    methods: {
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      changeStatus(uid){
        if(this.beChangeState===""){
          return;
        }
        
         this.$confirm(this.$t('确认修改?'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          this.$http({
          url: this.$http.adornUrl('/business/storeOrder/updateStatus'),
           method: 'post',
          data: this.$http.adornData({
            'id': uid,
            'state': this.beChangeState,
          })
        }).then(({
          data
        }) => {
          this.dataListLoading = false
          if(data && data.code === 200) {
             this.$message({
            type: this.$t('success'),
            message: this.$t('操作成功!')
          });
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消')
          });          
        });
       
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
          url: this.$http.adornUrl('/business/storeOrder/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'state': this.dataForm.state,
            'realname': this.dataForm.realname,
            'phone': this.dataForm.phone,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data.data.list.forEach((item,i)=>{
              data.data.list[i].showChange=false
            })
            this.dataList = data.data.list
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
            url: this.$http.adornUrl(`/business/materialRecords/resetPassword/${id}`),
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
            url: this.$http.adornUrl('/business/materialRecords/delete'),
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