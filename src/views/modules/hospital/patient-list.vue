<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
           
       <span class="label-search">{{$t( '患者名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t( '患者名称' )" clearable></el-input>
      </el-form-item>
       <span class="label-search">{{$t( '就诊医院' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.hospital" :placeholder="$t( '就诊医院' )" clearable></el-input>
      </el-form-item>
       <div class="inb">
      <span class="label-search">{{$t( '日期' )}}</span>
      <el-date-picker
      v-model="dataForm.value"
      type="daterange"
      range-separator="-"
      :start-placeholder="$t( '开始日期' )"
      :end-placeholder="$t( '结束日期' )">
    </el-date-picker>
      </div>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
       <el-table-column prop="name" header-align="center" align="center" :label="$t( '患者姓名' )">
      </el-table-column>
     
      <el-table-column prop="sex" header-align="center" align="center" width="200" :label="$t( '性别' )">
        <template slot-scope="scope">
          <div v-if="scope.row.sex===0">{{$t( '男' )}}</div>
          <div v-if="scope.row.sex===1">{{$t( '女' )}}</div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="doctorDept" header-align="center" align="center" :label="$t( '科室' )">
      </el-table-column>
      <el-table-column prop="treatmentDate" header-align="center" align="center" width="200" :label="$t( '就诊日期' )">
      </el-table-column>
       <el-table-column prop="doctor" header-align="center" align="center" width="200" :label="$t( '就诊医生' )">
      </el-table-column>
      <el-table-column prop="hospital" header-align="center" align="center" width="200" :label="$t( '就诊医院' )">
      </el-table-column>
      <el-table-column prop="storeName" header-align="center" align="center" width="200" :label="$t( '状态' )">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.state===0">{{$t( '待处理' )}}</el-tag>
          <el-tag type="info" v-else>{{$t( '处理中' )}}</el-tag>
          <el-tag type="success" v-else>{{$t( '已处理' )}}</el-tag>
          <el-tag type="success" v-else>{{$t( '已完成' )}}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button v-if="isAuth('business:patient:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button v-if="isAuth('business:patient:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.storeName)">{{$t( '删除' )}}</el-button>
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
        vertifyOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('未使用')
        }, {
          value: 1,
          label: this.$t('已使用')
        }],
        dataForm: {
          name: '',
          phone:'',
          state:"",
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
    activated() {
      this.getDataList()
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
          url: this.$http.adornUrl('/business/patient/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name':this.dataForm.name,
            'hospital': this.dataForm.hospital,
            'startTime': this.dataForm.value[0],
            'endTime': this.dataForm.value[1],
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
            url: this.$http.adornUrl(`/business/patient/resetPassword/${id}`),
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
            url: this.$http.adornUrl('/business/patient/delete'),
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