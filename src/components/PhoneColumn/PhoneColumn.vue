<template>
  <div class="div clearfix">
    <span class="span">{{label}}</span>
    <span class="content pull-right">
      <slot :row="rowData"><div v-html="prop"></div></slot>
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String
      },
      prop: {
        type: [String,Number,Array],
        default:""
      },
      data:{},
      index:{}
},
computed:{
    rowData(){
      //返回当前行的数据
      var data=this.data;
      var index=this.index
      if(data&&index>=0){
        return data[index]
      }
        return {};
      
      
    }
}
  }
</script>

<style>

</style>