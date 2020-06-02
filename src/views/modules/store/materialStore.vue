<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '用户名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.userName" :placeholder="$t( '用户名' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button v-if="isAuth('business:materialStore:save')&&!hasSuperior" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button v-if="isAuth('business:materialStore:delete')&&!hasSuperior" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" :class="{noselection:hasSuperior}" style="width: 100%;">
      <el-table-column :type="!hasSuperiorselection?'selection':'index'" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column v-if="!hasSuperior" prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="storeName" header-align="center" align="center" :label="$t( '门店名称' )">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="150" :label="$t( '门店区域' )">
        <template slot-scope="scope">
          <div>{{scope.row.oneAddrName+" "+scope.row.twoAddrName+" "+scope.row.threeAddrName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="detailedAddr" header-align="center" align="center" :label="$t( '详细地址' )">
      </el-table-column>
      <el-table-column prop="account" header-align="center" align="center" width="200" :label="$t( '登陆账号' )">
      </el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '联系人' )">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" width="200" :label="$t( '手机' )">
      </el-table-column>
      <el-table-column v-if="!hasSuperior" prop="status" header-align="center" align="center" width="150" :label="$t( '密码初始化' )">
        <template slot-scope="scope">
          <el-button type="text" @click="initPassword(scope.row.id)">{{$t( '初始化' )}}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <div v-if="!hasSuperior">
          <el-button v-if="isAuth('business:materialStore:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:materialStore:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.storeName)">{{$t( '删除' )}}</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="small" @click="bindSuperior(scope.row.id,scope.row.storeName)">{{$t( '绑定' )}}</el-button>
          </div>
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
import AddOrUpdate from './materialStore-add-or-update'
  export default {
    data() {
      return {
        hasSuperior:false,//拥有上级嵌套
        dataForm: {
          userName: ''
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
    components: {
      AddOrUpdate,
    },
    activated() {
      this.getDataList()
    },
    watch: {
      filterText(val) {
        this.$refs.departmentListTree.filter(val);
      }
    },
    methods: {
      bindSuperior(id,name){//修改轮播图物料id和，名字
        console.log(id,name)
         this.$emit("getInfomation", id, name);
      },
      init(){
        this.getDataList()
        this.hasSuperior=true
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
          url: this.$http.adornUrl('/business/materialStore/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'storeName': this.dataForm.userName,
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
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`/business/materialStore/resetPassword/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            this.dataListLoading = false
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
      deleteHandle(id, userName) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        var userNames = userName ? [userName] : this.dataListSelections.map(item => {
          return item.storeName
        })
        this.$confirm(this.$t('messages.template1', [userNames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/materialStore/delete'),
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