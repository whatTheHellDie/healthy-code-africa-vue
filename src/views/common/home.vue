<template>
  <div class="mod-demo-echarts">

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_chartLineBox" class="chart-box"><b class="b1">{{$t( '欢迎登录Heathy-qr后台管理！' )}}</b></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px
    }
    .b1 {
      font-weight: 700;
      text-align: center;
      width: 100%;
      display: block;
          font-size: 36px;
    line-height: 400px;
    }
  }
  @media (max-width: 768px) and (-webkit-min-device-pixel-ratio:1){
    .mod-demo-echarts .b1{font-size: 24px;line-height: 80px;}
    .mod-demo-echarts .chart-box{min-height: auto;}
    .el-card__body{min-height: auto !important; }
  }
</style>
