<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" style="width:300px" :placeholder="$t( '用户名/用户操作' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="username" header-align="center" align="center" width="120" :label="$t( '用户名' )">
      </el-table-column>
      <el-table-column prop="title" header-align="center" align="center" width="150" :label="$t( '用户操作' )">
      </el-table-column>
      <el-table-column prop="method" header-align="center" align="center" width="200" :show-overflow-tooltip="true"  :label="$t( '请求方法' )">
      </el-table-column>
      <el-table-column prop="params" header-align="center" align="center" :show-overflow-tooltip="true" :label="$t( '请求参数' )">
      </el-table-column>
      <el-table-column prop="time" header-align="center" align="center" width="120" :label="$t( '执行时长(毫秒)' )">
      </el-table-column>
      <el-table-column prop="ip" header-align="center" align="center" width="200" :label="$t( 'IP地址' )">
      </el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center" width="180" :label="$t( '创建时间' )">
      </el-table-column>
    </el-table>

    <!--适配手机start -->
    <div class="phone-table">
      <div class="tr" v-for="item,i in dataList">
        <!--<phone-column :prop="i+1" :label="序号"></phone-column>-->
        <phone-column :prop="item.username" :label="$t( '用户名' )"></phone-column>
        <phone-column :prop="item.operation" :label="$t( '用户操作' )"></phone-column>
        <phone-column :prop="item.method" :label="$t( '请求方法' )"></phone-column>
        <phone-column :prop="item.params" :label="$t( '请求参数' )"></phone-column>
        <phone-column :prop="item.time" :label="$t( '执行时长(毫秒)' )"></phone-column>
        <phone-column :prop="item.ip" :label="$t( 'IP地址' )"></phone-column>
        <phone-column :prop="item.createDate" :label="$t( '创建时间' )"></phone-column>
      </div>
    </div>
    <!--适配手机end -->
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/operLog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
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
      }
    }
  }
</script>
