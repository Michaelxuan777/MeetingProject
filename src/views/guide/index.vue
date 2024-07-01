<template>
  <div class="app-container">
    <aside>
      The guide page is useful for some people who entered the project for the first time. You can briefly introduce the
      features of the project. Demo is based on
      <a
        href="https://github.com/kamranahmedse/driver.js"
        target="_blank"
      >driver.js.</a>
    </aside>
    <!--    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">-->
    <!--      Show Guide-->
    <!--    </el-button>-->
    <el-button @click="test()">
      测试
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import {
  AddClass,
  GetAllClass,
  GetAllDevice,
  GetClassByClassId,
  getStaffList,
  GetAllIP,
  test1
} from '@/api/article';
import axios from "axios";

export default {
  name: 'Guide',
  data() {
    return {
      driver: null,
      listQuery: {
        "floor_name": "1"
      },
      list: ""
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    test() {
      const xhrFile = new XMLHttpRequest();
      xhrFile.open("GET", 'D:/GXK_System_8091/GXK_file/20230828114359594/测试文件.doc', true);
      xhrFile.onload  = function() {
      }
      xhrFile.send();
    }
  }
}
</script>
