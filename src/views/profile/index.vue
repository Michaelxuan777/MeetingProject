<template>
  <div class="app-container">
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      @click="dialog=true"
    >
      修改密码
    </el-button>
    <el-dialog
      :title="text"
      :visible.sync="dialog"
      style="width: 100%;"
      @close="closeDialog()"
    >
      <el-form
        label-width="100px"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="账户"
            >
              <el-input
                v-model="account"
                placeholder="请输入人员名称"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="原密码"
            >
              <el-input
                v-model="origin_password"
                placeholder="请输入原密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="新密码"
            >
              <el-input
                v-model="password"
                placeholder="请输入新密码"
                show-password
              />
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
          @click="editPassword()"
        >
          修改密码
        </el-button>
        <el-button @click="dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {AddPerson, EditPerson, GetAllClass, GetPerson} from "@/api/article";
import axios from "axios";

export default {
  name: 'Profile',
  data() {
    return {
      list:[],
      text:'修改密码',
      dialog:false,
      account:'',
      origin_password:'',
      password:'',
      editList:{}
    }
  },
  computed: {
  },
  created() {
    // const listquery = {
    //   status:'0'
    // }
    this.account = sessionStorage.getItem('Account')
    // GetPerson(listquery).then(response => {
    //   console.log(response)
    //   if(response.data.data !== '无数据' ){
    //     this.list = response.data.data
    //   }
    // })
  },
  methods: {
    closeDialog(){
      this.dialog = false
    },
    editPassword(){
      if(this.origin_password === '' || this.password === ''){
        this.$message({
          message:'原密码或新密码不能为空！',
          type:'warning'
        })
      } else{
        const user = {
          account_number:this.account,
          account_password:this.origin_password
        }
        axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/CheckPerson', user).then(responseData =>{
          if(responseData.data.data !== '无数据'){
            const list = {
              'pid':sessionStorage.getItem('Pid'),
              'class_id':'',
              "status": '0'
            }
            GetPerson(list).then(response => {
              if(response.data.data !== '无数据'){
                this.editList = response.data.data[0]
                this.editList.account_password = this.password
                EditPerson(this.editList).then(res => {
                  this.$message({
                    message:'修改成功，下次登录生效！',
                    type:'success'
                  })
                  this.password = ''
                  this.origin_password = ''
                  this.dialog = false
                })
              }
            })
          }else{
            this.$message({
              message: '原密码错误！',
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>
