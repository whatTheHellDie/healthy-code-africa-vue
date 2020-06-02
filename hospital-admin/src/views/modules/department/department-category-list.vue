<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  label-width="40px">
      <span class="label-search">{{$t( '名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.addrName" :placeholder="$t( '名称' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  v-if="isAuth('business:address:save')" @click="addOrUpdateHandle(undefined,true)">{{$t( '添加科室分类' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table class="show-table" :data="dataList" border style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <table-tree-column prop="addrName" header-align="center" treeKey="menuId" :label="$t( '名称' )">
      </table-tree-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('business:address:save')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id,false)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:address:save')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.types)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
   <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
   <location-add-or-update v-if="locationAddOrUpdateVisible" ref="LocationAddOrUpdate" @refreshDataList="getDataList"></location-add-or-update>

  </div>
</template>
<script>
  import AddOrUpdate from './department-category-add-or-update.vue'
  import TableTreeColumn from '@/components/table-tree-column'
import { treeDataTranslate } from '@/utils'
  export default {
    data() {
      return {
        typesOptions:[],
        addOrUpdateVisible:false,
        
        showPayMethod: false,
        dataForm: {
          types: '',
          content: '',
          addrName:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
      }
    },
    components: {
      AddOrUpdate,
      TableTreeColumn
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 新增 / 修改
      cityAddOrUpdateHandle(id) {
        this.cityAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.cityAddOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id,isAdd) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,isAdd)
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
        this.$http({
          url: this.$http.adornUrl('/business/address/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            addrName:this.dataForm.addrName,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.totalPage = data.data.totalCount
            data=data.data
          data.forEach(function(item,i){
            
            data[i].menuId=item.id
            data[i].perms=""
            data[i].url=""
            
          })
          
          this.dataList = treeDataTranslate(data, 'menuId')
            
            
          } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 删除
      deleteHandle (id, userName) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var userNames = userName ? [userName] : this.dataListSelections.map(item => {
          switch(item.types){
            case 0: return '用户协议';
            case 1: return '银行协议';
            case 2: return '支付协议';
          }
        })
        this.$confirm(this.$t( 'messages.template1',[userNames.join(','),id ? this.$t( '删除' ) : this.$t( '批量删除' )] ), this.$t( '提示' ), {
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/address/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t( '操作成功' ),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }  else {
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
    }
  }
</script>
<style>
</style>
