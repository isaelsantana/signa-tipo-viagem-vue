import * as apiMethods from '../services'
import {
  parseNetworkError
} from '../utils/request'

export const SET_API_CALL_IN_PROGRESS = 'SET_API_CALL_IN_PROGRESS'
export const SET_GENERAL_ERRORS = 'SET_GENERAL_ERRORS'
export const SET_LOADING = 'SET_LOADING'
export const SET_TOAST = 'SET_TOAST'


export default {
  state: {
    isAPICallInProgress: false,
    generalErrors: [],
    loading: {
      show: false,
      message: ''
    },
    toast: {
      show: false,
      color: 'success',
      message: '',
      time: 3000
    }
  },
  mutations: {
    [SET_API_CALL_IN_PROGRESS]: (state, status) => {
      state.isAPICallInProgress = status
    },
    [SET_GENERAL_ERRORS]: (state, error) => {
      state.generalErrors.push(error)
    },
    [SET_LOADING]: (state, payload) => {
      state.loading = {
        ...payload
      }
    },
    [SET_TOAST]: (state, payload) => {
      state.toast = {
        ...state.toast,
        ...payload
      }
    }
  },
  actions: {
    async apiMethods({
      commit
    }, {
      entity,
      action,
      payload = {},
      query,
      params
    }) {
      try {
        const response = await apiMethods[entity][action]({
          payload,
          query,
          params
        })
        return response
      } catch (error) {
        const errorPayload = {
          [`${entity}_${action}_request`]: parseNetworkError(error)
        }
        commit(SET_GENERAL_ERRORS, errorPayload)
      }
    },
    setLoading({
      commit
    }, payload) {
      commit(SET_LOADING, {
        show: true,
        message: payload
      })
    },
    resetLoading({
      commit
    }) {
      commit(SET_LOADING, {
        show: false,
        message: ''
      })
    },
    setToast({
      commit
    }, payload) {
      commit(SET_TOAST, {
        show: true,
        ...payload
      })
    }
  },
  getters: {
    loading(state) {
      return state.loading
    },
    toast(state) {
      return state.toast
    }
  }
}
