<template>
  <!--  <div class="app-container">-->
  <iframe
    width="100%"
    height="946px"
    src="http://10.69.225.104:8092/ZTE_OAQ/oa-query.html"
  />
<!--    <div class="filter-container">-->
<!--      发布日期<el-date-picker></el-date-picker>至<el-date-picker></el-date-picker>-->
<!--      公文标题<el-input style="width: 300px"></el-input>-->
<!--      <el-button type="primary" icon="el-icon-search">搜索</el-button>-->
<!--      <el-table-->
<!--        :key="tableKey"-->
<!--        v-loading="listLoading"-->
<!--        :data="list"-->
<!--        border-->
<!--        fit-->
<!--        highlight-current-row-->
<!--        style="width: 100%;"-->
<!--      >-->
<!--        <el-table-column-->
<!--          label="序号"-->
<!--          prop="id"-->
<!--          align="center"-->
<!--          width="150px"-->
<!--        >-->
<!--          <template slot-scope="{row}">-->
<!--            <span>{{ row.id }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="公文标题"-->
<!--          align="center"-->
<!--        >-->
<!--          <template slot-scope="{row}">-->
<!--            <span>{{ row.title }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="发文时间"-->
<!--          align="center"-->
<!--        >-->
<!--          <template slot-scope="{row}">-->
<!--            <span>{{ row.title }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="详情"-->
<!--          align="center"-->
<!--        >-->
<!--          <template slot-scope="{row}">-->
<!--            <el-button-->
<!--              icon="el-icon-setting"-->
<!--              size="mini"-->
<!--              type="primary"-->
<!--              @click="Detail(row.floor_id)">-->
<!--              点击打开-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import {AddFloor, GetAllFloorByStatus, stopFloorStatus, updateFloor} from "@/api/article";
import FloorDetail from "@/views/floor/components/FloorDetail.vue";


export default {
  name: 'Oa',
  directives: {waves, permission},
  data() {
    return {
      List:{
        id: '',
      },

    }
  },
  created() {
  },
  methods: {
    Detail(){

    }
  }
}
</script>
<style>

</style>

