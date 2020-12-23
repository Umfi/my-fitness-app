import { createStore } from 'vuex';

import axios from 'axios'
import { config } from "../config.js"


export const store = createStore({
  state: {
    status: '',
    access_token: localStorage.getItem('access_token') || '',
    user: {},
    is_setup: localStorage.getItem('is_setup') || 'false',
  },
  mutations: {
      auth_request(state){
        state.status = 'loading'
      },
      auth_success(state, payload){
        state.status = 'success'
        state.access_token = payload.access_token
        state.user = payload.user
        state.is_setup = payload.is_setup
      },
      auth_updateuser(state, payload){
        state.user = payload.user
        state.is_setup = payload.is_setup
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
            const user =  resp.data.user;
            const is_setup = resp.data.user.calories > 0 ? 'true' : 'false'; 

            localStorage.setItem('access_token', access_token)
            localStorage.setItem('is_setup', is_setup)

            axios.defaults.headers.common['Authorization'] = "Bearer " + access_token;
            commit('auth_success', {
              access_token: access_token,
              user: user,
              is_setup: is_setup
            })
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
          //localStorage.removeItem('access_token')
          //delete axios.defaults.headers.common['Authorization']
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
            //localStorage.removeItem('access_token')
            //delete axios.defaults.headers.common['Authorization']
            reject(err)
          })
        })
      },
      updateUser({commit}, user){
        return new Promise((resolve) => {
            
            const is_setup = user.calories > 0 ? 'true' : 'false'; 
            localStorage.setItem('is_setup', is_setup)

            commit('auth_updateuser', {
              user: user,
              is_setup: is_setup
            })

            resolve()
        })
    },
  },
  getters : {
    isLoggedIn: state => !!state.access_token,
    authStatus: state => state.status,
    isSetup: state => {
      return state.is_setup == "true" ? true : false; 
    }
  }
})