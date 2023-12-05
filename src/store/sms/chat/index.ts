// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { Dispatch } from 'redux'
import { ChangeStatus, SendMsgParamsType } from 'src/types/sms/chatTypes'
import { numberStats } from 'src/store/middleware'
import { toast } from 'react-toastify'
import MessagePopup from 'src/components/MessagePopup'

// ** Fetch User Profile
// export const fetchUserProfile = createAsyncThunk('smsChat/fetchUserProfile', async () => {
//   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//   const response = await axios.get('https://cr.numberstats.com/api/v1/account/me/', {
//     headers: {
//       Authorization: 'Bearer ' + storedToken,
//     },
//   })

//   // console.log('UserProfile', response.data)

//   return response.data
// })

// ** Fetch retrieveLead
// export const retrieveLead = createAsyncThunk(
//   'smsChat/retrieveLead',
//   async (id: number | string) => {
//     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//     const response = await axios.get(`https://cr.numberstats.com/api/v1/velocify/leads/${id}/`, {
//       headers: {
//         Authorization: 'Bearer ' + storedToken,
//       },
//     })

//     // console.log('UserProfile', response.data)

//     return response.data
//   }
// )

// ** Fetch Chats & Contacts
// export const fetchChatsContacts = createAsyncThunk(
//   'smsChat/fetchChatsContacts',
//   async ({
//     per_page,
//     search,
//     page,
//   }: {
//     per_page?: string | number
//     search?: string
//     page?: string | number
//   }) => {
//     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//     const response = await axios.get('https://cr.numberstats.com/api/v1/chats/rooms/', {
//       headers: {
//         Authorization: 'Bearer ' + storedToken,
//       },
//       params: { per_page, search, page },
//       // params
//     })

//     // console.log('ChatContacts', response.data)

//     return response.data
//   }
// )

// ** Select Chat
// export const selectChat = createAsyncThunk(
//   'smsChat/selectChat',
//   async (id: number | string, { dispatch }: { dispatch: Dispatch<any> }) => {
//     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//     const response = await axios.get(
//       'https://cr.numberstats.com/api/v1/chats/rooms/' + id + '/messages/',
//       {
//         headers: {
//           Authorization: 'Bearer ' + storedToken,
//         },
//       }
//     )
//     // @ts-ignore
//     await dispatch(fetchChatsContacts())

//     return response.data
//   }
// )

// ** Send Msg
// export const sendMsg = createAsyncThunk(
//   'smsChat/sendMsg',
//   async (obj: SendMsgParamsType, { dispatch }) => {
//     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//     const response = await axios.post(
//       'https://cr.numberstats.com/api/v1/chats/rooms/' + obj.chat?.id + '/messages/',
//       {
//         message: obj.message,
//       },
//       {
//         headers: {
//           Authorization: 'Bearer ' + storedToken,
//         },
//       }
//     )
//     if (obj.contact) {
//       await dispatch(selectChat(obj.chat.id))
//     }
//     // @ts-ignore
//     await dispatch(fetchChatsContacts())

//     return response.data
//   }
// )

// ** Change Status
// export const changeStatus = createAsyncThunk(
//   'smsChat/changeStatus',
//   async (data: ChangeStatus, { rejectWithValue }) => {
//     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
//     try {
//       const response = await axios({
//         method: 'put',
//         url: `https://cr.numberstats.com/api/v1/velocify/leads/${data.id}/`,
//         headers: { Authorization: 'Bearer ' + storedToken },
//         data,
//       })

//       return response.data
//     } catch (error: any) {
//       if (!error.response) {
//         throw error
//       }

//       return rejectWithValue(error.response.data.error.details)
//     }
//   }
// )

