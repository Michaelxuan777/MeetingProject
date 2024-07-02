<template>
  <div>
    <el-dialog
      :title="IPDetail"
      :visible.sync="dialogFormVisible"
      @close="closeDetail()"
    >
      <el-form>
        <el-row :gutter="25">
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item
              label="IP"
            >
              10.67.98.
              <el-input
                v-model="list.ip"
                style="width: 50px"
              />
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="楼层">
              <el-select
                v-model="list.floor_id"
                placeholder="请选择楼层"
                clearable
                filterable
                no-data-text="无可用楼层"
                class="filter-item"
                style="width: 200px"
                @change="FloorChange"
                @clear="FloorClose"
              >
                <el-option
                  v-for="item in FloorOptions"
                  :key="item.floor_id"
                  :label="item.floor_name"
                  :value="JSON.stringify(item.floor_id)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="科室">
              <el-select
                v-model="list.class_id"
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
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item
              label="设备ID"
            >
              <el-input
                v-model="list.id"
                style="width: 50px"
              />
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="设备类型">
              <el-select
                v-model="list.office_type"
                placeholder="请选择类型"
                clearable
                class="filter-item"
                style="width: 200px"
              >
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="设备名称">
              <el-input
                v-model="list.office_name"
                style="width: 50%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item
              label="操作系统"
            >
              <el-input
                v-model="list.office_system"
                style="width: 50%"
              />
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="设备序列号">
              <el-input
                v-model="list.office_number"
                style="width: 50%"
              />
            </el-form-item>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item label="是否关联打印机">
              <el-switch
                v-model="list.office_print"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="list.office_print === '1' ">
          <el-col :span="16">
            <el-form-item
              label="打印机型号"
            >
              <el-input
                v-model="list.print_model"
                style="width: 50%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
          >
            <el-form-item
              label="使用人"
            >
              <el-input
                v-model="list.person_name"
                style="width: 50%"
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
          icon="el-icon-check"
          type="primary"
          @click="submit()"
        >
          确认修改
        </el-button>
        <el-button
          icon="el-icon-close"
          @click="dialogFormVisible = false"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {GetAllClass, GetAllFloorByStatus, GetClassByFloorId, GetIPByidAndip, UpdateIP, UpdatIP} from "@/api/article";

export default {
  name: 'IPDetail',
  directives: {waves},
  props: ['self'],
  data() {
    return {
      IPDetail: "IP详情",
      dialogFormVisible: false,
      tableKey: 0,
      list: [],
      FloorOptions:[],
      ClassOptions:[],
      TypeOptions:[
        {
          "value":"C",
          "label":"电脑"
      },
        {
          "value":"I",
          "label":"笔记本"
        },
        {
          "value":"P",
          "label":"打印机"
        },
      ]
    }
  },
  created() {
    this.dict()
  },
  mounted() {
  },
  methods: {
    dict(){
      const FloorQuery = {
        "status" : "0"
      }
      //获取楼层下拉框
      GetAllFloorByStatus(FloorQuery).then(response => {
        if (response.status === 200) {
          this.FloorOptions = response.data.data
        } else {
          this.$message.error('获取楼层失败！')
        }
      })
    },
    search(row) {
      const listQuery = {
        "ip": row.ip.toString(),
        "id": row.id.toString(),
        "status": row.status
      }
      GetIPByidAndip(listQuery).then(response => {
        if (response.status === 200) {
          if (response.data.data !== "无数据") {
            this.list = response.data.data
            const ClassQuery = {
              "floor_id" : row.floor_id.toString(),
              "status" : "0"
            }
            //获取科室下拉框
            GetClassByFloorId(ClassQuery).then(response => {
              if (response.status === 200) {
                this.ClassOptions = response.data.data
              } else {
                this.$message({
                  message: '查询失败',
                  type: 'danger'
                })
              }
            })
            if(this.list.office_print === null){
              this.list.office_print = "0"
            }
          }
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
        this.listLoading = false
      })
    },
    submit() {
      if(this.list.person_name === null){
        this.list.person_name = ""
      }
      if(this.list.office_type === null){
        this.list.office_type = ""
      }
      if(this.list.office_name === null){
        this.list.office_name  = ""
      }
      if(this.list.office_system === null){
        this.list.office_system = ""
      }
      if(this.list.office_number === null){
        this.list.office_number = ""
      }
      if(this.list.floor_id === null){
        this.list.floor_id = ""
      }
      if(this.list.class_id === null){
        this.list.class_id = ""
      }
      if(this.list.office_print === null){
        this.list.office_print = ""
      }
      if(this.list.print_model === null){
        this.list.print_model = ""
      }
      const listQuery = {
        "id":this.list.id.toString(),
        "ip":this.list.ip.toString(),
        "floor_id":this.list.floor_id.toString(),
        "class_id":this.list.class_id.toString(),
        "person_name":this.list.person_name,
        "office_type":this.list.office_type,
        "office_name":this.list.office_name,
        "office_system":this.list.office_system,
        "office_number":this.list.office_number.toString(),
        "office_print":this.list.office_print,
        "print_model":this.list.print_model,
        "status":'0'
      }
        this.$confirm("是否确认修改？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "primary"
        }).then(() => {
          UpdateIP(listQuery).then(response => {
            this.$notify({
              title: "成功",
              message: "已提交修改",
              type: "success",
              duration: 2000,
            });
          })
        }).catch(() => {
          this.$message.error('取消操作')
        })
    },
    FloorChange(){
      const ClassQuery = {
        "floor_id" : this.list.floor_id.toString(),
        "status" : "0"
      }
      //获取科室下拉框
      GetClassByFloorId(ClassQuery).then(response => {
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
    FloorClose(){
      this.ClassOptions = []
      this.list.class_id = ""
    },
    closeDetail() {
      this.dialogFormVisible = false
      this.$emit("Button")
    }
  }
}
</script>

<style>
@media screen and (max-width:600px) {
  .el-dialog{
    width: 90% !important;
  }
  .el-form{
    width: 90% !important;
  }
}
</style>
