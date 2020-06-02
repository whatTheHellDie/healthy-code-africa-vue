<template>
  <el-dialog :title="$t( '查看' )" class="review-dialog" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible">
  <div class="mod-user">
    
    <div class="manager-wrap">
        <div class="company-tree company-tree1">
          
          <el-input :placeholder="$t( '查询')" v-model="filterText">
          </el-input>
          <div class="expand" @click="changeTree">{{$t( '展开/收缩' )}}</div>
          <el-tree :data="departmentList" :props="departmentListTreeProps" node-key="menuId" ref="departmentListTree" @current-change="departmentListTreeCurrentChangeHandle" :default-expand-all="expand" :highlight-current="true" :filter-node-method="filterNode" :expand-on-click-node="false">
          </el-tree>
        </div>
        <div style="width: 100%;">
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" :placeholder="$t( '用户名' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
      <el-table-column prop="username" header-align="center" align="center" :label="$t( '用户名' )">
      </el-table-column>
      <el-table-column prop="deptName" header-align="center" align="center" :label="$t( '部门' )">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center"  :label="$t( '状态' )">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">{{$t( '正常' )}}</el-tag>
          <el-tag v-else size="small" type="danger">{{$t( '禁用' )}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center"  :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="bindUser(scope.row.id)">{{$t( '绑定' )}}</el-button>
          <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.username)">{{$t( '删除' )}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    </div>
</div>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>


    
    <!-- 弹窗, 新增 / 修改 -->
  </div>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data() {
      return {
        fullscreenLoading:false,
        visible: false,
        filterText: '',
        expand: true,
        departmentList: [],
        departmentListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          userName: '',
          userId:""
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
    watch: {
      filterText(val) {
        this.$refs.departmentListTree.filter(val);
      }
    },
    methods: {
      bindUser(id) {
        this.fullscreenLoading = true
        this.$http({
          url: this.$http.adornUrl('/business/users/bindAdmin'),
          method: 'post',
          data: this.$http.adornData({
            'userId': this.dataForm.userId,
            'adminId': this.dataForm.id,
          })
        }).then(({
          data
        }) => {
          this.fullscreenLoading = false
          if(data && data.code === 200) {
            this.$message({
                  message: this.$t('操作成功'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
      init(userId) {
        this.dataForm.userId=userId||0;
        this.visible = true;
        this.initTree()
      this.getDataList()
      },
      initTree(id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dept/treeData'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          data.data.forEach(function(item, i) {
            data.data[i].menuId = item.id
          })
          this.departmentList = treeDataTranslate(data.data, 'menuId')
        }).then(() => {
          //        this.visible = true
          //        this.$nextTick(() => {
          //          this.$refs['dataForm'].resetFields()
          //        })
        }).then(() => {

          if(!this.dataForm.id) {
            // 新增
            this.departmentListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              data.data.menuId = data.data.id
              this.dataForm.id = data.data.menuId
              this.dataForm.name = data.data.name
              this.dataForm.parentId = data.data.parentId
              this.dataForm.orderNum = data.data.sort
              this.dataForm.status = data.data.status
              this.departmentListTreeSetCurrentNode()
            })
          }
        })
      },
      changeTree() {
        this.expand = !this.expand

        for(let i = 0; i < this.departmentList.length; i++) {
          if(this.expand) {
            // 将没有转换成树的原数据设置key为... 的展开
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = true
          } else {
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = false
          }
        }

      },
      filterNode(value, data) {
        if(!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // 菜单树选中
      departmentListTreeCurrentChangeHandle(data, node) {
        this.dataForm.parentId = data.menuId
        this.dataForm.parentName = data.name
        this.getDataList()
      },
      // 菜单树设置当前选中节点
      departmentListTreeSetCurrentNode() {
        this.$refs.departmentListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.departmentListTree.getCurrentNode() || {})['name']
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
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName,
            deptId:this.dataForm.parentId
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data = data.data
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
    }
  }
</script>