export const smsChatSlice = createSlice({
  name: 'smsChat',
  initialState: {
    isLoading: false,
    isLoadingChat: false,
    isLoadingSendMsg: false,
    chats: [],
    lastMessage: '',
    countRooms: '',
    contacts: null,
    userProfile: null,
    selectedChat: null,
    retrieveLead: {},
    isLoadingChangeStatus: false,
    changeStatusSuccess: '',
    SendMsgSuccess: '',
    changeStatusError: '',
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    },
    // ** FetchUserProfile
    onStartFetchUserProfile: state => {},
    onSuccessFetchUserProfile: (state, { payload }) => {
      state.isLoading = false
      state.isLoadingChat = false
      state.userProfile = payload.data
    },
    onFailFetchUserProfile: state => {},
    // ** RetrieveLead
    onStartRetrieveLead: state => {},
    onSuccessRetrieveLead: (state, { payload }) => {
      state.isLoading = false
      state.isLoadingChat = false
      state.retrieveLead = payload.data
    },
    onFailRetrieveLead: state => {},
    // ** FetchChatsContacts
    onStartFetchChatsContacts: state => {
      state.isLoadingChat = true
      state.countRooms = ''
      state.chats = []
    },
    onSuccessFetchChatsContacts: (state, { payload }) => {
      // state.contacts = action.payload.contacts
      state.isLoadingChat = false
      state.countRooms = payload.data.count
      state.chats = payload.data.results
    },
    onFailFetchChatsContacts: state => {
      state.isLoadingChat = false
      state.countRooms = ''
      state.chats = []
    },
    // ** SelectChat
    onStartSelectChat: state => {
      state.isLoading = true
      state.SendMsgSuccess = ''
      state.selectedChat = null
    },
    onSuccessSelectChat: (state, { payload }) => {
      state.isLoading = false
      state.selectedChat = payload.data
    },
    onFailSelectChat: state => {
      state.isLoading = false
    },
    // ** SendMsg
    onStartSendMsg: state => {
      state.isLoadingSendMsg = true
      state.SendMsgSuccess = ''
    },
    onSuccessSendMsg: (state, { payload }) => {
      state.isLoadingSendMsg = false
      state.SendMsgSuccess = payload.data
    },
    onFailSendMsg: state => {
      state.isLoadingSendMsg = false
    },
    // ** ChangeStatus
    onStartChangeStatus: state => {
      state.isLoadingChangeStatus = true
      state.changeStatusSuccess = ''
      state.changeStatusError = ''
    },
    onSuccessChangeStatus: (state, { payload }) => {
      state.isLoadingChangeStatus = false
      state.changeStatusSuccess = payload.data
    },
    onFailChangeStatus: (state, { payload }) => {
      state.isLoadingChangeStatus = false
      state.changeStatusSuccess = ''
      state.changeStatusError = payload as string
    },
    onSuccessRecieveMessage: (state, { payload }) => {
      const data = JSON.parse(payload)
      if (data.event === 'velocify_chat') {
        // notification
        // @ts-ignore
        if (data.data.id !== state?.selectedChat?.chat?.id)
          toast(
            MessagePopup({
              title: data.data?.fullName,
              subtitle: data.data?.chat.lastMessage.message,
            }),
            { autoClose: 5000 }
          )
        // add last message
        // @ts-ignore
        else if (data.data.id === state?.selectedChat?.chat?.id)
          // @ts-ignore
          state.selectedChat.chat.chat.push(data?.data?.chat?.lastMessage)

        state.lastMessage = data.data
      }
      // //@ts-ignore
      // if(payload.data.id !== state.selectedChat.chat.id)
      // toast.info(payload.data?.chat.lastMessage.message)
      // //@ts-ignore
      // else state.selectedChat.chat.chat.push(payload.data)
      // //@ts-ignore
      // state.chats.forEach((element , index)=> {
      //     if(element.id == payload.data.id)
      //     //@ts-ignore
      //     state.chats[index] = payload.data
      // });
    },
    clearChats: state => {
      state.chats = []
    },
  },
  // extraReducers: builder => {
  // builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
  //   state.userProfile = action.payload
  // })
  // builder
  //   .addCase(fetchChatsContacts.pending, state => {
  //     state.isLoadingChat = true
  //   })
  //   .addCase(fetchChatsContacts.fulfilled, (state, action) => {
  //     // state.contacts = action.payload.contacts
  //     state.isLoadingChat = false
  //     state.countRooms = action.payload.count
  //     state.chats = action.payload.results
  //   })
  //   .addCase(fetchChatsContacts.rejected, state => {
  //     state.isLoadingChat = false
  //   })
  // builder
  //   .addCase(selectChat.pending, state => {
  //     state.isLoading = true
  //   })
  //   .addCase(selectChat.fulfilled, (state, action) => {
  //     state.isLoading = false
  //     state.selectedChat = action.payload
  //   })
  // builder
  // .addCase(retrieveLead.fulfilled, (state, { payload }) => {
  //   state.retrieveLead = payload
  // })
  // .addCase(changeStatus.pending, state => {
  //   state.isLoadingChangeStatus = true
  //   state.changeStatusSuccess = ''
  //   state.changeStatusError = ''
  // })
  // .addCase(changeStatus.fulfilled, (state, { payload }) => {
  //   state.isLoadingChangeStatus = false
  //   state.changeStatusSuccess = payload
  // })
  // .addCase(changeStatus.rejected, (state, { payload }) => {
  //   state.isLoadingChangeStatus = false
  //   state.changeStatusSuccess = ''
  //   state.changeStatusError = payload as string
  // })
  // },
})

