<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-row>-->
      <!--        <el-button-->
      <!--          v-waves-->
      <!--          class="filter-item"-->
      <!--          type="primary"-->
      <!--          icon="el-icon-plus"-->
      <!--          @click="dialogAddFormVisible = true"-->
      <!--        >-->
      <!--          新增人员-->
      <!--        </el-button>-->
      <!--      </el-row>-->
      <el-select
        v-model="pid"
        placeholder="请选择人员"
        clearable
        filterable
        no-data-text="无数据"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in PersonOptions"
          :key="item.pid"
          :label="item.name"
          :value="JSON.stringify(item.pid)"
        />
      </el-select>
      <el-select
        v-model="class_id"
        placeholder="请选择科室"
        clearable
        filterable
        no-data-text="无可用科室"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in ClassOptions"
          :key="item.class_id"
          :label="item.class_name"
          :value="JSON.stringify(item.class_id)"
        />
      </el-select>
      <el-select
        v-model="status"
        placeholder="请选择状态"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in StatusOptions"
          :key="item.status"
          :label="item.label"
          :value="item.status"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="search()"
      >
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="人员ID"
        align="center"
        width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="科室"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.class_name }}</span>
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
            @click="openEdit(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="50"
      :page-sizes="[50, 100]"
      :current-page="currentPage"
      :total="list.length"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="text"
      :visible.sync="dialogEdit"
      style="width: 100%;"
      @close="dialogEdit = false"
    >
      <el-form
        label-width="100px"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="姓名"
            >
              <el-input
                v-model="userDetail.name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="科室"
            >
              <el-select
                v-model="userDetail.class_id"
                placeholder="请选择科室"
                clearable
                filterable
                no-data-text="无可用科室"
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in ClassOptions"
                  :key="item.class_id"
                  :label="item.class_name"
                  :value="item.class_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="状态"
            >
              <el-switch
                v-model="userDetail.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="-1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="账号"
            >
              <el-button
                v-if="userDetail.account_number === null || userDetail.account_number === '' "
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="AddAcount()"
              >
                点击新增
              </el-button>
              <el-input
                v-if="userDetail.account_number !== '' && userDetail.account_number !== null "
                v-model="userDetail.account_number"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="重置密码"
            >
              <el-button
                icon="el-icon-refresh"
                type="warning"
                @click="resetPassword"
              >
                点击重置
              </el-button>
            </el-form-item>
          </el-col>
          <el-col
            v-if="userDetail.admin !== null"
            :span="7"
          >
            <el-form-item
              label="账号权限"
            >
              <el-select
                v-model="userDetail.admin"
                placeholder="请选择权限"
                filterable
                no-data-text="无数据"
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in adminOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="success"
          icon="el-icon-check"
          @click="saveEdit()"
        >
          保存
        </el-button>
        <el-button @click="dialogEdit = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission'
import FileDialog from '@/views/task/components/FileDialog.vue'
import {
  AddPerson,
  AddTask, EditPerson,
  GetAllClass,
  GetAllTask, GetPerson, stopFloorStatus, StopTask, UpdateIP, UpdateMeeting, UpdateTask, UploadFile,
} from "@/api/article";


export default {
  name: 'Userclass',
  directives: {waves, permission},
  data() {
    return {
      pageSize: 50,
      currentPage: 1,
      total: 0,
      tableKey: 0,
      loading: false,
      AddPerson:"添加人员",
      text:'编辑用户',
      dialogAddFormVisible: false,
      dialogEdit:false,
      ClassOptions:[],
      PersonOptions:[],
      StatusOptions:[
      {
        "status":"0",
        "label":"在用"
      },
      {
        "status":"-1",
        "label":"停用"
      }
    ],
      adminOptions:[
        {
          "value":"0",
          "label":"管理员"
        },
        {
          "value":"1",
          "label":"普通用户"
        },
        {
          "value":"2",
          "label":"科室"
        },
        {
          "value":"3",
          "label":"会议管理员"
        },
      ],
      list: [],
      userDetail:{},
      pid:'',
      class_id:'',
      status:'0',
    }
  },
  mounted() {
  },
  created() {
    const ClassQuery = {
      "status" : "0"
    }
    const PersonQuery = {
      "pid":"",
      "class_id":"",
      "status" : "0"
    }
    GetPerson(PersonQuery).then(response => {
      if(response.data.data !== '无数据'){
        console.log(response)


        this.PersonOptions = response.data.data
      }
    })
    GetAllClass(ClassQuery).then(response => {
      if (response.data.data !== '无数据') {
        this.ClassOptions = response.data.data
      }
    })
    this.search()
    if(sessionStorage.getItem('Admin') !== '0'){
      this.listQuery.class_name = sessionStorage.getItem('ClassName')
      this.listQuery.class_id = sessionStorage.getItem('ClassId')
    }
  },
  methods: {
    search(){
      this.loading = true
      const list = {
        'pid':this.pid,
        'class_id':this.class_id,
        "status": this.status
      }
      GetPerson(list).then(response => {
        if(response.data.data !== "无数据"){
          this.list = response.data.data
          this.loading = false
        }else{
          this.$message({
            message:'没有此用户！',
            type:'warning'
          })
          this.loading = false
        }
      })
    },
    add(){
      if(this.listQuery.name === ""){
        this.$message({
          message: '姓名不能为空',
          type: 'danger'
        })
      }else{
        AddPerson(this.listQuery).then(response => {
          // console.log(response)
          this.search()
          this.dialogAddFormVisible = false
          this.listQuery = {
            name:"",
            class_id:"",
            class_name:"",
            account_number:"",
            account_password:"",
            admin:"1",
            status:""
          }
        })
      }
    },
    openEdit(row){
      this.userDetail = row
      this.dialogEdit = true
    },
    saveEdit(){
      if(this.userDetail.account_number === null){
        this.userDetail.account_number = ''
      }
      if(this.userDetail.account_password === null){
        this.userDetail.account_password = ''
      }
      //默认设定为普通用户
      // if(this.userDetail.admin === null){
      //   this.userDetail.admin = '1'
      // }
      for(let i = 0 ; i < this.ClassOptions.length ; i++){
        if(this.userDetail.class_id === this.ClassOptions[i].class_id ){
          this.userDetail.class_name = this.ClassOptions[i].class_name
        }
      }
      console.log(this.userDetail)
      EditPerson(this.userDetail).then(res => {
        this.$message({
          message:'已保存',
          type:'success'
        })
      })
    },
    resetPassword(){
      this.$confirm("是否重置密码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "primary"
      }).then(() => {
        this.userDetail.account_password = '123456'
        EditPerson(this.userDetail).then(res => {
          this.$message({
            message:'已完成重置，密码为123456，下次登录生效！',
            type:'success'
          })
        })
      }).catch(() => {
        this.$message.error('取消操作')
      })
    },
    AddAcount(){
      this.$prompt('请输入账户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then( ({value}) => {
        this.userDetail.account_number = value
        this.userDetail.account_password = '123456'
        if(this.userDetail.admin === null){
          this.userDetail.admin = '1'
        }
        EditPerson(this.userDetail).then(res => {
          // this.userDetail = res.data.data
          this.$message({
            message:'新增人员账户,初始密码为123456',
            type:'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
</script>
<style>

</style>
