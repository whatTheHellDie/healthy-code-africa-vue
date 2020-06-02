<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '医院名称' )}}</span>
      <el-form-item>
         <el-input v-model="dataForm.shopName" :placeholder="$t( '医院名称' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '医院类型' )}}</span>

      <el-form-item>
         <el-select v-model="dataForm.classify" :placeholder="$t('请选择')">
        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>

      <span class="label-search">{{$t( '电话' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '电话' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button v-if="isAuth('business:hospital:save')&&!hasSuperior" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button v-if="isAuth('business:hospital:delete')&&!hasSuperior" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
      
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" :class="{noselection:hasSuperior}" style="width: 100%;">
      <el-table-column :type="!hasSuperior?'selection':'index'"  header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" v-if="!hasSuperior" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" :label="$t( '医院名称' )"></el-table-column>
      <el-table-column prop="principal" header-align="center" align="center" :label="$t( '负责人' )">
      </el-table-column>
      <el-table-column prop="licenseNo" header-align="center" align="center" :label="$t( '图片' )" width="140">
        <template slot-scope="scope">
          <img :src="scope.row.photoUrl" style="width: 120px;height: 120px;" alt="" />
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="licenseNo" header-align="center" align="center" :label="$t( '执照号' )">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" :label="$t( '医院电话' )">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" :label="$t( '医院区域' )">
        <template slot-scope="scope">
          <div>{{scope.row.oneAddrName+" "+scope.row.twoAddrName+" "+scope.row.threeAddrName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" header-align="center" align="center" :label="$t( '医院地址' )"></el-table-column>
      
      
      <el-table-column prop="account" header-align="center" align="center" :label="$t( '管理员账号' )">
      </el-table-column>
      <el-table-column prop="status" v-if="!hasSuperior" header-align="center" align="center" width="150" :label="$t( '密码初始化' )">
        <template slot-scope="scope">
          <el-button type="text" @click="initPassword(scope.row.id)">{{$t( '初始化' )}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalCreationTime" header-align="center" align="center" :label="$t( '创建时间' )"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <div v-if="!hasSuperior">
          <el-button v-if="isAuth('business:hospital:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:hospital:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.name)">{{$t( '删除' )}}</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="small" @click="bindSuperior(scope.row.id,scope.row.name)">{{$t( '绑定' )}}</el-button>
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
import AddOrUpdate from './hospital-add-or-update'
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
          name: '',
          address:'',
          principal:''
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
          url: this.$http.adornUrl('/business/hospital/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
            'address': this.dataForm.address,
            'principal': this.dataForm.principal,
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
            url: this.$http.adornUrl(`/business/hospital/resetPassword/${id}`),
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
          return item.id
        })
        var userNames = userName ? [userName] : this.dataListSelections.map(item => {
          return item.name
        })
        this.$confirm(this.$t('messages.template1', [userNames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/hospital/delete'),
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