// ** Fetch User Profile
export const fetchUserProfile = () =>
  numberStats({
    url: 'account/me/',
    method: 'get',
    onStart: smsChatSlice.actions.onStartFetchUserProfile.type,
    onSuccess: smsChatSlice.actions.onSuccessFetchUserProfile.type,
    onFail: smsChatSlice.actions.onFailFetchUserProfile.type,
  })

// ** Fetch retrieveLead
export const retrieveLead = (id: number | string) =>
  numberStats({
    url: `velocify/leads/${id}/`,
    method: 'get',
    onStart: smsChatSlice.actions.onStartRetrieveLead.type,
    onSuccess: smsChatSlice.actions.onSuccessRetrieveLead.type,
    onFail: smsChatSlice.actions.onFailRetrieveLead.type,
  })

// ** Fetch Chats & Contacts
export const fetchChatsContacts = ({
  per_page,
  search,
  page,
}: {
  per_page?: string | number
  search?: string
  page?: string | number
}) =>
  numberStats({
    url: 'chats/rooms/',
    method: 'get',
    params: { per_page, search, page },
    onStart: smsChatSlice.actions.onStartFetchChatsContacts.type,
    onSuccess: smsChatSlice.actions.onSuccessFetchChatsContacts.type,
    onFail: smsChatSlice.actions.onFailFetchChatsContacts.type,
  })

// ** Select Chat
export const selectChat = (id: number | string) =>
  numberStats({
    url: 'chats/rooms/' + id + '/messages/',
    method: 'get',
    onStart: smsChatSlice.actions.onStartSelectChat.type,
    onSuccess: smsChatSlice.actions.onSuccessSelectChat.type,
    onFail: smsChatSlice.actions.onFailSelectChat.type,
  })
// await dispatch(fetchChatsContacts())

// ** Send Msg
export const sendMsg = (obj: SendMsgParamsType) =>
  numberStats({
    url: 'chats/rooms/' + obj.chat?.id + '/messages/',
    method: 'post',
    data: { message: obj.message },
    onStart: smsChatSlice.actions.onStartSendMsg.type,
    onSuccess: smsChatSlice.actions.onSuccessSendMsg.type,
    onFail: smsChatSlice.actions.onFailSendMsg.type,
  })
// if (obj.contact) {
//   await dispatch(selectChat(obj.chat.id))
// }
// // @ts-ignore
// await dispatch(fetchChatsContacts())

// ** Change Status
export const changeStatus = (
  data: ChangeStatus
  // { rejectWithValue }
) =>
  numberStats({
    url: `velocify/leads/${data.id}/`,
    method: 'put',
    data,
    onStart: smsChatSlice.actions.onStartChangeStatus.type,
    onSuccess: smsChatSlice.actions.onSuccessChangeStatus.type,
    onFail: smsChatSlice.actions.onFailChangeStatus.type,
  })
// } catch (error: any) {
//   if (!error.response) {
//     throw error
//   }

//   return rejectWithValue(error.response.data.error.details)
// }

export const { removeSelectedChat, onSuccessRecieveMessage, clearChats } = smsChatSlice.actions

export default smsChatSlice.reducer
