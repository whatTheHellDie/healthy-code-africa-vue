<template>
  <el-dialog :title="$t( '部门权限' ) " :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '角色名称' )" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t( '角色名称' )" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item size="mini" :label="$t( '数据范围' )">
        <el-select v-model="dataForm.dataScope" :placeholder="$t('请选择')">
          <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" :label="$t( '部门' )" v-show="dataForm.dataScope===1">
        <div class="">
          
          <el-input :placeholder="$t( '查询')" v-model="filterText">
          </el-input>
          <div class="expand" @click="changeTree" style="text-align: right;">{{$t( '展开/收缩' )}}</div>
          <el-tree  :data="departmentList" :props="departmentListTreeProps"  node-key="menuId" :default-checked-keys="dataForm.deptIds" ref="departmentListTree" @current-change="departmentListTreeCurrentChangeHandle" :default-expand-all="expand" :highlight-current="true" :filter-node-method="filterNode" :expand-on-click-node="false" show-checkbox>
          </el-tree>
        </div>
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
        filterText: '',
        expand: true,
        departmentList: [],
        departmentListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataScopeOptions:[{
          value: 0,
          label: this.$t('全部数据权限')
        },{
          value: 1,
          label: this.$t('自定数据权限')
        }, {
          value: 2,
          label: this.$t('本部门数据权限')
        },{
          value: 3,
          label: this.$t('本部门及以下数据权限')
        }, {
          value: 4,
          label: this.$t('仅本人数据权限')
        }
           ],
        visible: false,
        menuList: [],
        dataForm: {
          id: 0,
          name: '',
          remark: '',
          createTime: '',
          dataScope:"",
          deptIds:[]
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
    watch: {
      filterText(val) {
        this.$refs.departmentListTree.filter(val);
      }
    },
    methods: {
      initTree(id) {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/roleDeptTreeData/'+id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.dataForm.dataScope=data.data.dataScope
          this.dataForm.deptIds=data.data.deptIds;
          data.data=data.data.deptList;
          data.data.forEach(function(item, i) {
            data.data[i].menuId = item.id
          })
          this.departmentList = treeDataTranslate(data.data, 'menuId')
        }).then(() => {
                    this.$nextTick(() => {
                    })
        }).then(() => {

          if(!this.dataForm.id) {
            // 新增
            this.departmentListTreeSetCurrentNode()
          } else {
            // 修改
             this.departmentListTreeSetCurrentNode()
            }
        })
      },
      changeTree() {
        this.expand = !this.expand

        for(let i = 0; i < this.departmentList.length; i++) {
          if(this.expand) {
            // 将没有转换成树的原数据设置key为... 的展开
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = true
          } else {
            this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = false
          }
        }

      },
      filterNode(value, data) {
        if(!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // 菜单树选中
      departmentListTreeCurrentChangeHandle(data, node) {
        this.dataForm.parentId = data.menuId
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      departmentListTreeSetCurrentNode() {
        this.$refs.departmentListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.departmentListTree.getCurrentNode() || {})['name']
      },
      init(id,name) {
        this.dataForm.name=name
        this.dataForm.id = id || 0;
        this.initTree(id)
        this.visible=true
      },
      // 表单提交
      dataFormSubmit() {
        console.log(this.dataForm.dataScope)
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/authDataScope`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataScope': this.dataForm.dataScope,
                'deptIds': this.dataForm.dataScope===1?this.$refs.departmentListTree.getCheckedKeys():[]
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