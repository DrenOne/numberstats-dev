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
  id: number
  last_login: string
  is_superuser: string
  email: string
  first_name: string
  last_name: string
  is_active: string
  chat_user_id: number
  date_joined: string
  status: StatusType
  role: string

  // settings: {
  //   isNotificationsOn: boolean
  //   isTwoStepAuthVerificationEnabled: boolean
  // }
}

export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatType = {
  message: string
  user_id: number
  timestamp: Date | string
  read: boolean
  delivered: boolean

  // feedback: MsgFeedbackType
}

export type ChatsObj = {
  id: number
  room_id: string
  chat_user_id: number
  type: string
  messages: ChatType[]
  unseen_msgs: number
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
}

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: ChatsArrType
}

export type ChatStoreType = {
  chats: ChatsArrType[] | []
  contacts: ContactType[] | null
  userProfile: ProfileUserType | null
  selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
  chat?: ChatsObj
  message: string
  contact?: ChatsArrType
}

export type ChatContentType = {
  hidden: boolean
  mdAbove: boolean
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  sendMsg: (params: SendMsgParamsType) => void
  handleUserProfileRightSidebarToggle: () => void
}

export type ChatSidebarLeftType = {
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
  selectChat: (id: number) => void
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
  dispatch: Dispatch<any>
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
