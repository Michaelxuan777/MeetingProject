<template>
  <div class="app-container">
    <div class="filter-container">
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
        @click="dialogAddFormVisible = true"
      >
        新增楼层
      </el-button>
      <el-checkbox
        v-model="Status"
        class="filter-item"
        style="margin-left: 30px"
        @change="switchFloorStatus"
      >
        可用楼层
      </el-checkbox>
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
        label="楼层ID"
        prop="id"
        align="center"
        width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.floor_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="楼层名称"
        width="230px"
        align="center"
      >
        <template slot-scope="{row}">
          <el-input
            v-if="row.edit"
            v-model="row.floor_name"
            placeholder="价格"
          />
          <span v-else>{{ row.floor_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改楼层名称"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="medium"
            @click="confirm(scope.row)"
          >
            <i
              class="el-icon-check"
              aria-hidden="true"
            />
          </el-button>
          <div v-else>
            <el-button
              type="primary"
              size="medium"
              @click="editFloorName(scope.row)"
            >
              <i
                class="el-icon-edit"
                aria-hidden="true"
              />
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.creat_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="可用状态"
        width="120px"
        align="center"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="-1"
            @change="changeFloorStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            icon="el-icon-setting"
            size="mini"
            type="primary"
            @click="FloorDetail(row.floor_id)"
          >
            科室详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <FloorDetail
      ref="FloorDetail"
      :self="FloorDetailList"
      style="position: absolute"
    />

    <el-dialog
      :title="AddFloor"
      :visible.sync="dialogAddFormVisible"
      style="width: 100%;"
    >
      <el-form
        label-width="100px"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="楼层名称"
              prop="name"
            >
              <el-input
                v-model="listAddFloor.floor_name"
                placeholder="请输入楼层名称"
                clearable
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
          icon="el-icon-check"
          type="primary"
          @click="AddSubmit"
        >
          新增
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import {AddFloor, GetAllFloorByStatus, stopFloorStatus, updateFloor} from "@/api/article";
import FloorDetail from "@/views/floor/components/FloorDetail.vue";


export default {
  name: 'Floor',
  components: {FloorDetail},
  directives: {waves, permission},
  data() {
    return {
      dialogAddFormVisible: false,
      Status: true,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      AddFloor: "新增楼层",
      id: "",
      tableKey: 0,
      listLoading: false,
      list: [],
      FloorDetailList: [],
      listAddFloor: {
        "floor_name": ""
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      //根据状态查询楼层
      const list = {
        'status' : "0"
      }
      GetAllFloorByStatus(list).then(response => {
        if (response.status === 200) {
          this.list = response.data.data
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
        this.listLoading = false
      })
    },
    searchF() {
      this.listLoading = true
      //根据状态查询楼层
      const list = {
        'status' : "-1"
      }
      GetAllFloorByStatus(list).then(response => {
        if (response.status === 200) {
          this.list = response.data.data
        } else {
          this.$message({
            message: '查询失败',
            type: 'danger'
          })
        }
        this.listLoading = false
      })
    },
    changeFloorStatus(row) {
      const list = {
        "floor_id": row.floor_id.toString(),
        "status": ''
      }
      if(row.status === '-1'){
        list.status = '0'
      }else{
        list.status = '-1'
      }
      stopFloorStatus(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '更改成功',
            type: 'success'
          })
          if(this.Status === true ){
            this.search()
          }else{
            this.searchF()
          }
        } else {
          this.$message({
            message: '更改失败',
            type: 'danger'
          })
          //更改失败重新刷新
          if(this.Status === true ){
            this.search()
          }else{
            this.searchF()
          }
        }
      })
    },
    AddSubmit() {
      console.log(this.listAddFloor)
      AddFloor(this.listAddFloor).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.search()
        } else {
          this.$message({
            message: '新增失败',
            type: 'danger'
          })
          this.search()
        }
        this.dialogAddFormVisible = false
        this.listAddFloor.floor_name = ""
      })
    },
    editFloorName(row) {
      row.edit = true
    },
    confirm(row) {
      row.edit = false;
      const list = {
        "floor_name": row.floor_name,
        "floor_id": row.floor_id.toString(),
        "status": row.status
      }
      updateFloor(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.search()
        } else {
          this.$message({
            message: '保存失败',
            type: 'danger'
          })
          this.search()
        }
      })
      this.search()
    },
    switchFloorStatus() {
      this.listLoading = true
      if (this.Status === true) {
        const list = {
          "status": '0'
        }
        GetAllFloorByStatus(list).then(response => {
          if (response.status === 200) {
            this.list = response.data.data
          } else {
            this.$message({
              message: '查询失败',
              type: 'danger'
            })
          }
          this.listLoading = false
        })
      } else if (this.Status === false) {
        const list = {
          "status": '-1'
        }
        GetAllFloorByStatus(list).then(response => {
          if (response.status === 200) {
            this.list = response.data.data
          } else {
            this.$message({
              message: '查询失败',
              type: 'danger'
            })
          }
          this.listLoading = false
        })
      }
    },
    handleDelete(row, index) {
      {
        this.$confirm("是否删除该条登记，请再次确认", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

        }).catch(() => {
          this.$message.error('取消操作')
        })
      }
    },
    FloorDetail(id) {
      this.$refs.FloorDetail.dialogFormVisible = true
      this.$refs.FloorDetail.searchByFloorId(id)
    }
  }
}
</script>
<style>

</style>
