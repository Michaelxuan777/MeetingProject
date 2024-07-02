import {login, logout, getInfo} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

let {
  data
} = {data: {
    roles: [], // 身份
    introduction: '',
    avatar: '',
    name: ''
  }};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account_number: username.trim(), account_password: password }).then(response => {
        const { data } = response
        // console.log(data)
        if(data.data.admin === '0'){
          commit('SET_TOKEN', "admin-token")
          setToken("admin-token")
          }
        else if(data.data.admin === '1'){
          commit('SET_TOKEN', "person-token")
          setToken("person-token")
        }
        else if(data.data.admin === '2')
        {
          commit('SET_TOKEN', "class-token")
          setToken("class-token")
        }
        else if(data.data.admin === '3')
        {
          commit('SET_TOKEN', "met-token")
          setToken("met-token")
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if(sessionStorage.getItem('Admin') === '0') {
        data.roles = ['admin']
        data.introduction = '我是管理员'
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        data.name = '管理员'
        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', '管理员')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', '我是管理员')
      } else if(sessionStorage.getItem('Admin') === '1'){
        data.roles = ['person']
        data.introduction = '我是个人账号'
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        data.name = '个人账号'
        commit('SET_ROLES', ['person'])
        commit('SET_NAME', '个人账号')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', '我是个人账号')
      }else if(sessionStorage.getItem('Admin') === '2'){
        data.roles = ['class']
        data.introduction = '我是科室'
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        data.name = '科室'
        commit('SET_ROLES', ['class'])
        commit('SET_NAME', '科室')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', '我是科室')
      }else if(sessionStorage.getItem('Admin') === '3'){
        data.roles = ['met']
        data.introduction = '我是会议'
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        data.name = '会议'
        commit('SET_ROLES', ['met'])
        commit('SET_NAME', '会议')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', '我是科室')
      }
        if (!data) {
          reject('验证失败, 请重新登录.')
        }
        const { roles, name, avatar, introduction } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('你的权限有问题')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_INTRODUCTION', '')
        commit('SET_AVATAR', '')
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_INTRODUCTION', '')
      commit('SET_AVATAR', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
