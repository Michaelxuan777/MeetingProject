<template>
  <div
    class="app-container"
  >
    <div class="filter-container">
      <el-select
        v-model="floor_id"
        placeholder="请选择楼层"
        clearable
        class="filter-item"
        style="width: 150px"
      >
        <el-option
          v-for="item in FloorOptions"
          :key="item.floor_id"
          :label="item.floor_name"
          :value="item.floor_id"
        />
      </el-select>
      <el-select
        v-model="class_id"
        placeholder="请选择科室"
        clearable
        class="filter-item"
        style="width: 150px"
      >
        <el-option
          v-for="item in ClassOptions"
          :key="item.class_id"
          :label="item.class_name"
          :value="item.class_id"
        />
      </el-select>
      <el-select
        v-model="status"
        placeholder="请选择状态"
        clearable
        class="filter-item"
        style="width: 150px"
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
        @click="search"
      >
        搜索
      </el-button>
      <!--      <el-checkbox-->
      <!--        v-model="Status"-->
      <!--        class="filter-item"-->
      <!--        style="margin-left: 30px"-->
      <!--        @change="switchIPStatus"-->
      <!--      >-->
      <!--        可用楼层-->
      <!--      </el-checkbox>-->
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
        label="IP"
        prop="id"
        align="center"
        width="110x"
      >
        <template slot-scope="{row}">
          <span>{{ row.ip_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="楼层"
        align="center"
        width="50px"
      >
        <template slot-scope="{row}">
          <span>{{ row.floor_name }}</span>
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
        label="使用人"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.person_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更多操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-edit"
            type="primary"
            @click="OpenIPDetail(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="使用状态"
        align="center"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="-1"
            @change="changeIPStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作系统"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.office_system }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备类型"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.office_type == 'C'">电脑</span>
          <span v-if="row.office_type == 'I'">笔记本</span>
          <span v-if="row.office_type == 'P'">打印机</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备名称"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.office_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备序列号"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.office_number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否关联打印机"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.office_print == '1'">是</span>
          <span v-if="row.office_print == '0'">否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="打印机型号"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.print_model }}</span>
        </template>
      </el-table-column>
    </el-table>
    <IPDetail
      ref="IPDetail"
      :self="IPDetailList"
      style="position: absolute"
      @Button="Recieve($event)"
    />
    <!--    <el-pagination-->
    <!--      background-->
    <!--      layout="total, prev, pager, next ,jumper"-->
    <!--      :current-page="currentPage"-->
    <!--      :page-size="pageSize"-->
    <!--      :total="total"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--    />-->
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import {
  GetAllClass,
  GetAllFloorByStatus,
  GetAllIP,
  StopIP,
} from "@/api/article";
import IPDetail from "@/views/ip/components/IPDetail.vue";


export default {
  name: 'IP',
  components: { IPDetail },
  directives: {waves, permission},
  data() {
    return {
      dialogAddFormVisible: false,
      Status: true,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      listLoading:false,
      tableKey:0,
      list:[],
      floor_id:"",
      class_id:"",
      status:"",
      FloorOptions:[],
      ClassOptions:[],
      IPDetailList: [],
      StatusOptions:[
        {
          "status":"0",
          "label":"已使用"
        },
        {
          "status":"-1",
          "label":"未使用"
        }
        ]
    }
  },
  created() {
    this.search()
    this.dict()
  },
  methods: {
    dict(){
      const FloorQuery = {
        "status" : "0"
      }
      const ClassQuery = {
        "status" : "0"
      }
      //获取楼层下拉框
      GetAllFloorByStatus(FloorQuery).then(response => {
        if (response.status === 200) {
          this.FloorOptions = response.data.data
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
      })
      //获取科室下拉框
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
    search() {
      this.listLoading = true
      //根据状态查询楼层
      const list = {
        "floor_id":this.floor_id.toString(),
        "class_id":this.class_id.toString(),
        "status" : this.status,
      }
      GetAllIP(list).then(response => {
        if (response.status === 200) {
          if (response.data.data !== '无数据') {
            this.list = response.data.data
          } else if (response.data.data === '无数据') {
            this.list = []
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
    changeIPStatus(row){
      const list = {
        "id": row.id.toString(),
        "ip": row.ip.toString(),
        "status": '0'
      }
      if(row.status === '-1'){
        list.status = '0'
      }else{
        list.status = '-1'
      }
      this.$confirm("确认修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        StopIP(list).then(response => {
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
            this.search()
            //更改失败重新刷新
          }
        })
      }).catch(() => {
        this.$message.error('取消操作')
        this.search()
      })
    },
    OpenIPDetail(row) {
      this.$refs.IPDetail.dialogFormVisible = true
      this.$refs.IPDetail.search(row)
    },
    Recieve(){
      this.search()
    }
  }
}
</script>
<style>
</style>
