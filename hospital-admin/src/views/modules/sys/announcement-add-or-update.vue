<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="1100px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!--<el-input v-model="dataForm.content" placeholder="内容"></el-input>-->
        <editor  :editorStatus="editorStatus" :DatabaseUeContent="DatabaseUeContent" @backContent="getUeContent" ></editor>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item label="是否推荐" size="mini" prop="isRecommend">
        <el-radio-group v-model="dataForm.isRecommend">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--{{DatabaseUeContent}}-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
//import editor from '@/components/ueditor';
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          title: '',
          content: '',
          sort: '',
          isRecommend: 1,
          viewCount: '',
          del: '',
        },
        DatabaseUeContent:'',
        dataRule: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ]
          // content: [
          //   { required: true, message: '内容不能为空', trigger: 'blur' }
          // ]
        },
        editorContent:'',//ueditor返回的内容
        editorStatus:false //通过更改这个状态更新ueditor
      }
    },
     components: {
      editor
    },
    methods: {
      getUeContent(val){//触发获得编辑器内容方法，一般不用更改
        this.editorContent=val;
        // alert('触发获得编辑器内容方法:'+val);
        this.dataForm.content = val;
      },
      initDatabaseUeContent(val){//把数据库内容放到插件去
        this.DatabaseUeContent=val;
        // this.editor.setContent(val);
      },
      init (id) {
//      this.dataForm.id = id || 0
//      this.visible = true
//      this.$nextTick(() => {
//        this.$refs['dataForm'].resetFields()
//        if (this.dataForm.id) {
//          this.$http({
//            url: this.$http.adornUrl(`/sys/announcement/info/${this.dataForm.id}`),
//            method: 'get',
//            params: this.$http.adornParams()
//          }).then(({data}) => {
//            if (data && data.code === 0) {
//              this.dataForm.title = data.announcement.title
//              this.dataForm.content = data.announcement.content
//              this.initDatabaseUeContent(this.dataForm.content);
//              this.dataForm.sort = data.announcement.sort
//              this.dataForm.isRecommend = data.announcement.isRecommend
//              this.dataForm.viewCount = data.announcement.viewCount
//              this.dataForm.del = data.announcement.del
//            }
//          })
//        }
//      })
      },
      // 表单提交
      dataFormSubmit () {
        this.editorStatus=!this.editorStatus;
        this.$nextTick(()=>{
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/announcement/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'title': this.dataForm.title,
                'content': this.dataForm.content,
                'sort': this.dataForm.sort,
                'isRecommend': this.dataForm.isRecommend,
                'viewCount': this.dataForm.viewCount,
                'del': this.dataForm.del
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
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
        })
      }
    }
  }
</script>
