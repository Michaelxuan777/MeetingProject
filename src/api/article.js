import request from '@/utils/request'
import axios from 'axios'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
export function test1(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/GetWjw_Floor', listQuery)
}
//新增楼层
export function AddFloor(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddWjw_Floor', listQuery)
}
//根据状态查询全部楼层
export function GetAllFloorByStatus(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_Floor', listQuery)
}
//停用楼层状态
export function stopFloorStatus(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/StopWjw_Floor', listQuery)
}

export function updateFloor(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdateWjw_Floor', listQuery)
}
//科室增加
export function AddClass(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddWjw_Class', listQuery)
}
//修改科室
export function UpdateClass(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdateWjw_Class', listQuery)
}
//停用科室
export function StopClass(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/StopWjw_Class', listQuery)
}
//查询科室
export function GetAllClass(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_Class', listQuery)
}
//查询单个科室详细信息
export function GetClassByClassId(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/GetWjw_Class', listQuery)
}
//通过楼层查科室
export function GetClassByFloorId(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_ClassByFloorId', listQuery)
}
//设备列表查询
export function GetAllIP(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_Office', listQuery)
}
//单个查询
export function GetIPByidAndip(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/GetWjw_Office', listQuery)
}
export function UpdateIP(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdateWjw_Office', listQuery)
}
//设备停用
export function StopIP(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/StopWjw_Office', listQuery)
}
//添加工单
export function AddTask(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddWjw_Work', listQuery)
}
//修改工单
export function UpdateTask(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdateWjw_Work', listQuery)
}
//停用工单
export function StopTask(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/StopWjw_Work', listQuery)
}
//查询工单
export function GetAllTask(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_Work', listQuery)
}
//通过科室查询工单
export function GetTaskByClassid(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/GetWjw_Work', listQuery)
}
//上传文件
export function UploadFile(listQuery) {
  const file = listQuery;
  const formData = new FormData();
  formData.append('file', file);
  formData.encType = "multipart/form-data"
  //传参数
  return axios({
    method: 'post',
    url: 'http://10.69.225.102:8090/GXK_System/gxkmethod/UploadFile',
    headers: {
      // 'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
//上传文件信息
export function FileInfo(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddWjw_Work_File', listQuery)
}
//文件查询
export function GetFileList(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListWjw_Work_File', listQuery)
}
//下载文件
export function DownFile(url) {
  return axios.get('http://localhost:9527/'+url,{responseType:'blob'}).then(res => {
    console.log(res)
  })
}
//查询人员
export function GetPerson(listQuery) {
    return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/SelectPerson', listQuery)
}
//添加人员
export function AddPerson(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddPerson', listQuery)
}
//修改人员
export function EditPerson(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdatePerson', listQuery)
}
//根据时间查询会议
export function GetMeetingByTime(listQuery) {
    return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/ListMeeting', listQuery)
}
//根据id查询会议
export function GetMeetingById(listQuery) {
    return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/Meeting', listQuery)
}
//增加会议
export function AddMeeting(listQuery) {
    return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/AddMeeting', listQuery)
}
//修改会议
export function UpdateMeeting(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/UpdateMeeting', listQuery)
}
export function GetMeetingByApply(listQuery) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/SelectMeetingByApply', listQuery)
}

