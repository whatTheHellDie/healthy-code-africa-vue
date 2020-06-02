<template>
  <div>
   <el-dialog :title="!dataForm.id ? $t('新增') : $t('修改')" v-loading.fullscreen.lock="fullscreenLoading" :inline="true" :close-on-click-modal="false" :visible.sync="visible" top="5vh" custom-class="wew" width="80%">
    <div>
  <div class="mod-demo-ueditor">
    <div style="margin: -20px 0 20px;font-size: 30px;">{{$t( '省份' )}}：{{fatherName}}</div>
    <el-button type="primary" @click="add=true" v-if="!add" style="margin-bottom: 20px;">{{$t( '新增' )}}</el-button>
<el-form ref="dataForm" :inline="true" v-else="add" :rules="dataRules" :model="dataForm" >
  
  <el-form-item :label="$t( '城市' )" prop="name">
    <el-input v-model="dataForm.name" :placeholder="$t( '请输入城市' )"></el-input>
  </el-form-item>
  <el-form-item :label="$t( '编码' )" prop="code">
    <el-input v-model="dataForm.code" :placeholder="$t( '请输入编码' )"></el-input>
  </el-form-item>
   <el-form-item>
    <el-button type="primary" v-if="!isChange" @click="update()">{{$t( '新增' )}}</el-button>
    <el-button type="primary" v-else="isChange" @click="update(changeId)">{{$t( '修改' )}}</el-button>
  </el-form-item>
</el-form>
<el-table @selection-change="selectionChangeHandle" :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" width="80" align="center" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '城市' )"  prop="name"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '编号' )"  prop="code"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="changeArea(scope.row.id,scope.row.name,scope.row.code)">{{$t( '修改' )}}</el-button>
          <el-button  type="text" size="small" @click="areaAddOrUpdateHandle(scope.row.id,scope.row.code,scope.row.name,fatherName)">{{$t( '添加区' )}}</el-button>
          <el-button  type="text" @click="deleteHandle(scope.row.id,scope.row.name)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
    </div>
    </el-dialog>
    <area-add-or-update v-if="areaAddOrUpdateVisible" ref="areaAddOrUpdate" @refreshDataList="getDataList"></area-add-or-update>
   
    
    </div>
</template>

<script>
  import AreaAddOrUpdate from './area-list-add-or-update'
  export default {
    data() {
      return {
        fatherName:"",
        areaAddOrUpdateVisible:false,
        changeId:'',
        isChange:false,
        add:false,
        fullscreenLoading:false,
        visible:true,
        dataForm:{
          id:"",
          code:"",
          name:"",
          provinceCode:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        options:[],
        dataRules: {
          code: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'blur' }
          ],
          name: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'blur' }
          ],
        },
       myValue: ""
      }
    },
    components: {
      AreaAddOrUpdate
    },
    methods: {
       // 新增 / 修改
      areaAddOrUpdateHandle(id,code,name) {
        this.areaAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.areaAddOrUpdate.init(id,code,name,this.fatherName)
        })
      },
      changeArea(id,name,code){
        this.isChange=true
        this.add=true
        this.dataForm.name=name
        this.dataForm.code=code
        this.changeId=id
      },
      update(id){
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.fullscreenLoading=true
            this.$http({
            url: this.$http.adornUrl(`/business/addrCity/${!id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              id:id||undefined,
              name:this.dataForm.name,
              code:this.dataForm.code,
              provinceCode:this.dataForm.provinceCode,
            })
          }).then(({data}) => {
            this.fullscreenLoading=false
            if (data && data.code === 200) {
              this.init()
            } else {
            this.$alert(data.msg, this.$t( '提示' ), {
              confirmButtonText: this.$t( '确定' ),
            });
          }
          })
        }
        });
      },
      init (id,provinceCode,fatherName) {
        if(fatherName){
        this.fatherName=fatherName;
        }
        this.dataForm.id = id || 0
        console.log(provinceCode)
        if(provinceCode){
        this.dataForm.provinceCode = provinceCode
        }
        this.isChange=false
        this.add=false
        this.dataForm.name=""
        this.dataForm.code=""
        this.visible = true
        this.dataList=[]
//        this.$nextTick(() => {
//          this.$refs['dataForm'].resetFields()
//        })
          this.getDataList()
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
          url: this.$http.adornUrl('/business/addrCity/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
            provinceCode:this.dataForm.provinceCode,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
            
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
            url: this.$http.adornUrl('/business/addrCity/delete'),
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

<style lang="scss">
</style>