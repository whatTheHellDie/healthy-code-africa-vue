<template>
  <div class="mod-user">
    
          <el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '商品名称' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.goodsName" :placeholder="$t( '商品名称' )" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">{{$t( '新增' )}}</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">{{$t( '批量删除' )}}</el-button>
      </el-form-item>
    </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>
      <el-table-column prop="portrait" header-align="center" width="150" align="center" :label="$t( '商品图片' )">
        <template slot-scope="scope">
          <img :src="scope.row.portrait" style="width: 120px;height: 120px;"/>
        </template>
        
      </el-table-column>
      <el-table-column prop="goodsName" header-align="center" align="center" :label="$t( '商品名称' )"></el-table-column>
      <el-table-column prop="stock" header-align="center" align="center" :label="$t( '库存数量' )">
       <template slot-scope="scope">
          <div>
          {{scope.row.stock}}
          <el-button type="text" size="small" @click="stockAddOrUpdateHandle(scope.row.id,scope.row.goodsName)">{{$t( '添加' )}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" :label="$t( '商品单价' )">
      </el-table-column>
      <el-table-column prop="quota" header-align="center" align="center" :label="$t( '下架' )">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.state===1">{{$t( '是' )}}</el-tag>
            <el-tag type="success" v-if="scope.row.state===0">{{$t( '否' )}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" :label="$t( '操作' )">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t( '修改' )}}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.goodsName)">{{$t( '删除' )}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    

 <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <stock-add-or-update v-if="stockAddOrUpdateVisible" ref="stockAddOrUpdate" @refreshDataList="getDataList"></stock-add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './commodity-add-or-update'
  import StockAddOrUpdate from './stock-add-or-update'
  export default {
    data() {
      return {
        dataForm: {
          goodsName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        stockAddOrUpdateVisible: false,
      }
    },
    components: {
      AddOrUpdate,
       StockAddOrUpdate
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
          url: this.$http.adornUrl('/business/storeGoods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'goodsName': this.dataForm.goodsName,
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
      stockAddOrUpdateHandle(id,name) {
        this.stockAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.stockAddOrUpdate.init(id,name)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle(id, goodsName) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var goodsNames = goodsName ? [goodsName] : this.dataListSelections.map(item => {
          return item.goodsName
        })
        this.$confirm(this.$t('messages.template1', [goodsNames.join(','), id ? this.$t('删除') : this.$t('批量删除')]), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/storeGoods/delete'),
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