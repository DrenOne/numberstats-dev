import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { numberStats } from 'src/store/middleware'

interface data {
  email: string
}

export const resetPassword = createSlice({
  name: 'resetPassword',
  initialState: {
    data: '',
    isLoading: false,
    isError: '',
    error: '',
  },
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.isError = ''
    },
    onSuccessReset_password: (state, { payload }) => {
      state.isLoading = false
      state.isError = ''
      toast.success(payload.data.detail)
    },
    onSuccess: (state, { payload }) => {
      state.isLoading = false
      state.isError = ''
      state.data = payload.data.detail
      toast.success(payload.data.detail)
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.isError = payload as string
      toast.error(payload.response?.data?.detail)
    },
    onFailConfirmNewPassword: (state, { payload }) => {
      state.isLoading = false
      state.isError = ''
      state.error = payload.response?.data?.error?.details
      console.log(payload)
      toast.error(payload.response?.data?.detail)
    },
  },
})

export const reset_password = (data: data) =>
  numberStats({
    url: 'account/password/reset/',
    method: 'post',
    data,
    onStart: resetPassword.actions.onStart.type,
    onSuccess: resetPassword.actions.onSuccess.type,
    onFail: resetPassword.actions.onFail.type,
  })

export const confirmPassword = (uidb64: string, token: string, data: { new_password: string }) =>
  numberStats({
    url: `account/password/reset/confirm/${uidb64}/${token}/`,
    method: 'put',
    data,
    onStart: resetPassword.actions.onStart.type,
    onSuccess: resetPassword.actions.onSuccess.type,
    onFail: resetPassword.actions.onFailConfirmNewPassword.type,
  })

export default resetPassword.reducer
