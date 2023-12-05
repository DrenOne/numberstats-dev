// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { numberStats } from 'src/store/middleware'

interface DataParams {
  search: string
  page?: number
  per_page: number
  ordering?: string
}

interface CreateParams {
  order: number | string
  template: number | string
  schedule: number | string
  id?: string | number
}

export const templateSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    dataT: [],
    template: null,
    variables: [],
    variableCount: 0,
    total: 1,
    params: {},
    allData: [],
    addError: [],
    errorT: [],
    isLoading: false,
    addSuccess: false,
    addShowT: {},
    errorShow: '',
  },
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.addSuccess = false
      state.dataT = []
      state.errorT = []
      state.addError = []
    },
    onStartGetVariables: state => {
      state.isLoading = true
      state.variables = []
    },
    onStartAddEditTemplate: state => {
      state.isLoading = true
      state.addSuccess = false
    },
    onStartCreateShowTemplate: state => {
      state.addSuccess = true
      state.addShowT = {}
      state.errorShow = ''
    },
    onStartFetchData: state => {
      state.allData = []
    },
    onSuccessFetchData: (state, { payload }) => {
      state.isLoading = false
      state.params = payload.data.params
      state.allData = payload.data.results
      state.total = payload.data.total
      state.addSuccess = false
      // state.dataT = []
    },
    onSuccessGetVariables: (state, { payload }) => {
      state.isLoading = false
      state.variables = payload.data.results
      state.variableCount = payload.data.count
    },
    onFailFetchData: state => {
      state.allData = []
    },
    onSuccessFetchTemplate: (state, { payload }) => {
      state.isLoading = false
      state.dataT = payload.data.results
      state.errorT = []
    },
    onSuccessGetTemplate: (state, { payload }) => {
      state.isLoading = false
      state.template = payload.data
    },
    onSuccessAddEditTemplate: (state, { payload }) => {
      state.isLoading = false
      state.addError = []
      state.addSuccess = true
    },
    onSuccessCreateShowTemplate: (state, { payload }) => {
      state.addSuccess = false
      state.addShowT = payload.status
      state.errorShow = ''
    },
    onFailAddEditTemplate: (state, { payload }) => {
      state.isLoading = false
      state.addError = []
      state.addSuccess = false
    },
    onFailGetVariables: state => {
      state.isLoading = false
      state.variables = []
    },
    onFail: (state, { payload }) => {
      state.isLoading = true
      state.addSuccess = false
      state.dataT = []
      state.errorT = payload.data as []
      // @ts-ignore
      state.addError = payload?.error?.details
      state.addShowT = {}
      state.errorShow = payload as string
    },
  },
})

// ** Fetch Data
export const fetchData = (params: DataParams) =>
  numberStats({
    url: 'notification/templates/',
    method: 'get',
    params,
    onStart: templateSlice.actions.onStartFetchData.type,
    onSuccess: templateSlice.actions.onSuccessFetchData.type,
    onFail: templateSlice.actions.onFailFetchData.type,
  })

// ** Fetch Template
export const fetchTemplate = (id: DataParams) =>
  numberStats({
    url: `velocify/sms_orders/${id}/templates/`,
    method: 'get',
    onStart: templateSlice.actions.onStart.type,
    onSuccess: templateSlice.actions.onSuccessFetchTemplate.type,
    onFail: templateSlice.actions.onFail.type,
  })

// ** Get a Template
export const getTemplate = (id: number | string) =>
  numberStats({
    url: `notification/templates/${id}/`,
    method: 'get',
    onStart: templateSlice.actions.onStart.type,
    onSuccess: templateSlice.actions.onSuccessGetTemplate.type,
    onFail: templateSlice.actions.onFail.type,
  })

export const CreateTemplate = (data: CreateParams) =>
  numberStats({
    url: 'notification/templates/',
    method: 'post',
    data: { ...data, category: 'sms', signal_word: [1] },
    onStart: templateSlice.actions.onStartAddEditTemplate.type,
    onSuccess: templateSlice.actions.onSuccessAddEditTemplate.type,
    onFail: templateSlice.actions.onFailAddEditTemplate.type,
  })

export const deleteTemplate = (sms_id: number | string, id: number | string) =>
  numberStats({
    url: `velocify/sms_orders/${sms_id}/templates/${id}/`,
    method: 'delete',
    onStart: templateSlice.actions.onStartAddEditTemplate.type,
    onSuccess: templateSlice.actions.onSuccessAddEditTemplate.type,
    onFail: templateSlice.actions.onFailAddEditTemplate.type,
  })

export const editTemplate = (data: CreateParams) =>
  numberStats({
    url: `notification/templates/${data.id}/`,
    method: 'put',
    data,
    onStart: templateSlice.actions.onStart.type,
    onSuccess: templateSlice.actions.onSuccessAddEditTemplate.type,
    onFail: templateSlice.actions.onFail.type,
  })

export const CreateShowTemplate = (data: CreateParams) =>
  numberStats({
    url: `velocify/sms_orders/${data.id}/templates/`,
    method: 'post',
    data: { order: data.order, template: data.template, schedule: data.schedule },
    onStart: templateSlice.actions.onStartCreateShowTemplate.type,
    onSuccess: templateSlice.actions.onSuccessCreateShowTemplate.type,
    onFail: templateSlice.actions.onFail.type,
  })

export const getVariables = (params: any) =>
  numberStats({
    url: 'velocify/fields/',
    method: 'get',
    params,
    onStart: templateSlice.actions.onStartGetVariables.type,
    onSuccess: templateSlice.actions.onSuccessGetVariables.type,
    onFail: templateSlice.actions.onFailGetVariables.type,
  })

export default templateSlice.reducer
