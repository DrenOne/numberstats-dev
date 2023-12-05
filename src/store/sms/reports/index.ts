// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { numberStats } from 'src/store/middleware'
import { TReportsStore } from 'src/types/sms/reports'

const initialState: TReportsStore = {
  isLoading: false,
  isLoadingGNDRate: false,
  reportsInterval: null,
  reports: null,
  failedReasons: null,
  numbersDeliveryRate: null,
  failedReasonsCount: 0,
  numbersDeliveryRateCount: 0,
  error: '',
}

export const reportsSlice = createSlice({
  name: 'smsReports',
  initialState,
  reducers: {
    // getAction
    onStartGetActions: state => {
      state.isLoading = true
      state.reports = null
    },
    onStartGetNumbersDeliveryRate: state => {
      state.isLoadingGNDRate = true
      state.reports = null
    },
    onSuccessGetReportsInterval: (state, { payload }) => {
      state.isLoading = false
      state.reportsInterval = payload.data
    },
    onSuccessGetReports: (state, { payload }) => {
      state.isLoading = false
      state.reports = payload.data
    },
    onSuccessGetFailedReasons: (state, { payload }) => {
      state.isLoading = false
      state.failedReasonsCount = payload.data.count
      state.failedReasons = payload.data.results
    },
    onSuccessGetNumbersDeliveryRate: (state, { payload }) => {
      state.isLoadingGNDRate = false
      state.numbersDeliveryRateCount = payload.data.count
      state.numbersDeliveryRate = payload.data.results
    },
    onFailGetActions: state => {
      state.isLoading = false
      state.reports = null
    },
    onFailGetNumbersDeliveryRate: state => {
      state.isLoadingGNDRate = false
      state.reports = null
    },
  },
})

// ** Get Reports Interval
export const getReportsInterval = (params: {
  start_date: string
  end_date: string
  option: string
}) =>
  numberStats({
    url: 'reports/sms/interval/',
    method: 'get',
    params,
    onStart: reportsSlice.actions.onStartGetActions.type,
    onSuccess: reportsSlice.actions.onSuccessGetReportsInterval.type,
    onFail: reportsSlice.actions.onFailGetActions.type,
  })

// ** Get Reports
export const getReports = (params: { start_date: string; end_date: string }) =>
  numberStats({
    url: 'reports/sms/',
    method: 'get',
    params,
    onStart: reportsSlice.actions.onStartGetActions.type,
    onSuccess: reportsSlice.actions.onSuccessGetReports.type,
    onFail: reportsSlice.actions.onFailGetActions.type,
  })

// ** Get FailedReasons
export const getFailedReasons = (params: {
  start_date: string
  end_date?: string
  page?: number
  per_page?: number
}) =>
  numberStats({
    url: '/reports/sms/failed-reason/',
    method: 'get',
    params,
    onStart: reportsSlice.actions.onStartGetActions.type,
    onSuccess: reportsSlice.actions.onSuccessGetFailedReasons.type,
    onFail: reportsSlice.actions.onFailGetActions.type,
  })

// ** Get NumbersDeliveryRate
export const getNumbersDeliveryRate = (params: {
  start_date: string
  end_date?: string
  page?: number
  per_page?: number
  ordering?: string
  search?: string
}) =>
  numberStats({
    url: '/reports/sms/numbers-delivery-rate/',
    method: 'get',
    params,
    onStart: reportsSlice.actions.onStartGetNumbersDeliveryRate.type,
    onSuccess: reportsSlice.actions.onSuccessGetNumbersDeliveryRate.type,
    onFail: reportsSlice.actions.onFailGetNumbersDeliveryRate.type,
  })

export default reportsSlice.reducer
