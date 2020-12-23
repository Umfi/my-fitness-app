import { createStore } from 'vuex';

import axios from 'axios'
import { config } from "../config.js"


export const store = createStore({
  state: {
    status: '',
    access_token: localStorage.getItem('access_token') || '',
    user : {}
  },
  mutations: {
      auth_request(state){
        state.status = 'loading'
      },
      auth_success(state, access_token, user){
        state.status = 'success'
        state.access_token = access_token
        state.user = user
      },
      auth_error(state){
        state.status = 'error'
      },
      logout(state){
        state.status = ''
        state.access_token = ''
      },
  },
  actions: {
    login({commit}, user){
        return new Promise((resolve, reject) => {
          commit('auth_request')

          axios({url: config.API_BASE_URL + 'login', data: user, method: 'POST' })
          .then(resp => {
            const access_token = resp.data.access_token
            const user = resp.data.user
            localStorage.setItem('access_token', access_token)
            axios.defaults.headers.common['Authorization'] = "Bearer " + access_token;
            commit('auth_success', access_token, user)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('access_token')
            reject(err)
          })
        })
    },
    register({commit}, user){
        return new Promise((resolve, reject) => {
          commit('auth_request')
          axios({url: config.API_BASE_URL + 'register', data: user, method: 'POST' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('access_token')
            reject(err)
          })
        })
      },
      logout({commit}){
        return new Promise((resolve) => {
          axios({url: config.API_BASE_URL + 'logout', method: 'POST' })
          commit('logout')
          localStorage.removeItem('access_token')
          delete axios.defaults.headers.common['Authorization']
          resolve()
        })
      },
      valid({commit}){
        return new Promise((resolve, reject) => {
          axios({url: config.API_BASE_URL + 'valid', method: 'POST' })
          .then(resp => {
            
            if (!resp.data.valid) {
              commit('logout')
              localStorage.removeItem('access_token')
              delete axios.defaults.headers.common['Authorization']
            }

            resolve()
         }).catch(err => {
            commit('logout')
            localStorage.removeItem('access_token')
            delete axios.defaults.headers.common['Authorization']
            reject(err)
          })
        })
      }
  },
  getters : {
    isLoggedIn: state => !!state.access_token,
    authStatus: state => state.status,
  }
})