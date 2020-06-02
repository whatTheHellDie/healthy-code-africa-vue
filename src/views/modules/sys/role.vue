<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t( '角色名称' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" width="300" :label="$t( '角色名称' )">
      </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" :label="$t( '备注' )">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="200" :label="$t( '创建时间' )">
      </el-table-column>
      <el-table-column fixed="right" header-align="center"align="center" width="150" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button  type="text" size="small" @click="departmenAddOrUpdateHandle(scope.row.id,scope.row.name)">{{$t( '部门权限' )}}</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.name)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <department-add-or-update v-if="departmentAddOrUpdateVisible" ref="departmenAddOrUpdate" @refreshDataList="getDataList"></department-add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  import DepartmentAddOrUpdate from './roleDepartment-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        departmentAddOrUpdateVisible:false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      DepartmentAddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            data=data.data
            this.dataList = data.list
            this.totalPage = data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
       // 新增 / 修改
      departmenAddOrUpdateHandle (id,name) {
       
        this.departmentAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.departmenAddOrUpdate.init(id,name)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
       
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, name) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var names = name ? [name] : this.dataListSelections.map(item => {
          return item.name
        })
        this.$confirm(this.$t( 'messages.template1',[names.join(','),id ? this.$t( '删除' ) : this.$t( '批量删除' )] ), this.$t( '提示' ), {
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
