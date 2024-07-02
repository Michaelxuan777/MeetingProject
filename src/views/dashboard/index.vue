<template>
  <div class="demo-app">
    <div class="demo-app-sidebar">
      <div class="demo-app-sidebar-section">
        <div>
          <el-button
            v-permission="['admin','met']"
            type="success"
            style="margin-bottom: 10px"
            @click="dialogExcel = true"
          >
            导出Excel
          </el-button>
          <!--          <el-badge>-->
          <!--            <el-button-->
          <!--              type="primary"-->
          <!--              @click="dialogBack = true;searchF()"-->
          <!--            >-->
          <!--              查看未通过会议-->
          <!--            </el-button>-->
          <!--          </el-badge>-->
        </div>
        <div style="margin: 0">
          <div style="margin-top: 150px">
            <el-tag
              effect="dark"
              color="#12a603"
              style="width: 140px;margin-bottom: 10px;font-size: 17px"
            >
              已审核
            </el-tag>
          </div>
          <div>
            <el-tag
              effect="dark"
              color="#c5a904"
              style="width: 140px;font-size: 17px"
            >
              未审核
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <div
      class="demo-app-main"
    >
      <FullCalendar
        ref="fullCalendar"
        class="demo-app-calendar"
        :options="calendarOptions"
        @datesRender="handleDatesRender"
      >
        <!--        <template v-slot:eventContent="arg">-->
        <!--          <b>{{ arg.timeText }}</b>-->
        <!--          <i>{{ arg.event.title }}</i>-->
        <!--        </template>-->
      </FullCalendar>
      <el-dialog
        :title="MeetingContent"
        :visible.sync="dialogContent"
        style="width: 100%;"
        @close="closeContent()"
      >
        <el-form
          label-width="100px"
        >
          <el-row>
            <el-col :span="9">
              <el-form-item
                label="会议标题"
              >
                <el-input
                  v-model="listM.m_name"
                  placeholder="请输入会议名称"
                  clearable
                  type="textarea"
                  :readonly="Check === '1'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                label="选择会议室"
              >
                <el-select
                  v-model="listM.m_class_id"
                  placeholder="请选择会议室"
                  filterable
                  class="filter-item"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in ClassOptions"
                    :key="item.class_id"
                    :label="item.class_name"
                    :value="item.class_id"
                    :disabled="Check === '1'"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item
                label="会议时间"
              >
                <el-date-picker
                  v-if="Check === '0'"
                  v-model="start"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="08:00:00"
                  :picker-options="pickerOptions"
                /><span v-if="Check === '0'">至</span>
                <el-date-picker
                  v-if="Check === '0'"
                  v-model="end"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="08:00:00"
                  :picker-options="pickerOptions"
                />
                <el-date-picker
                  v-if="Check === '1'"
                  v-model="listM.m_start_time"
                  type="datetime"
                  readonly
                /><span v-if="Check === '1'">至</span>
                <el-date-picker
                  v-if="Check === '1'"
                  v-model="listM.m_end_time"
                  type="datetime"
                  readonly
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-select
                v-model="listM.m_noon"
                placeholder="请选择上下午"
              >
                <el-option
                  v-for="item in TimeOptions"
                  :key="item.id"
                  :label="item.time"
                  :value="item.time"
                  :disabled="Check === '1'"
                />
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="9"
            >
              <el-form-item
                v-if="Check === '1'"
                label="科室"
              >
                <el-input
                  v-model="listM.m_apply_name"
                  :readonly="Check === '1'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="会议内容"
                prop="text"
              >
                <el-input
                  v-model="listM.m_content"
                  type="textarea"
                  rows="6"
                  cols="20"
                  :readonly="Check === '1'"
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
            v-if=" Check === '1'"
            v-permission="['admin','met']"
            icon="el-icon-circle-close"
            type="danger"
            @click="deleteMeeting()"
          >
            删除该会议
          </el-button>
          <el-button @click="dialogContent = false">
            取消
          </el-button>
          <el-button
            v-if=" Check === '1' && listM.m_check === '-1' "
            v-permission="['admin','met']"
            icon="el-icon-check"
            type="success"
            @click="ShenHe"
          >
            审核通过
          </el-button>
          <el-button
            v-if=" Check === '1' && listM.m_check === '-1' "
            v-permission="['admin','met']"
            icon="el-icon-remove"
            type="danger"
            @click="open"
          >
            不予通过
          </el-button>
          <el-button
            v-if="Check === '0'"
            icon="el-icon-check"
            type="primary"
            @click="MeetingSubmit"
          >
            提交
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="Back"
        :visible.sync="dialogBack"
        style="width: 100%;"
        @close="closeContent()"
      >
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="meetingList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            label="会议ID"
            prop="id"
            align="center"
            width="150px"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申请科室"
            width="230px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_apply_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申请会议地点"
            width="150px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_class_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="会议时间"
            width="150px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_start_time }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="驳回原因"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        :title="excel"
        :visible.sync="dialogExcel"
        style="width: 120%;"
      >
        <el-date-picker
          v-model="excelTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']"
        />
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="searchM()"
        >
          查询
        </el-button>
        <el-button
          v-if="download === '1'"
          type="success"
          style="margin-left: 20px"
          @click="exportExcel()"
        >
          导出
        </el-button>
        <el-table
          id="myTable"
          :data="excelTable"
          style="width: 100%"
        >
          <el-table-column
            prop="m_start_time"
            label="日期"
            width="180"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_start_time }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="m_apply_name"
            label="科室"
            width="180"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_apply_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="m_class_name"
            label="会议室"
            width="180"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_class_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="m_content"
            label="会议内容"
          >
            <template slot-scope="{row}">
              <span>{{ row.m_content }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import {INITIAL_EVENTS, createEventId} from './event-utils'
import {AddMeeting, GetMeetingByApply, GetMeetingById, GetMeetingByTime, UpdateMeeting} from "@/api/article";
import XLSX from 'xlsx'

export default {
  name: 'Dashboard',
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  directives: {waves, permission},
  data: function () {
    return {
      calendarOptions: {
        locale: 'zh-cn',
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        // height: 900,//高度
        aspectRatio: 1.2,//单元格长宽比
        handleWindowResize: true,
        // weekMode:'fixed',
        // headerToolbar: {
        //   left: 'prev',
        //   center: 'title',
        //   right:'next today'
        //   // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        // },
        initialView: 'dayGridMonth',
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        dragScroll: false,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEventRows: 6,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        selectInfo: "",
        events: [],
        customButtons: {
          prev: {
            text: "<",
            click: () => {
              this.prevWeekClick();
            }
          },
          next: {
            text: ">",
            click: () => {
              this.nextWeekClick();
            }
          },
          today: {
            text: "今天",
            click: () => {
              this.toDayClick();
            }
          }
        },
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      testData: [],
      currentEvents: [],
      Check: '0',//0为会议申请状态，打开可提交的框，1为查看会议内容状态
      MeetingContent: '会议内容',
      excel:'会议导出',
      dialogExcel:false,
      dialogContent: false,
      dialogBack: false,
      Back: '未通过会议',
      listM: {
        m_id: '',
        m_name: '',
        m_content: '',
        m_apply_id: '',
        m_apply_name: '',
        m_class_id: '',
        m_class_name: '',
        m_start_time: '',
        m_end_time: '',
        m_check: '-1',
        m_noon: '',
        m_reason: '',
        m_status: '0'
      },
      timeList: {},
      ClassOptions: [
        {class_id: '24', class_name: '7楼大会议室'},
        {class_id: '28', class_name: '9楼小会议室'},
        {class_id: '29', class_name: '9楼大会议室'}
      ],
      TimeOptions: [
        {id: '1', time: '上午'},
        {id: '2', time: '下午'},
      ],
      id:'',
      selectTime:'',
      start:'',
      end:'',
      nowTimes:'',
      // pickerOptions: {
      //   disabledDate(time) {
      //     const start = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
      //     return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000 || time.getTime() > new Date().getTime() + (start - new Date().getTime());
      //   }
      // },
      value1:'',
      tableKey: 0,
      listLoading: false,
      meetingList: [],
      excelTime:'',
      excelTable:[],//显示excel内容的
      download:'0'//是否可下载
    }
  },
  // mounted() {
  //   this.calendarApi = this.$refs.fullCalendar.getApi()
  // },
  computed: {
    pickerOptions() {
      const _this = this;
      return {
        disabledDate(time) {
          const time1 = _this.nowTimes.getTime()+60 * 1000;
          return time.getTime() < time1 - 8.64e7  || time.getTime() > time1
        }
      }
    }
  },
  mounted() {
    let calendarApi = this.$refs['fullCalendar'].getApi();
    const startTime = calendarApi.view.activeStart;
    const endTime = calendarApi.view.activeEnd;
    let list = {
      start: this.transTime(startTime),
      end: this.transTime(endTime),
      status: "0"
    }
    this.timeList = list
    GetMeetingByTime(list).then(response => {
      this.trans(response.data.data)
    })
    this.reSearch()
  },
  methods: {
    //排除周末
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    reSearch(){
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          GetMeetingByTime(this.timeList).then(response => {
            this.trans(response.data.data)
          })
        },0)
      },120000)
    },
    //转化得到的会议列表然后显示在日历里面
    trans(list) {
      let a = {
        id: '',
        title: '',
        start: '',
        color: ''
      }
      //处理得到的数据然后填进日历
      for (let i = 0; i < list.length; i++) {
        switch (list[i].m_check) {
          case "0":
            a = {
              id: list[i].m_id,
              title: list[i].m_noon + '\u3000' + list[i].m_class_name,
              start: list[i].m_start_time.slice(0, 10),
              color: '#12a603'
            }
            this.testData.push(a)
            break;
          case "-1":
            a = {
              id: list[i].m_id,
              title: list[i].m_noon + '\u3000' + list[i].m_class_name,
              start: list[i].m_start_time.slice(0, 10),
              color: '#c5a904'
            }
            this.testData.push(a)
            break;
        }
      }
      this.calendarOptions.events = this.testData
      this.testData = []
    },
    //点击日期预约
    handleDateSelect(selectInfo) {
      let a = new Date()
      // console.log(a)
      if( a > selectInfo.end){
        this.$message({
          message: '你不可预约今日之前的日期',
          type: 'warning'
        })
      }else{
        this.Check = '0'
        let calendarApi = selectInfo.view.calendar
        let calendarFunc = calendarApi.view.calendar
        calendarFunc.unselect()
        let getEvents = calendarFunc.getEvents()
        // console.log(selectInfo, '1')//获取点击信息
        this.nowTimes = selectInfo.start
        this.selectTime = selectInfo.startStr
        this.dialogContent = true
        calendarApi.unselect() // clear date selection
        this.selectInfo = selectInfo  //把点击信息存起来
      }
      // calendarApi.addEvent({
      //   id: createEventId(),
      //   title:'test',
      //   start: selectInfo.startStr,
      //   end: selectInfo.endStr,
      //   allDay: selectInfo.allDay
      // })
    },
    //点击事件触发
    handleEventClick(clickInfo) {
      // console.log(clickInfo,'1')
      this.Check = '1'
      // console.log(clickInfo.event.startStr)
      this.selectTime = clickInfo.event.startStr
      this.dialogContent = true
      this.id = clickInfo.event.id
      let list = {
        id:clickInfo.event.id.toString(),
        status:"0"
      }
      GetMeetingById(list).then(response => {
        this.listM = response.data.data
      })
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    //审核
    ShenHe() {
      //修改审核状态为0
      this.listM.m_check = '0'
      this.listM.m_reason = ''
      UpdateMeeting(this.listM).then(response => {
        if(response.status === 200 ){
          this.$message({
            message: '申请已通过',
            type: 'success'
          })
          GetMeetingByTime(this.timeList).then(response => {
            this.trans(response.data.data)
          })
        }
      })
      this.dialogContent = false
    },
    //提交会议申请
    MeetingSubmit() {
      // let date = new Date()
      // let year = date.getFullYear()
      // let month = date.getMonth()+1
      // let day = date.getDate()
      // let hour = date.getHours()
      // let min = date.getMinutes()
      this.listM.m_apply_id = sessionStorage.getItem('ClassId')
      this.listM.m_apply_name = sessionStorage.getItem('ClassName')
      for(let i = 0 ; i < this.ClassOptions.length ; i++){
        if(this.listM.m_class_id === this.ClassOptions[i].class_id ){
          this.listM.m_class_name = this.ClassOptions[i].class_name
        }
      }
      if(this.start !== '' && this.end !== ''){
        if (this.listM.m_noon === "上午") {
          this.listM.m_start_time = this.transTime(this.start)
          this.listM.m_end_time = this.transTime(this.end)
          console.log(this.listM,1)
          AddMeeting(this.listM).then(response => {
            console.log(response,2)
            if(response.data.data === "有重复时间段的会议"){
              this.$message({
                message: '申请会议失败，申请时间段已有会议',
                type: 'warning'
              })
            }
            else if(response.data.data !== "有重复时间段的会议"){
              GetMeetingByTime(this.timeList).then(response => {
                this.trans(response.data.data)
                this.dialogContent = false
                this.$message({
                  message: '申请会议成功',
                  type: 'success'
                })
              })
            }
          })
        }else if (this.listM.m_noon === "下午") {
          this.listM.m_start_time = this.transTime(this.start)
          this.listM.m_end_time = this.transTime(this.end)
          console.log(this.listM,1)
          AddMeeting(this.listM).then(response => {
            console.log(response,2)
            if(response.data.data === "有重复时间段的会议"){
              this.$message({
                message: '申请会议失败，申请时间段已有会议',
                type: 'warning'
              })
            }
            else if(response.data.data !== "有重复时间段的会议"){
              GetMeetingByTime(this.timeList).then(response => {
                this.trans(response.data.data)
                this.dialogContent = false
                this.$message({
                  message: '申请会议成功',
                  type: 'success'
                })
              })
            }
          })
        }else if (this.listM.m_noon === ""){
          this.$message({
            message: '申请会议失败，请填写完整会议信息',
            type: 'warning'
          })
        }
      }else {
        this.$message({
          message: '申请会议失败，请填写完整会议信息',
          type: 'warning'
        })
      }
    },
    deleteMeeting(){
      // console.log(this.listM)
      this.listM.m_status = '-1'
      UpdateMeeting(this.listM).then(response => {
        if(response.status === 200){
          GetMeetingByTime(this.timeList).then(response => {
            this.trans(response.data.data)
          })
        }
      })
      this.dialogContent = false
    },
    //关闭填写框
    closeContent() {
      const list = {
        m_apply_id :'',
        m_check:'',
        m_status:''
      }
      this.start = ''
      this.end = ''
      this.listM = {
        m_id: '',
        m_name: '',
        m_content: '',
        m_apply_id: '',
        m_apply_name: '',
        m_class_id: '',
        m_class_name: '',
        m_start_time: '',
        m_end_time: '',
        m_check: '-1',
        m_noon: '',
        m_reason: '',
        m_status: '0'
      }
      this.id = ''
    },
    open() {
      this.$prompt('请输入理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then( ({value}) => {
        this.listM.m_reason = value
        this.listM.m_check = '-2'
        this.listM.m_status = '-1'
        UpdateMeeting(this.listM).then( response => {
          if (response.status === 200) {
            this.$message({
              message: '申请已驳回',
              type: 'success'
            })
            this.deleteData(this.id)
          } else {
            this.$message({
              message: '驳回失败',
              type: 'warning'
            })
          }
          this.dialogContent = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        });
      });
    },
    prevWeekClick() {
      let calendarApi = this.$refs['fullCalendar'].getApi();
      calendarApi.prev();
      const startTime = calendarApi.view.activeStart;
      const endTime = calendarApi.view.activeEnd;
      this.$emit('clickPreNext', startTime, endTime)//拿到的日期格式传给父组件
      let list = {
        start: this.transTime(startTime),
        end: this.transTime(endTime),
        status: "0"
      }
      this.timeList = list
      GetMeetingByTime(list).then(response => {
        this.trans(response.data.data)
      })
    },
    // 下周点击
    nextWeekClick() {
      let calendarApi = this.$refs['fullCalendar'].getApi();
      calendarApi.next();
      const startTime = calendarApi.view.activeStart;
      const endTime = calendarApi.view.activeEnd;
      this.$emit('clickPreNext', startTime, endTime)
      let list = {
        start: this.transTime(startTime),
        end: this.transTime(endTime),
        status: "0"
      }
      this.timeList = list
      GetMeetingByTime(list).then(response => {
        this.trans(response.data.data)
      })
    },
    toDayClick() {
      let calendarApi = this.$refs['fullCalendar'].getApi();
      calendarApi.today();
      const startTime = calendarApi.view.activeStart;
      const endTime = calendarApi.view.activeEnd;
      this.$emit('clickPreNext', startTime, endTime)
      let list = {
        start: this.transTime(startTime),
        end: this.transTime(endTime),
        status: "0"
      }
      this.timeList = list
      GetMeetingByTime(list).then(response => {
        this.trans(response.data.data)
      })
    },
    deleteData(id) {
      let calendarApi = this.$refs['fullCalendar'].getApi()
      let calendarFunc = calendarApi.view.calendar
      let getEvents = calendarFunc.getEvents()
      if (getEvents && getEvents.length > 0) {//如果日历看板之前有数据，那么删除之前的数据
        if(id){
          calendarFunc.getEventById(id).remove()//删除当前条预约
        }
      }
    },
    searchF(){
      const list = {
        m_apply_id:sessionStorage.getItem('ClassId'),
        m_check:'-2',
        m_status:'-1'
      }
      GetMeetingByApply(list).then( response => {
        // console.log(response)
        if(response.status === 200){
          this.meetingList = response.data.data
        }
      })
    },
    searchM(){
      if(this.excelTime === '') {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
      }else{
        let list = {
          start: this.transTime(this.excelTime[0]),
          end: this.transTime(this.excelTime[1]),
          status: "0"
        }
        GetMeetingByTime(list).then(response => {
          if(response.status === 200){
            this.excelTable = response.data.data
            this.download = '1'
          }
        })
      }
    },
    exportExcel() {
      if (this.excelTime === '') {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
      } else {
        let workbook = XLSX.utils.book_new()
        let tableDom = document.getElementById('myTable').cloneNode(true)
        //当element ui表格使用fixed属性时，会多出一个表格，导致导出的表格内容重复，删掉就可以了
        // tableDom.removeChild(tableDom.querySelector('.el-table__fixed'))
        //  将 DOM TABLE 元素转换为工作表
        try {
          let ws = XLSX.utils.table_to_sheet(tableDom)
          //3.将工作表附加到工作薄
          XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1')
          //打印工作薄
          // console.log(workbook)
          // 4.尝试写入wb到filename。在基于浏览器的环境中，它将尝试强制客户端下载。
          XLSX.writeFile(workbook, '会议概览.xlsx', {bookType: 'xlsx', type: 'array'})
          this.download = '0'
          this.dialogExcel = false
          this.excelTable = []
        } catch (e) {
          this.$message.error('导出失败')
        }
      }
    },
    //获取切换后的日期范围
    handleDatesRender(arg) {
      console.log(arg.currentStart)
      console.log(arg.currentEnd)
    },
  }
}
</script>

<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
//min-height: 100%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
}

.demo-app-sidebar {
  width: 200px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
  margin: 0;
}

.demo-app-sidebar-section {
  padding: 2em;
  margin: 0;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
  font-size: 20px;
  margin: 0;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 ;
}

</style>
