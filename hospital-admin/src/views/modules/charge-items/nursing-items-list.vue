<template>
    <!--收费项目  护理项目列表-->
  <div class="mod-user">
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '护理名称' )}}</span>
      <el-form-item>
         <el-input v-model="dataForm.shopName" :placeholder="$t( '项目名称' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '国家' )}}</span>
      <el-form-item>
         <el-input v-model="dataForm.shopName" :placeholder="$t( '国家' )" clearable></el-input>
      </el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button v-if="isAuth('business:store:save')" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button v-if="isAuth('business:store:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="shopName" header-align="center" align="center" :label="$t( '护理名称' )">
      </el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '价格' )"></el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '服务设施编号' )"></el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '国家' )">
      </el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '单位' )">
      </el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" width="200" :label="$t( '厂家' )">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('business:store:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '查看' )}}</el-button>
          <el-button v-if="isAuth('business:store:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '添加或修改病例' )}}</el-button>
          <!--<el-button v-if="isAuth('business:store:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.shopName)">{{$t( '删除' )}}</el-button>-->
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
import AddOrUpdate from './nursing-items-add-or-update'
  export default {
    data() {
      return {
         hasSuperior:false,//拥有上级嵌套
        classifyOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('美食')
        }, {
          value: 1,
          label: this.$t('果蔬')
        },{
          value: 2,
          label: this.$t('超市')
        },{
          value: 3,
          label: this.$t('医药')
        }, ],
        dataForm: {
          storeName: '',
          classify:'',
          phone:'',
          value:""
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
    methods: {
      bindSuperior(id,name){//修改轮播图医院id和，名字
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
          url: this.$http.adornUrl('/business/store/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'shopName': this.dataForm.shopName,
            'classify': this.dataForm.classify,
            'phone': this.dataForm.phone,
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
            url: this.$http.adornUrl(`/business/store/resetPassword/${id}`),
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
      deleteHandle(id, userName) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var userNames = userName ? [userName] : this.dataListSelections.map(item => {
          return item.shopName
        })
        this.$confirm(this.$t('messages.template1', [userNames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/store/delete'),
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