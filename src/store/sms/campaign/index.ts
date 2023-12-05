// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  search: string
  page?: number
  per_page: number
}

interface CreateParams {
  name: string
  title: string
  subject: string
  body: string
  category: 'sms'
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Invoices
export const fetchData = createAsyncThunk('templates/list', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  const response = await axios.get('https://'+ window.location.hostname +'/api/v1/notification/templates/', {
    headers: {
      Authorization: 'Bearer ' + storedToken
    },
    params
  })

  return response.data
})

export const CreateTemplate = createAsyncThunk('templates/create', async (params: CreateParams) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  const response = await axios.post('https://'+ window.location.hostname +'/api/v1/notification/templates/', {
    headers: {
      Authorization: 'Bearer ' + storedToken
    },
    params
  })

  return response.data
})

export const deleteInvoice = createAsyncThunk(
  'appInvoice/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/invoice/delete', {
      data: id
    })
    await dispatch(fetchData(getState().results.params))

    return response.data
  }
)

export const templateSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.invoices
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default templateSlice.reducer
