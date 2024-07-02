<template>
  <div class="app-container">
    <img src="zhongyike.jpg">
    <div class="filter-container">
      <button style="width: 300px;height: 150px;align-self: center;margin-bottom: 10px;margin-left: 160px">
        消息公布
      </button>
      <br>
      <button style="width: 300px;height: 150px;margin-bottom: 10px;margin-left: 160px">
        建议和投诉
      </button>
      <br>
      <button style="width: 300px;height: 150px;margin-bottom: 10px;margin-left: 160px">
        对本市中医药服务满意度调查
      </button>
    </div>
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
  name: 'Zhongyike',
  directives: {waves, permission},
  data() {
    return {
      fullWidth:document.documentElement.clientWidth,
      fullHeight:document.documentElement,clientHeight,
    }
  },
  mounted() {
  },
  created() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount(){
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {

  }
}
</script>
<style>

</style>
