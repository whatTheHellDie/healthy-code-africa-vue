<template>
  <el-dialog
    :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <!--<el-form-item :label="$t( '类型' )" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item :label="$t( '上级部门' )" prop="parentName">
        <el-popover
          ref="departmentListPopover"
          placement="bottom-start"
          trigger="click">
          <div class="company-tree" >
            <div class="expand" @click="changeTree">{{$t( '展开/收缩' )}}</div>
            <el-input
  :placeholder="$t( '查询')"
  v-model="filterText">
</el-input>
            <el-tree
              :data="departmentList"
              :props="departmentListTreeProps"
              node-key="menuId"
              ref="departmentListTree"
              @current-change="departmentListTreeCurrentChangeHandle"
              :default-expand-all="expand"
              :highlight-current="true"
              :filter-node-method="filterNode"
              :expand-on-click-node="false">
            </el-tree>
          </div>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:departmentListPopover :readonly="true" :placeholder="$t( '点击选择上级菜单' )" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item :label=" $t( '名称' )" prop="name">
        <el-input v-model="dataForm.name" :placeholder=" $t( '名称' )"></el-input>
      </el-form-item>
      <el-form-item  :label="$t( '排序' )" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" :label="$t( '排序' )"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t( '状态' )" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio v-for="(status, index) in dataForm.statusList" :label="index" :key="index">{{ status }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t( '取消' )}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t( '确定' )}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error(this.$t( '菜单URL不能为空' )))
        } else {
          callback()
        }
      }
      return {
        filterText: '',
        expand:true,
        visible: false,
        dataForm: {
          id: 0,
//        type: 1,
          statusList: [this.$t( '正常' ), this.$t( '禁用' )],
          name: '',
          parentId: 0,
          parentName: '',
          orderNum: 0,
          name:"",
          status:0
        },
        dataRule: {
          name: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'change' }
          ],
        },
        departmentList: [],
        departmentListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
    },
    computed:{
      labelWidth(){
        switch(window.localStorage.language){
          case 'zh-cn':return '80px';
          case 'en':return '140px'
        }
      }
    },
       watch: {
      filterText(val) {
        this.$refs.departmentListTree.filter(val);
      }
    },
    methods: {
       filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
    },
    
      changeTree(){
        this.expand=!this.expand
        
          for (let i = 0; i < this.departmentList.length; i++) {
            if(this.expand){
        // 将没有转换成树的原数据设置key为... 的展开
        this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = true
        }else{
        this.$refs.departmentListTree.store.nodesMap[this.departmentList[i].menuId].expanded = false
      }
      }
          
        
      },
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dept/treeData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          data.data.forEach(function(item,i){
            data.data[i].menuId=item.id
          })
          this.departmentList = treeDataTranslate(data.data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
            
          if (!this.dataForm.id) {
            // 新增
            this.departmentListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
            data.data.menuId=data.data.id
              this.dataForm.id = data.data.menuId
              this.dataForm.name = data.data.name
              this.dataForm.parentId = data.data.parentId
              this.dataForm.orderNum = data.data.sort
              this.dataForm.status = data.data.status
              this.departmentListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      departmentListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.menuId
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      departmentListTreeSetCurrentNode () {
        this.$refs.departmentListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.departmentListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'parentId': this.dataForm.parentId,
                'sort': this.dataForm.orderNum,
                'status': this.dataForm.status,
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t( '操作成功' ),
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
