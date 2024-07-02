import request from '@/utils/request'
import axios from "axios";

export function login(data) {
  return axios.post('http://10.69.225.102:8090/GXK_System/gxkmethod/CheckPerson', data)
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
  })
}
