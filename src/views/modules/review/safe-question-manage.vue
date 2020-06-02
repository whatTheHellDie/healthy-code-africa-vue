<template>
  <div class="mod-user">
     <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"  label-width="40px">
       <span class="label-search">{{$t( '账号' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.account" :placeholder="$t( '账号' )" clearable></el-input>
      </el-form-item>
       <span class="label-search">{{$t( '姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t( '姓名' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '审批' )}}</span>
      <el-select v-model="dataForm.status" :placeholder="$t('请选择')">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="inb">
      <span class="label-search">{{$t( '操作时间' )}}</span>
      <el-date-picker v-model="time2" type="daterange" @change="getDetailTime" :range-separator="$t( '至' )" :start-placeholder="$t( '开始日期' )" :end-placeholder="$t( '结束日期' )"></el-date-picker>
      </div>
      <el-form-item>
        <el-button  @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column header-align="center" align="center" :label="$t( '账号' )"  prop="account"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '姓名' )"  prop="name"></el-table-column>
      <!--<el-table-column header-align="center" align="center" :label="$t( '身份证正面' )"  prop="img">
         <template slot-scope="scope">
           <img :src="scope.row.frontPicture" style="width:100px;height:50px;"/>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '身份证背面' )"  prop="img">
         <template slot-scope="scope">
           <img :src="scope.row.backPicture" style="width:100px;height:50px;"/>
        </template>
      </el-table-column>-->
      <el-table-column header-align="center" align="center" :label="$t( '审批' )"  prop="status">
        <template slot-scope="scope">
           <el-tag type="warning" v-if="scope.row.status===0">{{$t( '待审批' )}}</el-tag>
           <el-tag type="primary" v-if="scope.row.status===1">{{$t( '审批通过' )}}</el-tag>
           <el-tag type="danger" v-if="scope.row.status===2">{{$t( '审批不通过' )}}</el-tag>
        </template>
       
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '操作时间' )"  prop="createTime"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button  type="text" v-if="isAuth('sys:forgetpwdapprove:update')" size="small" @click="addOrUpdateHandle(scope.row.id,true)">{{$t( '查看' )}}</el-button>
          <el-button  type="text" v-if="isAuth('sys:forgetpwdapprove:update')&&scope.row.status===0" size="small" @click="addOrUpdateHandle(scope.row.id,false)">{{$t( '审批' )}}</el-button>
          <el-button  type="text" v-if="isAuth('sys:forgetpwdapprove:delete')" size="small" @click="deleteHandle(scope.row.id,scope.row.name)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './review-safe-view'
  export default {
    data() {
      return {
        dataListSelections: [],
        dataForm:{
          'name': '',
          'account': '',
          'status': '',
          'startTime': '',
          'endTime': '',
        },
        time2:"",
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
          label: this.$t('待审批')
        }, {
          value: 1,
          label: this.$t('审批通过')
        },{
          value: 2,
          label: this.$t('审批不通过')
        }, ],
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
      getDetailTime(){
         var time1;
         var time2;
         if(this.time2){
         time1=this.time2[0];
         time2=this.time2[1];
         }
         if(time1){
        this.dataForm.startTime=new Date(time1).getFullYear()+"-"+((new Date(time1).getMonth()+1)<10?"0"+(new Date(time1).getMonth()+1):(new Date(time1).getMonth()+1))+"-"+
        (new Date(time1).getDate()<10?'0'+new Date(time1).getDate():new Date(time1).getDate())
//      +" "+
//      (new Date(time1).getHours()<10?'0'+new Date(time1).getHours():new Date(time1).getHours())+":"+
//      (new Date(time1).getMinutes()<10?'0'+new Date(time1).getMinutes():new Date(time1).getMinutes())+":"+
//      (new Date(time1).getSeconds()<10?'0'+new Date(time1).getSeconds():new Date(time1).getSeconds())
         this.dataForm.endTime=new Date(time2).getFullYear()+"-"+((new Date(time2).getMonth()+1)<10?"0"+(new Date(time2).getMonth()+1):(new Date(time2).getMonth()+1))+"-"+
        (new Date(time2).getDate()<10?'0'+new Date(time2).getDate():new Date(time2).getDate())
//      +" "+
//      (new Date(time2).getHours()<10?'0'+new Date(time2).getHours():new Date(time2).getHours())+":"+
//      (new Date(time2).getMinutes()<10?'0'+new Date(time2).getMinutes():new Date(time2).getMinutes())+":"+
//      (new Date(time2).getSeconds()<10?'0'+new Date(time2).getSeconds():new Date(time2).getSeconds())
        }else{
          this.dataForm.startTime=""
          this.dataForm.endTime=""
        }
      },
      // 新增 / 修改
      addOrUpdateHandle (id,see) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,see)
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
          url: this.$http.adornUrl('/sys/forgetpwdapprove/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'account': this.dataForm.account,
            'name': this.dataForm.name,
            'status': this.dataForm.status,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime,
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
            switch(item.osName){
              case "0":data.page.list[i].osName="Android";break;
              case "1":data.page.list[i].osName="IOS";break;
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
            url: this.$http.adornUrl('/sys/forgetpwdapprove/delete'),
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
