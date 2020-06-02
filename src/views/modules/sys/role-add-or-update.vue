<template>
  <el-dialog :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '角色名称' )" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t( '角色名称' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '备注' )" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t( '备注' )"></el-input>
      </el-form-item>
      <el-form-item size="mini" :label="$t( '授权' )">
        <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" :default-expand-all="true" show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-input type="hidden" v-model="dataForm.createTime"></el-input>
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data() {
      return {
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          name: '',
          remark: '',
          createTime: ''
        },
        dataRule: {
          name: [{
            required: true,
            message: this.$t('角色名称不能为空'),
            trigger: 'blur'
          }]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    computed:{
      labelWidth(){
        switch(window.localStorage.language){
          case 'zh-cn':return '80px';
          case 'en':return '114px'
        }
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          console.log(data)
          var menuList = data;
          menuList.forEach((item, i) => {
            menuList[i].name = this.$t(item.name)
            if(menuList[i].list) {
              menuList[i].list.forEach((itemx, j) => {
                menuList[i].list[j].name = this.$t(itemx.name)
                if(menuList[i].list[j].list) {
                  menuList[i].list[j].list.forEach((itemy, k) => {
                    menuList[i].list[j].list[k].name = this.$t(itemy.name)
                  })
                }
              })
            }
          })
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if(this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if(data && data.code === 200) {
                this.dataForm.name = data.data.name
                this.dataForm.createTime = data.data.createTime
                this.dataForm.remark = data.data.remark
                data.data.menuIds=data.data.menuIds.slice(1)
                data.data.menuIds[data.data.menuIds.length]=this.tempKey
                var idx = data.data.menuIds.indexOf(this.tempKey)
                if(idx !== -1) {
                  data.data.menuIds.splice(idx, data.data.menuIds.length - idx)
                }
                
                this.$refs.menuListTree.setCheckedKeys(data.data.menuIds)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
//              'createTime': this.dataForm.createTime,
                'remark': this.dataForm.remark,
                'menuIds': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
              })
            }).then(({
              data
            }) => {
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