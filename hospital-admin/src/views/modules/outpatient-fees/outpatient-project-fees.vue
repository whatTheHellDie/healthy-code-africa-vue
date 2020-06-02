<template>
  <!--门诊收费  门诊项目收费-->
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <span class="label-search">{{$t( '患者姓名' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.realname" :placeholder="$t( '患者姓名' )" clearable></el-input>
      </el-form-item>
      <span class="label-search">{{$t( '就诊号' )}}</span>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t( '预约号' )" clearable></el-input>
      </el-form-item>
      <div class="inb"></div>
      <div class="inb">
        <span class="label-search">{{$t( '状态' )}}</span>
        <el-select v-model="dataForm.state" :placeholder="$t('请选择')">
          <el-option
            v-for="item in vertifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-form-item>
        <el-button @click="getDataList()">{{$t( '查询' )}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" type="index" :index="1" :label="$t( '序号' )">
      </el-table-column>-->
      <el-table-column prop="shopName" header-align="center" align="center" :label="$t( '患者姓名' )"></el-table-column>

      <el-table-column prop="realname" header-align="center" align="center" :label="$t( '就诊编号' )"></el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" :label="$t( '收费类型' )"></el-table-column>
      <el-table-column prop="couponName" header-align="center" align="center" :label="$t( '收费金额' )"></el-table-column>
      <el-table-column prop="dueTime" header-align="center" align="center" :label="$t( '收费时间' )"></el-table-column>
      <el-table-column prop="storeName" header-align="center" align="center" :label="$t( '状态' )">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state===0">{{$t( '待支付' )}}</el-tag>
          <el-tag type="info" v-else>{{$t( '已支付' )}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        :label="$t( '详情' )"
      >
        <template slot-scope="scope" v-if="scope.row.state===0">
          <el-button type="text" size="small" @click="detailHandle(scope.row.id)">{{$t( '查看详情' )}}</el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <outpatient-fees-review v-if="outpatientFeesReviewVisible" ref="outpatientFeesReview" ></outpatient-fees-review>
  </div>
</template>

<script>
import OutpatientFeesReview from "./outpatient-fees-review";
export default {
  data() {
    return {
      vertifyOptions: [
        {
          value: "",
          label: this.$t("全部")
        },
        {
          value: 0,
          label: this.$t("待支付")
        },
        {
          value: 1,
          label: this.$t("已支付")
        }
      ],
      dataForm: {
        realname: "",
        phone: "",
        state: "",
        value: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      outpatientFeesReviewVisible: false
    };
  },
  activated() {
    this.getDataList();
  },
  components: {
    OutpatientFeesReview
  },
  methods: {
    //呼叫病患
    confirmPay(id) {
      this.dataListLoading = true;
      this.$confirm(this.$t("是否确认支付?"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/business/users/updateFrozen"),
            method: "post",
            data: this.$http.adornData({
              userId: id
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.dataListLoading = false;
              this.getDataList();
            } else {
              this.$alert(data.msg, this.$t("提示"), {
                confirmButtonText: this.$t("确定")
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("已取消")
          });
        });
    },
    // 获取数据列表
    getDataList() {
      if (event) {
        if (event.type == "click") {
          this.pageIndex = 1;
        }
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/business/storeCouponUser/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          realname: this.dataForm.realname,
          phone: this.dataForm.phone,
          state: this.dataForm.state
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          data = data.data;
          this.dataList = data.list;
          this.totalPage = data.totalCount;
        } else {
          this.$alert(data.msg, this.$t("提示"), {
            confirmButtonText: this.$t("确定")
          });
        }
        this.dataListLoading = false;
      });
    },
    initPassword(id) {
      this.$confirm(this.$t("确定要初始化密码？"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              `/business/storeCouponUser/resetPassword/${id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t("操作成功"),
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$alert(data.msg, this.$t("提示"), {
                confirmButtonText: this.$t("确定")
              });
            }
          });
        })
        .catch(() => {});
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 详情
    detailHandle(id) {
        this.outpatientFeesReviewVisible = true
        this.$nextTick(() => {
          this.$refs.outpatientFeesReview.init(id)
        })
      },
    // 新增 / 修改
    // addOrUpdateHandle(id) {
    //   this.addOrUpdateVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id);
    //   });
    // },
    // 删除
    deleteHandle(id, realname) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      var realnames = realname
        ? [realname]
        : this.dataListSelections.map(item => {
            return item.storeName;
          });
      this.$confirm(
        this.$t("messages.template1", [
          realnames.join(","),
          id ? this.$t("删除") : this.$t("批量删除")
        ]),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("确定"),
          cancelButtonText: this.$t("取消"),
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/business/storeCouponUser/delete"),
            method: "post",
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t("操作成功"),
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$alert(data.msg, this.$t("提示"), {
                confirmButtonText: this.$t("确定")
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>