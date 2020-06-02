<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
       <span class="label-search">{{$t( '所属医院' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.hospital" :placeholder="$t( '所属医院' )" clearable></el-input>
      </el-form-item>    
      <span class="label-search">{{$t( '医生名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t( '医生名称' )" clearable></el-input>
      </el-form-item>
       <span class="label-search">{{$t( '科室名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.dept" :placeholder="$t( '科室名称' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '职位' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.station" :placeholder="$t( '职位' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
       <el-table-column prop="name" header-align="center" align="center" :label="$t( '医生名称' )">
      </el-table-column>
       <el-table-column prop="sex" header-align="center" align="center" width="200" :label="$t( '性别' )">
         <template slot-scope="scope">
          <div v-if="scope.row.sex===0">{{$t( '男' )}}</div>
          <div v-if="scope.row.sex===1">{{$t( '女' )}}</div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="education" header-align="center" align="center" width="200" :label="$t( '学历' )">
      </el-table-column>
      <el-table-column prop="dept" header-align="center" align="center" width="200" :label="$t( '科室' )">
      </el-table-column>
      <el-table-column prop="station" header-align="center" align="center" :label="$t( '职位' )">
      </el-table-column>
      <el-table-column prop="skilledIn" header-align="center" align="center" :label="$t( '擅长内容' )">
      </el-table-column>
      <el-table-column prop="hospital" header-align="center" align="center" :label="$t( '所属医院' )">
      </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" :label="$t( '备注' )">
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
        dataForm: {
          name:'',
          dept: '',
          station:"",
          hospital:"",
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
    },
    components: {
      AddOrUpdate,
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
          url: this.$http.adornUrl('/business/doctor/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
            'station': this.dataForm.station,
            'hospital': this.dataForm.hospital,
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
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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
            url: this.$http.adornUrl('/business/doctor/delete'),
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