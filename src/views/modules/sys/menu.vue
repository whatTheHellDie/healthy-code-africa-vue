<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table class="show-table" :data="dataList" border style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <table-tree-column prop="name" header-align="center" treeKey="menuId" width="200" :label="$t( '名称' )">
      </table-tree-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="150" :label="$t( '上级菜单' )">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="120" :label="$t( '图标' )">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" width="120" :label="$t( '类型' )">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">{{$t( '目录' )}}</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">{{$t( '菜单' )}}</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">{{$t( '按钮' )}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" width="120" :label="$t( '排序' )">
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center" width="250":show-overflow-tooltip="true" :label="$t( '菜单URL' )">
      </el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" :show-overflow-tooltip="true" :label="$t( '授权标识' )">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="phone-table">
      <div class="tr" v-for="item,i in dataList">
        <phone-column :prop="item.name" :label="名称"></phone-column>
        <phone-tree-column prop="item.name" treeKey="menuId" :label="名称"></phone-tree-column>
        <phone-column :prop="item.parentName" :label="上级菜单"></phone-column>
        <phone-column :label="图标" :data="dataList" :index="i">
          <template slot-scope="scope">
            <icon-svg :name="scope.row.icon || ''"></icon-svg>
          </template>
        </phone-column>
        <phone-column :label="类型" :data="dataList" :index="i">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
          </template>
        </phone-column>
        <phone-column :prop="item.orderNum" :label="排序"></phone-column>
        <phone-column :prop="item.url" :label="菜单URL"></phone-column>
        <phone-column :prop="item.perms" :label="授权标识"></phone-column>
        <phone-column :label="操作" :data="dataList" :index="i">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
            <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
          </template>
        </phone-column>
      </div>
    </div>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          this.dataList = treeDataTranslate(data, 'menuId')
          console.log( this.dataList)
          this.dataListLoading = false
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
      deleteHandle (id) {
        this.$confirm(this.$t( 'messages.template1',['id='+id,this.$t( '删除' )] ), this.$t( '提示' ), {
           confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
