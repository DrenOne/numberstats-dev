// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
// import authConfig from 'src/configs/auth'

// ** Axios Imports
import { numberStats } from 'src/store/middleware'

// ** Get Sms Campaigns
// export const getSmsCampaigns = createAsyncThunk('sms/campaigns', async (params: any) => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios({
//     method: 'get',
//     baseURL: 'https://cr.numberstats.com/api/v1/velocify/statuses/',
//     params,
//     headers: { Authorization: 'Bearer ' + storedToken }
//   })
//   //   const response = await axios.get('https://dev.numberstats.com/api/v1/velocify/campaigns/', {
//   //     headers: {
//   //       Authorization: 'Bearer ' + storedToken
//   //     },
//   //     params
//   //   })

//   return response.data
// })

export const campaignsSlice = createSlice({
  name: 'smsCampaigns',
  initialState: {
    data: [],
    campaign: null,
    total: 1,
    params: {},
    allData: [],
    isLoading: false,
    addSuccess: false,
    count: 0,
    error: '',
  },
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.allData = []
      state.error = ''
    },
    onSuccess: (state, { payload }) => {
      state.isLoading = false
      state.error = ''
      state.allData = payload.data.results as []
      state.count = payload.data.count
    },
    onGetSuccessCampaign: (state, { payload }) => {
      state.isLoading = false
      state.campaign = payload.data
      state.error = ''
    },
    onFail: (state, { payload }) => {
      state.allData = []
      state.isLoading = false
      state.error = payload as string
    },
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(getSmsCampaigns.pending, state => {
  //       state.isLoading = true
  //       state.allData = []
  //       state.error = ''
  //     })
  //     .addCase(getSmsCampaigns.fulfilled, (state, { payload }) => {
  //       state.isLoading = false
  //       state.error = ''
  //       state.allData = payload.results as []
  //       state.count = payload.count
  //     })
  //     .addCase(getSmsCampaigns.rejected, (state, { payload }) => {
  //       state.allData = []
  //       state.isLoading = false
  //       state.error = payload as string
  //     })
  // }
})

export const getSmsCampaigns = (params: {
  per_page?: string | number
  page?: string | number
  search?: string
  ordering?: string
}) =>
  numberStats({
    url: 'velocify/statuses/',
    method: 'get',
    params,
    onStart: campaignsSlice.actions.onStart.type,
    onSuccess: campaignsSlice.actions.onSuccess.type,
    onFail: campaignsSlice.actions.onFail.type,
  })

export const getSmsCampaign = (id: string) =>
  numberStats({
    url: `velocify/statuses/${id}/`,
    method: 'get',
    onStart: campaignsSlice.actions.onStart.type,
    onSuccess: campaignsSlice.actions.onGetSuccessCampaign.type,
    onFail: campaignsSlice.actions.onFail.type,
  })

export default campaignsSlice.reducer
