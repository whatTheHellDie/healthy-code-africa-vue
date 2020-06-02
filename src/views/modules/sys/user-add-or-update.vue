<template>
  <el-dialog
    :title="!dataForm.id ? $t( '新增' ) : $t( '修改' )"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="$t( '用户名' )" prop="userName">
        <el-input v-model="dataForm.userName" :placeholder="$t( '登录账号' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '密码' )" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t( '密码' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '确认密码' )" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t( '确认密码' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '归属部门' )" prop="deptName">
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
        <el-input v-model="dataForm.deptName" v-popover:departmentListPopover :readonly="true" :placeholder="$t( '点击选择上级菜单' )" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '备注' )" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t( '备注' )"></el-input>
      </el-form-item>
      <el-form-item :label="$t( '角色' )" size="mini" prop="roleIds">
        <el-checkbox-group v-model="dataForm.roleIds">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t( '状态' )" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t( '正常' )}}</el-radio>
          <el-radio :label="1">{{$t( '禁用' )}}</el-radio>
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
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error(this.$t( '不能为空' )))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error(this.$t( '不能为空' )))
        } else if (this.dataForm.password !== value) {
          callback(new Error(this.$t( '确认密码与密码输入不一致' )))
        } else {
          callback()
        }
      }
      return {
        filterText: '',
        expand: true,
        departmentList: [],
        departmentListTreeProps: {
          label: 'name',
          children: 'children'
        },
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          remark: '',
          roleIds: [],
          status: 1,
          deptId:"",
          deptName:""
        },
        dataRule: {
          userName: [
            { required: true, message: this.$t( '不能为空' ), trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
        }
      }
    },
    computed:{
      labelWidth(){
        switch(window.localStorage.language){
          case 'zh-cn':return '80px';
          case 'en':return '142px'
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
          url: this.$http.adornUrl('/sys/dept/treeData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          data.data.forEach(function(item, i) {
            data.data[i].menuId = item.id
          })
          this.departmentList = treeDataTranslate(data.data, 'menuId')
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
        this.dataForm.deptId = data.menuId
        this.dataForm.deptName = data.name
      },
      // 菜单树设置当前选中节点
      departmentListTreeSetCurrentNode() {
        console.log(this.dataForm.deptId)
        this.$refs.departmentListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.departmentListTree.getCurrentNode() || {})['name']
      },
      init (id) {
        this.dataForm.id = id || 0
        this.initTree()
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          
          data.data.list.forEach(function(item,i){
            data.data.list[i].roleId=item.id;
            data.data.list[i].roleName=item.name
          })
          this.roleList = data && data.code === 200 ? data.data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                data=data.data
                this.dataForm.userName = data.username
                this.dataForm.remark = data.remark
                this.dataForm.roleIds = data.roleIds
                this.dataForm.status = data.status
                console.log(data.deptId)
                this.dataForm.deptId = data.deptId
                this.departmentListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'remark': this.dataForm.remark,
                'status': this.dataForm.status,
                'roleIds': this.dataForm.roleIds,
                'deptId':this.dataForm.deptId
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
