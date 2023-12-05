// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

import { numberStats } from 'src/store/middleware'

// ** Get Sms Orders
// export const getSmsOrders = createAsyncThunk('sms/orders', async (params: any) => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios({
//     method: 'get',
//     baseURL: 'https://cr.numberstats.com/api/v1/velocify/sms_orders/',
//     // params,
//     headers: { Authorization: 'Bearer ' + storedToken },
//   })
//   //   const response = await axios.get('https://dev.numberstats.com/api/v1/velocify/campaigns/', {
//   //     headers: {
//   //       Authorization: 'Bearer ' + storedToken
//   //     },
//   //     params
//   //   })

//   return response.data
// })

// export const createSmsOrder = createAsyncThunk('sms/createOrder', async (id: number | string) => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios({
//     method: 'post',
//     baseURL: 'https://cr.numberstats.com/api/v1/velocify/sms_orders/',
//     data: { status: id },
//     headers: { Authorization: 'Bearer ' + storedToken },
//   })

//   return response.data
// })

export const ordersSlice = createSlice({
  name: 'smsCampaigns',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    isLoading: false,
    addSuccess: false,
    error: '',
    orderId: '',
  },
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.error = ''
      state.orderId = ''
    },
    onSuccessGetSmsOrders: (state, { payload }) => {
      state.isLoading = false
      state.error = ''
      state.allData = payload.data.results as []
    },
    onSuccessCreateSmsOrder: (state, { payload }) => {
      state.isLoading = false
      state.orderId = payload.data.id as string
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.error = payload as string
      state.orderId = ''
    },
  },
  // extraReducers: builder => {
  //   builder
  // .addCase(getSmsOrders.pending, state => {
  //   state.isLoading = true
  //   state.error = ''
  // })
  // .addCase(getSmsOrders.fulfilled, (state, { payload }) => {
  //   state.isLoading = false
  //   state.error = ''
  //   state.allData = payload.results as []
  // })
  // .addCase(getSmsOrders.rejected, (state, { payload }) => {
  //   state.isLoading = false
  //   state.error = payload as string
  // })
  // .addCase(createSmsOrder.fulfilled, (state, { payload }) => {
  //   state.orderId = payload.id as string
  // })
  // },
})

// ** Get Sms Orders
export const getSmsOrders = (params: any) =>
  numberStats({
    method: 'get',
    url: 'velocify/sms_orders/',
    params,
    onStart: ordersSlice.actions.onStart.type,
    onSuccess: ordersSlice.actions.onSuccessGetSmsOrders.type,
    onFail: ordersSlice.actions.onFail.type,
  })

export const createSmsOrder = (id: number | string) =>
  numberStats({
    url: 'velocify/sms_orders/',
    method: 'post',
    data: { status: id },
    onStart: ordersSlice.actions.onStart.type,
    onSuccess: ordersSlice.actions.onSuccessCreateSmsOrder.type,
    onFail: ordersSlice.actions.onFail.type,
  })

export default ordersSlice.reducer
