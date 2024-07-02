<template>
  <div>
    <el-dialog
      :title="fileinfo"
      :visible.sync="dialogFormVisible"
    >
      <div style="margin-bottom: 10px">
        <el-button
          type="primary"
          @click="dialogVisible=true"
        >
          上传<i class="el-icon-upload el-icon--right" />
        </el-button>
      </div>
      <el-table
        :data="fileList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @close="closeFileList()"
      >
        <el-table-column
          label="工单ID"
          prop="fileid"
          align="center"
          width="180"
        >
          <template slot-scope="{row}">
            <span>{{ row.work_id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件名称"
          prop="filename"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.ori_file_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上传时间"
          prop="filename"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.creat_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="downfile(row.local_url)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      align="center"
    >
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :multiple="false"
        :show-file-list="true"
        :file-list="uploadfileList"
        :limit="1"
        :auto-upload="false"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :on-remove="handleRemove"
      >
        <i class="el-icon-upload" />
      </el-upload>
      <div style="text-align: center">
        <el-button
          type="success"
          style="margin: 15px 45px;"
          @click="upload()"
        >
          上 传
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {DownFile, FileInfo, GetFileList, UploadFile} from "@/api/article";

export default {
  name: 'FileDialog',
  data(){
    return{
      dialogFormVisible:false,
      dialogVisible:false,
      fileinfo:"文件信息",
      fileList:[],
      fileContent:"",
      uploadfileList:[],
      work_id:"",
      listQuery:{
        "work_id":"",
        "status":"0"
      }
      // FileInfoList:{}
    }
  },
  methods:{
    //根据ID获取文件列表
    getFileList(){
      this.listQuery.work_id = this.work_id.toString()
      GetFileList(this.listQuery).then((response) => {
        if(response.status === 200 ){
          if(response.data.data !== '无数据'){
            this.fileList = response.data.data
            console.log(this.fileList)
          } else {
            this.fileList = []
          }
        }else{
          this.$message.warning(`获取文件列表失败`);
        }
      })
    },
    handleExceed() {
      this.$message.warning(`一次只能上传一个文件，请勿重复上传`);
    },
    handleRemove() {
      this.uploadfileList = [];
    },
    handleChange(file) {
      this.fileContent = file.raw;
      const fileName = file.name;
      const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
      if (fileName) {
        //文件类型
        if (fileType === "xlsx" || fileType === "xls" || fileType === "pdf" || fileType === "docx" || fileType === "doc" || fileType === "txt" || fileType === "zip") {
          this.$message({
            type: "success",
            message: "已选择文件",
          });
          this.uploadfileList.push(file);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请重新上传！",
          });
          this.uploadfileList = [];
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },
    //上传
    upload(){
      if(this.fileContent === ''){
        this.$message({
          showClose: true,
          message: '请上传附件',
          type: 'warning'
        });
      }else {
        UploadFile(this.fileContent).then((res) => {
          if(res.status === 200){
            const FileInfoList = {
              "work_id":this.work_id.toString(),
              "url":res.data.data.new_file_path,
              "local_url":res.data.data.file_path,
              "file_remark":"",
              "ori_file_name":res.data.data.ori_file_name,
              "new_file_name":res.data.data.new_file_name,
              "create_user":"admin",
            }
            FileInfo(FileInfoList).then((response) =>{
              if(response.data.status === 200){
                this.$message({
                  message: '上传成功',
                  type: 'success'
                })
              }else {
                this.$message({
                  message: '上传失败',
                  type: 'danger'
                })
              }
              this.UploadFinish()
            })
          }
        })
      }
    },
    //下载
    downfile(url){
      window.open(url)
    },
    refresh(){
      this.dialogFormVisible = true
    },
    //初始化
    closeFileList(){
      this.fileList = []
    },
    //初始化
    UploadFinish(){
      this.uploadfileList = [];
      this.fileContent = ""
      this.dialogVisible = false
      this.getFileList()
    }
  }
}
</script>

<style scoped>

</style>
