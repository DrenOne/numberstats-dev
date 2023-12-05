import ErrorPopup from 'src/components/ErrorPopup'
import axios, { AxiosError, AxiosResponse } from 'axios'
import authConfig from 'src/configs/auth'
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify'
import { createAction } from '@reduxjs/toolkit'
import Api from 'src/types/middleware'

export const numberStats = createAction<Api>('numberStats')

const middleware =
  ({ dispatch }: { dispatch: any }) =>
  (next: any) =>
  (action: any) => {
    if (action.type !== 'numberStats') {
      next(action)
      return
    }

    next(action)

    const { method, url, params, data, onStart, onSuccess, onFail } = action.payload

    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

    const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : null

    dispatch({ type: onStart })

    // @ts-ignore
    axios({
      baseURL: `${
        window.location.hostname === 'localhost'
          ? 'https://dev.numberstats.com'
          : 'https://' + window.location.hostname
      }/api/v1/`,
      method,
      data,
      url,
      params,
      headers,
    })
      .then((res: AxiosResponse) => {
        if (res.status === 200 || res.status === 201) dispatch({ type: onSuccess, payload: res })
        else dispatch({ type: onFail, payload: res })
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          window.location.reload()
        }
        // toast.error(error.message)
        // @ts-ignore
        let errors = error?.response?.data?.error?.details

        const errorPopup = (data: any) => {
          Object?.keys(data).forEach(key => {
            if (typeof data[key] === 'string') toast(ErrorPopup({ title: data[key] }))
            else if (Array.isArray(data[key])) toast(ErrorPopup({ title: data[key][0] }))
            else if (typeof data[key] === 'object' && data[key] !== null) errorPopup(data[key])
          })
        }
        if (errors && Object?.keys(errors)?.length) errorPopup(errors)
        // @ts-ignore
        else toast(ErrorPopup({ title: error.response?.data?.detail as string }))
        // Object.keys(errors).forEach(key => {
        //   if (typeof errors[key] === 'string') toast(ErrorPopup({ title: errors[key] }))
        //   else if (Array.isArray(errors[key])) toast(ErrorPopup({ title: errors[key][0] }))
        //   else if (typeof errors[key] === 'object' && errors[key] !== null)
        //     errorPopup(errors[key])
        // })
        // toast(
        //   ErrorPopup({
        //     // @ts-ignore
        //     title: error?.response?.data?.error?.details?.detail,
        //     // title: error.message,
        //     // subtitle: error?.response?.data?.error?.details?.detail,
        //   })
        // )
        dispatch({ type: onFail, payload: error })
      })
  }

export default middleware
