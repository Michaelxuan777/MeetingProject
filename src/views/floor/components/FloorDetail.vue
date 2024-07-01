<template>
  <div>
    <el-dialog
      :title="FloorDetail"
      :visible.sync="dialogFormVisible"
      style="width: 100%;"
      @close="closeDetail()"
    >
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        @click="dialogAddClassVisible = true"
      >
        新增科室
      </el-button>
      <el-checkbox
        v-model="Status"
        class="filter-item"
        style="margin-left: 30px"
        @change="switchClassStatus"
      >
        可用科室
      </el-checkbox>
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
          label="科室ID"
          width="150px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.class_id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="科室名称"
          width="150px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.class_name }}</span>
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
          align="center"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="-1"
              @change="changeClassStatus(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          @click="edit()"-->
        <!--        >-->
        <!--          提交修改-->
        <!--        </el-button>-->
      </div>
    </el-dialog>

    <el-dialog
      :title="AddClass"
      :visible.sync="dialogAddClassVisible"
      style="width: 100%;"
    >
      <el-form
        label-width="100px"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="科室名称"
              prop="name"
            >
              <el-input
                v-model="class_name"
                placeholder="请输入科室名称"
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
import {
  GetAllClass,
  GetClassById,
  GetClassByFloorId,
  stopFloorStatus,
  StopClass,
  GetAllFloorByStatus, AddClass
} from "@/api/article";

export default {
  name: 'FloorDetail',
  directives: {waves},
  props: ['self'],
  data() {
    return {
      FloorDetail: "科室详情",
      AddClass: "新增科室",
      dialogFormVisible: false,
      tableKey: 0,
      listLoading: false,
      list: [],
      dialogAddClassVisible: false,
      floor_id: "",
      Status: true,
      class_name: ""
    }
  },
  created() {
    // this.searchByFloorId()
  },
  mounted() {

  },
  methods: {
    //点开详情根据楼层获取科室
    searchByFloorId(id) {
      if (this.floor_id === "") {
        this.floor_id = id
      }
      const list = {
        "floor_id": id.toString(),
        "status": '0'
      }
      GetClassByFloorId(list).then(response => {
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
      })
    },
    //反状态查询
    searchByFloorId_F(id) {
      if (this.floor_id === "") {
        this.floor_id = id
      }
      const list = {
        "floor_id": id.toString(),
        "status": '-1'
      }
      GetClassByFloorId(list).then(response => {
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
      })
    },
    //更改科室状态
    changeClassStatus(row) {
      const list = {
        "class_id": row.class_id.toString(),
        "status": ''
      }
      if (row.status === '-1') {
        list.status = '0'
      } else {
        list.status = '-1'
      }
      StopClass(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '更改成功',
            type: 'success'
          })
          if (this.Status === true) {
            this.searchByFloorId(this.floor_id)
          } else {
            this.searchByFloorId_F(this.floor_id)
          }
        } else {
          this.$message({
            message: '更改失败',
            type: 'danger'
          })
          //更改失败重新刷新
          if (this.Status === true) {
            this.searchByFloorId(this.floor_id)
          } else {
            this.searchByFloorId_F(this.floor_id)
          }
        }
      })
    },
    //切换可用不可用的checkbox
    switchClassStatus() {
      this.listLoading = true
      if (this.Status === true) {
        const list = {
          "floor_id": this.floor_id.toString(),
          "status": '0'
        }
        GetClassByFloorId(list).then(response => {
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
      } else if (this.Status === false) {
        const list = {
          "floor_id": this.floor_id.toString(),
          "status": '-1'
        }
        GetClassByFloorId(list).then(response => {
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
      }
    },
    AddSubmit() {
      const list = {
        "class_name": this.class_name,
        "floor_id": this.floor_id.toString()
      }
      // console.log(list)
      AddClass(list).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '新增成功',
            type: 'danger'
          })
        } else {
          this.$message({
            message: '新增失败',
            type: 'danger'
          })
        }
        this.searchByFloorId(this.floor_id)
        this.dialogAddClassVisible = false;
        this.class_name = ""
      })
    },
    // searchByClassId(id) {
    //   const list = {
    //     "class_id": '1',
    //     "status": '0'
    //   }
    //   GetClassById(list).then(response => {
    //     if (response.status === 200) {
    //       this.list = response.data.data
    //     } else {
    //       this.$message({
    //         message: '查询失败',
    //         type: 'danger'
    //       })
    //     }
    //   })
    // },
    //关闭时刷新table的list
    closeDetail() {
      this.list = [];
      this.Status = true;
      this.floor_id = ""
    }
  }
}
</script>

<style scoped>

</style>
