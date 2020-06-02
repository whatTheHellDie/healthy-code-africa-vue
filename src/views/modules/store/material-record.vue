<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
            <span class="label-search">{{$t( '用户名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realname" :placeholder="$t( '用户名' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '机构名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.storeName" :placeholder="$t( '机构名称' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
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
       <el-table-column prop="realname" header-align="center" align="center" :label="$t( '申领人' )">
      </el-table-column>
     
      <el-table-column prop="phone" header-align="center" align="center" width="200" :label="$t( '联系电话' )">
      </el-table-column>
      <el-table-column prop="idCard" header-align="center" align="center" :label="$t( '证件号码' )">
      </el-table-column>
      <el-table-column prop="tradeName" header-align="center" align="center" width="200" :label="$t( '物资名称' )">
      </el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" width="200" :label="$t( '数量' )">
      </el-table-column>
      <el-table-column prop="storeName" header-align="center" align="center" width="200" :label="$t( '机构名称' )">
      </el-table-column>
      <!--<el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('business:materialRecords:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:materialRecords:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.storeName)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>-->
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
          realname: '',
          storeName:''
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
      console.log(this.$router)
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
          url: this.$http.adornUrl('/business/materialRecords/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'realname': this.dataForm.realname,
            'storeName': this.dataForm.storeName,
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