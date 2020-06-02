<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :label-width="labelWidth">
      <div class="inb">
      <span class="label-search">{{$t( '健康状态' )}}</span>
      <el-select v-model="dataForm.status" :placeholder="$t('请选择')">
        <el-option v-for="item in vertifyOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </div>
      <div class="inb">
      <span class="label-search">{{$t( '审批状态' )}}</span>
      <el-select v-model="dataForm.attestation" :placeholder="$t('请选择')">
        <el-option v-for="item in attestationOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </div>
      <div class="inb">
      <span class="label-search">{{$t( '姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realname" :placeholder="$t( '姓名' )" clearable></el-input>
      </el-form-item>
      </div>
      <div class="inb">
      <span class="label-search">{{$t( '手机号码' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '手机号码' )" clearable></el-input>
      </el-form-item>
      </div>
      <div class="inb">
      <span class="label-search">{{$t( '证件号码' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.idCard" :placeholder="$t( '证件号码' )" clearable></el-input>
      </el-form-item>
      </div>
          <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
          <el-button v-if="isAuth('business:users:save')" type="primary" @click="userAddOrUpdateHandle()">{{$t( '新增静态码用户' )}}</el-button>
             <!--v-if="isAuth('business:materialStore:save')"--> 
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <!--<el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="50" type="index" :index="1" :label="序号">
      </el-table-column>-->
      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '姓名' )"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '性别' )" prop="gender">
        <template slot-scope="scope">
          <div v-if="scope.row.gender===0">{{$t( '男' )}}</div>
          <div v-if="scope.row.gender===1">{{$t( '女' )}}</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '证件号码' )" prop="idCard"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '手机号码' )" prop="phone"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '国籍' )" prop="nationality"></el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '状态' )" prop="isIdAuth">
        <template slot-scope="scope">
          <div >
<el-tag type="info" v-if="scope.row.attestation===0">{{$t( '未填写' )}}</el-tag>
<el-tag type="warning" v-if="scope.row.attestation===1">{{$t( '审核中' )}}</el-tag>
<el-tag type="success" v-if="scope.row.attestation===2">{{$t( '审核通过' )}}</el-tag>
<el-tag type="danger" v-if="scope.row.attestation===3">{{$t( '审核不通过' )}}</el-tag>
           
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '健康状态调整' )" width="100" prop="isIdAuth">
        <template slot-scope="scope">
          <div >
            <div class="country-status-point red" :class="{active:scope.row.state===2}" @click="changeState(scope.row.id,2)"></div>
            <div class="country-status-point yellow" :class="{active:scope.row.state===1}" @click="changeState(scope.row.id,1)"></div>
            <div class="country-status-point green" :class="{active:scope.row.state===0}" @click="changeState(scope.row.id,0)"></div>
           
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '治愈' )" width="50" prop="isIdAuth">
        <template slot-scope="scope">
          <div class="country-status-alive gray" v-if="scope.row.state!==4" @click="changeState(scope.row.id,4)">✖</div>
          <div class="country-status-alive red"  v-if="scope.row.state===4">✔</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="50" :label="$t( '死亡' )" prop="isIdAuth">
        <template slot-scope="scope">
          <div class="country-status-alive" v-if="scope.row.state!==5" @click="changeState(scope.row.id,5)">✖</div>
          <div class="country-status-alive red"  v-if="scope.row.state===5">✔</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :label="$t( '类型' )" prop="isIdAuth">
        <template slot-scope="scope">
          <div>
            <div v-if="!scope.row.changeClassif">
              <span v-if="scope.row.classif===0">{{$t( '居民' )}}</span>
              <span v-if="scope.row.classif===1">{{$t( '医护' )}}</span>
              <el-button type="text" @click="scope.row.changeClassif=true" >{{$t( '修改' )}}</el-button>
            </div>
            <div v-else>
            <el-select v-model="scope.row.classif" :placeholder="$t('请选择')">
        <el-option v-for="item in classifOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
              <el-button type="text" @click="changeClassif(scope.row.id,scope.row.classif)" >{{$t( '确认' )}}</el-button>
      
      </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" fixed="right" header-align="center"  align="center" width="100px" :label="$t( '操作' )">
        <template slot-scope="scope">
          <div >
            <el-button type="text" @click="addOrUpdateHandle(scope.row.id)" v-if="isAuth('business:users:list')">{{$t( '查看' )}}</el-button>
            <el-button type="text" @click="freeze(scope.row.id,1)" v-if="isAuth('business:users:updateFrozen')&&scope.row.frozen===0">{{$t( '冻结' )}}</el-button>
            <el-button type="text" @click="freeze(scope.row.id,0)" v-if="isAuth('business:users:updateFrozen')&&scope.row.frozen===1">{{$t( '解冻' )}}</el-button>
            <el-button type="text" @click="bindAddOrUpdateHandle(scope.row.id)" v-if="isAuth('business:users:bindAdmin')">{{$t( '绑定管理员' )}}</el-button>
            <el-button type="text" @click="printAddOrUpdateHandle(scope.row.id)" v-if="isAuth('business:users:getQrCode')">{{$t( '打印' )}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
     
<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
<bind-add-or-update v-if="bindAddOrUpdateVisible" ref="bindAddOrUpdate" @refreshDataList="getDataList"></bind-add-or-update>
<user-add-or-update v-if="userAddOrUpdateVisible" ref="userAddOrUpdate" @refreshDataList="getDataList"></user-add-or-update>
<print-add-or-update v-if="printAddOrUpdateVisible" ref="printAddOrUpdate" @refreshDataList="getDataList"></print-add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './user-review'
  import bindAddOrUpdate from './bind-user'
  import userAddOrUpdate from './user-add-or-update'
  import printAddOrUpdate from './user-print'
  
  export default {
    data() {
      return {
        dataListSelections: [],
        bindAddOrUpdateVisible:false,
        userAddOrUpdateVisible:false,
        printAddOrUpdateVisible:false,
        addOrUpdateVisible:false,
        classifOptions:[
        {
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('居民')
        }, {
          value: 1,
          label: this.$t('医护')
        }
        ],
        vertifyOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('健康')
        }, {
          value: 1,
          label: this.$t('疑似')
        },{
          value: 2,
          label: this.$t('确诊')
        },{
          value: 4,
          label: this.$t('治愈')
        },{
          value: 5,
          label: this.$t('死亡')
        }, ],
        attestationOptions: [{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('未填写')
        }, {
          value: 1,
          label: this.$t('审核中')
        },{
          value: 2,
          label: this.$t('审核通过')
        },{
          value: 3,
          label: this.$t('审核不通过')
        }],
        statusOptions:[{
          value: '',
          label: this.$t('全部')
        },{
          value: 0,
          label: this.$t('未冻结')
        }, {
          value: 1,
          label: this.$t('已冻结')
        } ],
        time2: [],
        showPayMethod: false,
        dataForm: {
          phone: '',
          realname: '',
          applicationName: '',
          projectAccount: '',
          order: '',
          sidx: '',
          startTime: '',
          endTime: '',
          status: '',
          attestation:""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        showInfoVisible: false,
        addSmsnumVisible: false,
        addOrUpdateVisible: false,
      }
    },
    activated() {
      this.getDataList()
    },
   
    deactivated() {
      this.addOrUpdateVisible = false
      this.showInfoVisible = false
      this.addSmsnumVisible = false
      this.showPayMethod = false
    },
    components: {
      AddOrUpdate,
      bindAddOrUpdate,
      userAddOrUpdate,
      printAddOrUpdate
    },
    computed: {
      labelWidth() {
        switch(window.localStorage.language) {
          case 'zh-cn':
            return '40px';
          case 'en':
            return '80px'
        }
      }
    },
    methods: {
      // 打印静态码
      changeClassif(id,classif){
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/business/users/updateClassify'),
          method: 'post',
          data: this.$http.adornData({
            'userId': id,
            'classif': classif,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataListLoading = false;
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
      // 新增 / 修改
      userAddOrUpdateHandle(id) {
        this.userAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.userAddOrUpdate.init(id)
        })
      },
       // 新增 / 修改
      printAddOrUpdateHandle(id) {
        this.printAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.printAddOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      bindAddOrUpdateHandle(id) {
        this.bindAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.bindAddOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      changeState(id,state){
         this.$confirm(this.$t( '确定要更改状态吗?'), this.$t( '提示'), {
          confirmButtonText: this.$t( '确定'),
          cancelButtonText: this.$t( '取消'),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true;
          this.$http({
          url: this.$http.adornUrl('/business/users/updateState'),
          method: 'post',
          data: this.$http.adornData({
            'userId': id,
            'state': state,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataListLoading = false;
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
          
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: this.$t( '取消')
          });          
        });
      },
      freeze(id, status) {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/business/users/updateFrozen'),
          method: 'post',
          data: this.$http.adornData({
            'userId': id,
            'frozen': status,
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            this.dataListLoading = false;
            this.getDataList()
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
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
          url: this.$http.adornUrl('/business/users/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'realname': this.dataForm.realname,
            'phone': this.dataForm.phone,
            'idCard': this.dataForm.idCard,
            'state': this.dataForm.status,
            'attestation':this.dataForm.attestation
          })
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data.data.list.forEach((item, i) => {
              data.data.list[i].sex = item.sex === 0 ? this.$t("男") : this.$t("女")
              data.data.list[i].changeClassif =false
            })
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount

          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
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
.el-form--inline .el-select{margin-bottom: 20px;}
.country-status-point{width: 14px;height: 14px;border-radius: 50%;display: inline-block;vertical-align: middle;cursor: pointer;}
.country-status-point.green{background: #b2ffb2;}
.country-status-point.yellow{background: #fee576;}
.country-status-point.red{background: #f89292;}
/*.country-status-point.green.active{box-shadow: 0px 0px 0.68px 2px rgba(58, 213, 73, 0.75);
    background-image: -webkit-linear-gradient( -180deg, rgb(177,177,183) 0%, rgb(16,182,16) 48%, rgb(0,128,0) 100%);
    }*/
    .country-status-point.green.active{background: green;    box-shadow: 0px 0px 3px 1px rgba(0,0,0,1);}
    .country-status-point.yellow.active{background: #ff9500;    box-shadow: 0px 0px 3px 1px rgba(0,0,0,1);}
.country-status-point.red.active{background: red;    box-shadow: 0px 0px 3px 1px rgba(0,0,0,1);}
.country-status-alive{color: green;font-size: 20px;cursor: pointer;}
.country-status-alive.red{color: red;}
.country-status-alive.gray{color: gray;}
</style>