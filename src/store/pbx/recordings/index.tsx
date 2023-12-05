// ** Redux Imports
//import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { numberStats } from 'src/store/middleware'

interface DataParams {
  search: string

  // role: string
  // status: string
  //currentPlan: string
  page: number
  per_page: number
}

// interface Redux {
//   getState: any
//   dispatch: Dispatch<any>
// }

// ** Fetch Recordings
// export const fetchData = createAsyncThunk('pbx/fetchRecordings', async (params: DataParams) => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios.get('/api/v1/dialer-3cx/recordings/', {
//     headers: {
//       Authorization: 'Bearer ' + storedToken
//     },
//     params
//   })

//   // console.log('log ', response.data)

//   return response.data
// })

// ** Get Recording
// export const getRecording = createAsyncThunk('pbx/getRecording', async (id: number | string) => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios.post('/api/v1/dialer-3cx/recordings/' + id + '/aws/', '', {
//     headers: {
//       Authorization: 'Bearer ' + storedToken,
//     },
//   })

//   return response.data
// })

export const pbxRecordingSlice = createSlice({
  name: 'fetchRecordings',
  initialState: {
    isLoading: false,
    data: [],
    total: 1,
    params: {},
    allData: [],
    fileLink: '',
  },
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.fileLink = ''
    },
    onStartGetRecording: state => {},
    onSuccess: (state, { payload }) => {
      state.isLoading = false
      state.data = payload.data.results
      state.total = payload.data.count
      state.params = payload.data.params
      state.allData = payload.data.results
    },
    onSuccessGetRecording: (state, { payload }) => {
      state.fileLink = payload.data.url
    },
    onFail: state => {
      state.isLoading = false
      state.fileLink = ''
    },
    onFailGetRecording: state => {},
    clearFileLink: state => {
      state.fileLink = ''
    }
  },
  // extraReducers: builder => {
  //   builder.addCase(fetchData.fulfilled, (state, action) => {
  //     // console.log(action)
  //     state.data = action.payload.results
  //     state.total = action.payload.count
  //     state.params = action.payload.params
  //     state.allData = action.payload.results
  //   })
  // },
})

// ** Fetch Recordings
export const fetchData = (params: DataParams) =>
  numberStats({
    url: 'dialer-3cx/recordings/',
    method: 'get',
    params,
    onStart: pbxRecordingSlice.actions.onStart.type,
    onSuccess: pbxRecordingSlice.actions.onSuccess.type,
    onFail: pbxRecordingSlice.actions.onFail.type,
  })

// ** Get Recording
export const getRecording = (id: number | string) =>
  numberStats({
    url: 'dialer-3cx/recordings/' + id + '/aws/',
    method: 'post',
    onStart: pbxRecordingSlice.actions.onStartGetRecording.type,
    onSuccess: pbxRecordingSlice.actions.onSuccessGetRecording.type,
    onFail: pbxRecordingSlice.actions.onFailGetRecording.type,
  })

export const { clearFileLink } = pbxRecordingSlice.actions

export default pbxRecordingSlice.reducer
