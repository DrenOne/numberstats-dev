// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

// ** Get Sms Domains
export const getSmsDomains = createAsyncThunk('sms/domains', async (params: any) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  const response = await axios({
    method: 'get',
    baseURL: 'https://dev.numberstats.com/api/v1/velocify/sms_domains/',
    // params,
    headers: { Authorization: 'Bearer ' + storedToken }
  })

  return response.data
})

export const domainsSlice = createSlice({
  name: 'smsDomains',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    isLoading: false,
    addSuccess: false,
    error: ''
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSmsDomains.pending, state => {
        state.isLoading = true
        state.error = ''
      })
      .addCase(getSmsDomains.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.error = ''
        state.allData = payload.results as []
      })
      .addCase(getSmsDomains.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as string
      })
  }
})

export default domainsSlice.reducer
