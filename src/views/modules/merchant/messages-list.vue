<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  label-width="40px">
      <span class="label-search">{{$t( '标题' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.title" :placeholder="$t( '标题' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '内容' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.content" :placeholder="$t( '内容' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  @click="getDataList()">{{$t( '搜索' )}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"   @click="addOrUpdateHandle()">{{$t( '添加' )}}</el-button>
        <el-button v-if="isAuth('sys:messages:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table @selection-change="selectionChangeHandle" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" width="80" align="center" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '标题' )"  prop="title"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '内容' )"  prop="content">
        <template slot-scope="scope">
          <div class="help-content" :title="scope.row.content">{{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '发送时间' )"  prop="createTime"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '发送人' )"  prop="creatorName"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '语言' )"  prop="language">
        <template slot-scope="scope">
          <div v-if="scope.row.language==='fr_FR'">Français</div>
          <div v-if="scope.row.language==='en_US'">English</div>
          <div v-if="scope.row.language==='zh_CN'">中文</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:messages:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('sys:messages:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.title)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './messages-add-or-update'
  export default {
    data() {
      return {
        addOrUpdateVisible:false,
        showPayMethod: false,
        dataForm: {
          title: '',
          content: ''
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
      AddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
       // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 获取数据列表
       getDataList() {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/sys/messages/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'title': this.dataForm.title,
            'content': this.dataForm.content
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            
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
          return item.title
        })
        this.$confirm(this.$t( 'messages.template1',[userNames.join(','),id ? this.$t( '删除' ) : this.$t( '批量删除' )] ), this.$t( '提示' ), {
          confirmButtonText: this.$t( '确定' ),
          cancelButtonText: this.$t( '取消' ),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/messages/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
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
