<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listAll.status"
        placeholder="请选择科室"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in Status"
          :key="item.status"
          :label="item.name"
          :value="item.status"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="add()"
      >
        新建工单
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="工单ID"
        align="center"
        width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工单名称"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.job_title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="科室"
        width="230px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ getChangeType(row.class_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.create_oper }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.job_time }}</span>
        </template>
      </el-table-column>1
      <el-table-column
        label="查看内容"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-warning-outline"
            size="mini"
            type="primary"
            @click="checkContent(row)"
          >
            工作内容
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="附件"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-folder-opened"
            size="mini"
            type="primary"
            @click="openFile(row.id)"
          >
            查看附件
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="编辑"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-setting"
            size="mini"
            type="primary"
            @click="edit(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="-1"
            @change="changeStatus(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="AddTask"
      :visible.sync="dialogAddFormVisible"
      style="width: 100%;"
      @close="closeAdd()"
    >
      <el-form
        label-width="100px"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="工单标题"
            >
              <el-input
                v-model="listAddQuery.job_title"
                placeholder="请输入工单名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="科室"
            >
              <el-select
                v-model="listAddQuery.class_id"
                placeholder="请选择科室"
                filterable
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in ClassOptions"
                  :key="item.class_id.toString()"
                  :label="item.class_name"
                  :value="item.class_id.toString()"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="创建人"
            >
              <el-input
                v-model="listAddQuery.create_oper"
                placeholder="请输入创建者"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="创建时间"
            >
              <el-date-picker
                v-model="listAddQuery.job_time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="工作内容"
              prop="text"
            >
              <el-input
                v-model="listAddQuery.job_conter"
                type="textarea"
                rows="6"
                cols="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="AddTask === '新增工单'"
          icon="el-icon-check"
          type="primary"
          @click="AddSubmit"
        >
          确认
        </el-button>
        <el-button
          v-if="AddTask === '编辑工单'"
          icon="el-icon-check"
          type="primary"
          @click="EditSubmit"
        >
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="Content"
      :visible.sync="dialogContent"
      style="width: 100%;"
      @close="closeContent()"
    >
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-input
          v-model="content"
          type="textarea"
          rows="6"
          cols="20"
        />
        <el-button @click="dialogContent = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <FileDialog
      ref="FileDialog"
      :self="FileDialogList"
      style="position: absolute"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import FileDialog from '@/views/task/components/FileDialog.vue'
import {
  AddTask,
  GetAllClass,
  GetAllTask, stopFloorStatus, StopTask, UpdateTask, UploadFile,
} from "@/api/article";


export default {
  name: 'Task',
  components: {FileDialog},
  directives: {waves, permission},
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      total: 0,
      tableKey: 0,
      listLoading: false,
      dialogAddFormVisible: false,
      dialogContent:false,
      AddTask: "",
      Content:"工作内容",
      list: [],
      content:"",
      listAddQuery:{
        "class_id":"",
        "job_title":"",
        "job_conter":"",
        "job_time":"",
        "create_oper":""
      },
      listAll:{"status":"0"},
      text: "",
      createTime: "",
      ClassOptions:[],
      Status:[
          {
            "status":"0",
            "name":"正常"
          },{
          "status":"-1",
          "name":"作废"
        }],
      FileDialogList:[]
    }
  },
  mounted() {
  },
  created() {
    this.dict()
    this.search()
  },
  methods: {
    dict(){
      const ClassQuery = {
        "status" : "0"
      }
      GetAllClass(ClassQuery).then(response => {
        if (response.status === 200) {
          this.ClassOptions = response.data.data
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
      })
    },
    getChangeType(e) {
      for (var i = 0; i < this.ClassOptions.length; i++) {
        if (this.ClassOptions[i].class_id.toString() === e) {
          return this.ClassOptions[i].class_name;
        }
      }
    },
    search() {
      GetAllTask(this.listAll).then(response => {
        // console.log(response)
        if (response.status === 200) {
          if(response.data.data !== "无数据"){
            this.list = response.data.data
          }else if(response.data.data === "无数据"){
            this.list = []
          }
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
      })
    },
    closeAdd(){
      this.listAddQuery = {
        "class_id":"",
        "job_title":"",
        "job_conter":"",
        "job_time":"",
        "create_oper":""
      }
    },
    add(){
      this.AddTask = "新增工单"
      this.dialogAddFormVisible = true
    },
    edit(row){
      this.AddTask = "编辑工单"
      this.dialogAddFormVisible = true
      this.listAddQuery = row
    },
    AddSubmit() {
      this.listAddQuery.class_id = this.listAddQuery.class_id.toString()
      // console.log(this.listAddQuery)
      AddTask(this.listAddQuery).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
        this.search()
      })
      this.dialogAddFormVisible = false
    },
    EditSubmit(){
      const list = {
        "id":this.listAddQuery.id.toString(),
        "class_id":this.listAddQuery.class_id,
        "job_title":this.listAddQuery.job_title,
        "job_conter":this.listAddQuery.job_conter,
        "status":this.listAddQuery.status,
        "job_time":this.listAddQuery.job_time
      }
      UpdateTask(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
        this.search()
      })
      this.dialogAddFormVisible = false
    },
    changeStatus(row){
      const list = {
        "id": row.id.toString(),
        "status": ''
      }
      if(row.status === '-1'){
        list.status = '0'
      }else{
        list.status = '-1'
      }
      // console.log(list)
      StopTask(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '更改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '更改失败',
            type: 'danger'
          })
        }
        this.search()
      })
    },
    checkContent(row){
      this.dialogContent = true
      this.content = row.job_conter
    },
    closeContent(){
      this.content = ""
    },
    openFile(id){
      this.$refs.FileDialog.dialogFormVisible = true
      this.$refs.FileDialog.work_id = id
      this.$refs.FileDialog.getFileList()
    }
  }
}
</script>
<style>

</style>
