// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { numberStats } from 'src/store/middleware'

export const providersSlice = createSlice({
  name: 'smsProviders',
  initialState: {
    isLoading: false,
    data: [],
    actions: [],
    count: 0,
    error: '',
  },
  reducers: {
    // getAction
    onStartGetActions: state => {
      state.isLoading = true
      state.actions = []
    },
    onSuccessGetActions: (state, { payload }) => {
      state.isLoading = true
      state.actions = payload.data
    },
    onFailGetActions: state => {
      state.isLoading = true
      state.actions = []
    },
    // getProviderTable
    onStartGetProviderTable: state => {
      state.isLoading = true
      state.data = []
    },
    onSuccessGetProviderTable: (state, { payload }) => {
      state.isLoading = false
      state.data = payload.data.results
      state.count = payload.data.count
    },
    onFailGetProviderTable: state => {
      state.isLoading = false
      state.data = []
    },
  },
})

// ** Get Sms Orders
export const getActions = () =>
  numberStats({
    url: 'carrier/providers/',
    method: 'get',
    onStart: providersSlice.actions.onStartGetActions.type,
    onSuccess: providersSlice.actions.onSuccessGetActions.type,
    onFail: providersSlice.actions.onFailGetActions.type,
  })

export const getProviderTable = (url: string, params?: any) =>
  numberStats({
    url,
    params,
    method: 'get',
    onStart: providersSlice.actions.onStartGetProviderTable.type,
    onSuccess: providersSlice.actions.onSuccessGetProviderTable.type,
    onFail: providersSlice.actions.onFailGetProviderTable.type,
  })

export default providersSlice.reducer
