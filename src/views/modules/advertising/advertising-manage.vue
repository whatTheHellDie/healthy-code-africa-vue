<template>
  <div class="mod-user">
     <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  label-width="40px">
       <span class="label-search">{{$t( '广告名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.title" :placeholder="$t( '广告名称' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '跳转类型' )}}</span>
      <el-select v-model="dataForm.jumpFlag" :placeholder="$t('请选择')">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button  @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="isAuth('sys:advertisement:save')" @click="addOrUpdateHandle()">{{$t( '添加' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column header-align="center" align="center" :label="$t( '广告名称' )"  prop="title"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '广告位置' )"  prop="siteFlag"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '跳转类型' )"  prop="jumpFlag"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '客户端类型' )"  prop="osName"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '链接地址' )"  prop="addressUrl"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '图片' )"  prop="img">
         <template slot-scope="scope">
           <img :src="scope.row.img" style="width:100px;height:50px;"/>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '操作时间' )"  prop="createTime"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button  type="text" v-if="isAuth('sys:advertisement:update')" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button  type="text" v-if="isAuth('sys:advertisement:delete')" size="small" @click="deleteHandle(scope.row.id,scope.row.title)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './advertising-add-or-update'
  export default {
    data() {
      return {
        dataForm:{
          'title': '',
          'jumpFlag': ''
        },
        showPayMethod: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        showInfoVisible: false,
        addOrUpdateVisible: false,
        options:[{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: 'h5'
        }, {
          value: 1,
          label: 'app'
        } ],
      }
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    deactivated() {
    this.addOrUpdateVisible=false
    this.showInfoVisible=false
    this.addSmsnumVisible=false
    this.showPayMethod=false
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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
          url: this.$http.adornUrl('/sys/advertisement/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'title': this.dataForm.title,
            'jumpFlag': this.dataForm.jumpFlag
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data.page.list.forEach((item,i)=>{
              switch(item.siteFlag){
              case 0:data.page.list[i].siteFlag=this.$t( '首页' );break;
            }
              switch(item.jumpFlag){
              case 0:data.page.list[i].jumpFlag="h5";break;
              case 1:data.page.list[i].jumpFlag="app";break;
            }
            })
            
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
            url: this.$http.adornUrl('/sys/advertisement/delete'),
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
