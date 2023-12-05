// ** Types
import { Dispatch } from 'redux'
import { ThemeColor } from 'src/@core/layouts/types'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export type StatusObjType = {
  busy: ThemeColor
  away: ThemeColor
  online: ThemeColor
  offline: ThemeColor
}

export type ProfileUserType = {
  first_name: string
  last_name: string
  id: number
  chat_user_id: number
  role: string
  about: string
  avatar: string
  fullName: string
  status: StatusType
  settings: {
    isNotificationsOn: boolean
    isTwoStepAuthVerificationEnabled: boolean
  }
}

export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatType = {
  message: string
  senderId: number
  time: Date | string
  feedback: MsgFeedbackType
}

export type ChatsObj = {
  id: string
  userId: number
  chat: ChatType[]
  unseenMsgs: number
  lastMessage?: ChatType
}

export type ContactType = {
  id: number
  role: string
  about: string
  avatar?: string
  fullName: string
  status: StatusType
  avatarColor?: ThemeColor
}

export type ChatsArrType = {
  id: number
  role: string
  about: string
  chat: ChatsObj
  avatar?: string
  fullName: string
  status: StatusType
  avatarColor?: ThemeColor
  member: {
    created_at: string
    fullName: string
    id: number
    lead_id: null | number | string
    updated_at: string
    username: string
  }[]
}

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: ChatsArrType
  campaign_name: string
}

export type LastMessage = {
  chat: {
    id: string
    lastMessage: {
      feedback: {
        isDelivered: boolean
        isSeen: boolean
        isSent: boolean
      }
      id: number | string
      message: string
      message_id: string
      senderId: number | string
      time: string
    }
    unseenMsgs: number
  }
  created_at: string
  fullName: string
  id: string
  members: {
    created_at: string
    fullName: string
    id: string | number
    lead_id: any
    updated_at: string
    username: string
  }[]
  type: string
  updated_at: string
}

export type ChatStoreType = {
  chats: ChatsArrType[] | null
  lastMessage: LastMessage | string
  contacts: ContactType[] | null
  userProfile: ProfileUserType | null
  selectedChat: SelectedChatType
  isLoading: boolean
  isLoadingChat: boolean
  retrieveLead: unknown
  isLoadingChangeStatus: boolean
  changeStatusSuccess: string
  changeStatusError: string
  countRooms?: string | number
  isLoadingSendMsg: boolean
  SendMsgSuccess: string | any
}

export type SendMsgParamsType = {
  chat: ChatsObj
  message: string
  contact?: ChatsArrType
}

export type ChatContentType = {
  hidden: boolean
  mdAbove: boolean
  data: ChatsArrType[]
  setData: Function
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  selectChat: (id: number) => void
  selectChatId: string | number
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  sendMsg: (params: SendMsgParamsType) => void
  handleUserProfileRightSidebarToggle: () => void
}

export type ChatSidebarLeftType = {
  page: number
  data: ChatsArrType[]
  setPage: Function
  setData: Function
  hidden: boolean
  mdAbove: boolean
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  removeSelectedChat: () => void
  selectChat: (id: number | string) => void
  setSelectChatId: (id: number | string) => void
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
  formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void
}

export type UserProfileLeftType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
  store: ChatStoreType
  data: ChatsArrType[]
  setData: Function
  dispatch: Dispatch<any>
  selectChat: (id: number) => void
  selectChatId: string | number
  sendMsg: (params: SendMsgParamsType) => void
}

export type ChatLogType = {
  hidden: boolean
  data: {
    chat: ChatsObj
    contact: ContactType
    userContact: ProfileUserType
  }
}

export type MessageType = {
  time: string | Date
  message: string
  senderId: number
  feedback: MsgFeedbackType
}

export type ChatLogChatType = {
  msg: string
  time: string | Date
  feedback: MsgFeedbackType
}

export type FormattedChatsType = {
  senderId: number
  messages: ChatLogChatType[]
}

export type MessageGroupType = {
  senderId: number
  messages: ChatLogChatType[]
}

export type RetrieveLeadField = {
  created_at: string
  field: string
  updated_at: string
  value: string
}

export type RetrieveLead = {
  agent: {
    email: string
    email_mobile: string
    id: number
    name: string
    phone_dialer: string
    phone_fax: string
    phone_mobile: string
    phone_work: string
    about: string
  }
  campaign: string
  created_date: string
  fields: RetrieveLeadField[]
  id: number
  status: {
    active: boolean
    id: number
    no_of_leads: number
    title: string
  }
  title: string
  updated_date: string
}

export type ChangeStatus = {
  campaign?: string
  status: string | number
  agent?: string
  id?: number | string
  note: string
}
