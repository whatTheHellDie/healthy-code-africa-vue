<template>
  <el-dialog :title="!dataForm.id ? $t('新增') : $t('修改')" :close-on-click-modal="false" v-loading.fullscreen.lock="fullscreenLoading" :visible.sync="visible" top="5vh" custom-class="wew" width="80%">
    <div>
      <div class="mod-demo-ueditor">
        <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="80px">
          <el-form-item :label="$t( '' )" v-if="isAdd">
            <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t( '独立地址' )}}</el-radio>
          <el-radio :label="1">{{$t( '下级地址' )}}</el-radio>
        </el-radio-group>
          </el-form-item>
           <el-form-item :label="$t( '上级菜单' )" prop="parentName"  v-if="dataForm.status===1&&isAdd">
        <el-popover ref="departmentListPopover" placement="bottom-start" trigger="click">
          <div class="company-tree">
            <div class="expand" @click="changeTree">{{$t( '展开/收缩' )}}</div>
            <el-input :placeholder="$t( '搜索')" v-model="filterText">
            </el-input>
            <el-tree :data="departmentList" :props="departmentListTreeProps" node-key="id" ref="departmentListTree" @current-change="departmentListTreeCurrentChangeHandle" :default-expand-all="expand" :highlight-current="true" :filter-node-method="filterNode" :expand-on-click-node="false">
            </el-tree>
          </div>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departmentListPopover :readonly="true" :placeholder="$t( '点击选择上级菜单' )" class="menu-list__input"></el-input>
      </el-form-item>
          <el-form-item :label="$t( '地址' )" prop="addrName">
            <el-input v-model="dataForm.addrName" :placeholder="$t( '详细地址' )" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data() {
      return {
        isAdd:"",
        filterText: '',
        expand: true,
        departmentList: [],
        departmentListTreeProps: {
          label: 'name',
          children: 'children'
        },
        fullscreenLoading: false,
        visible: false,
        dataForm: {
          id: "",
          location :"",
          addrName:"",
          parentId:"",
          deptName:"",
          status:""
        },
        dataRules: {
          addrName: [{
            required: true,
            message: this.$t('不能为空'),
            trigger: 'blur'
          }],
        },
        myValue: ""
      }
    },
    watch: {
      filterText(val) {
        this.$refs.departmentListTree.filter(val);
      }
    },
    methods: {
      initTree(id) {
        this.$http({
          url: this.$http.adornUrl('/business/address/selectAddress'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          data=data.data
//        data.forEach(function(item, i) {
//          data[i].menuId = item.id
//           data[i].forEach(function(itemx, x) {
//            data[i][x].menuId = itemx.id
//          })
//        })
          this.departmentList = treeDataTranslate(data, 'id')
        })
      },
      changeTree() {
        this.expand = !this.expand

        for(let i = 0; i < this.departmentList.length; i++) {
          if(this.expand) {
            // 将没有转换成树的原数据设置key为... 的展开
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].id].expanded = true
          } else {
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].id].expanded = false
          }
        }

      },
      filterNode(value, data) {
        if(!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // 菜单树选中
      departmentListTreeCurrentChangeHandle(data, node) {
        console.log(data)
        this.dataForm.parentId = data.id
        this.dataForm.deptName = data.name
      },
      // 菜单树设置当前选中节点
      departmentListTreeSetCurrentNode() {
        this.$refs.departmentListTree.setCurrentKey(this.dataForm.id)
        this.dataForm.deptName = (this.$refs.departmentListTree.getCurrentNode() || {})['name']
      },
      init(id,isAdd) {
        this.dataForm.addrName=""
        this.isAdd=isAdd;
        if(this.isAdd){
          this.dataForm.status=0
        }
        this.dataForm.id = id || 0
        this.visible = true
        this.initTree()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })

        this.$http({
          url: this.$http.adornUrl('/business/address/selectAddress'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if(data && data.code === 200) {
            data = data.data
            data.forEach((item, i) => {
              data[i].value = item.code
              data[i].label = item.name
              data[i].children.forEach((itemx, j) => {
                if(itemx.code && itemx.name) {
                  data[i].children[j].value = itemx.code
                  data[i].children[j].label = itemx.name
                  data[i].children[j].children.forEach((itemy, k) => {
                    if(itemy.code && itemy.name) {
                      data[i].children[j].children[k].value = itemy.code
                      data[i].children[j].children[k].label = itemy.name
                    }
                  })
                }
              })
            })
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
        if(!this.dataForm.id) {

        } else {
          this.$http({
            url: this.$http.adornUrl(`/business/address/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if(data && data.code === 200) {
                this.dataForm.status=!data.data.parentId?0:1
                this.dataForm.id=data.data.id
                this.dataForm.parentId=data.data.parentId
                this.dataForm.addrName=data.data.addrName
            } else {
              this.$alert(data.msg, this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
            }
          })
        }
      },
      dataFormSubmit() {
        if(this.dataForm.status===1){
              if(!this.dataForm.deptName){
                 this.$message.error(this.$t("上级菜单不能为空"))
                 return;
              }
            }
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.fullscreenLoading = true
            this.$http({
              url: this.$http.adornUrl(`/business/address/${this.isAdd ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id:this.dataForm.id,
                'parentId': this.dataForm.status!==0?this.dataForm.parentId:0 ,
                'addrName': this.dataForm.addrName,
              })
            }).then(({
              data
            }) => {
              this.fullscreenLoading = false
              if(data && data.code === 200) {
                this.$message({
                  message: this.$t('操作成功'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">

</style>