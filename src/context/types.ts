import { StatusType } from "src/types/sms/chatTypes"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  first_name: string
  last_name: string
  username: string
  password: string
  avatar?: string | null
  chat_user_id?: number
  about?: string
  status?: StatusType
  settings?: {
    isNotificationsOn?: boolean
    isTwoStepAuthVerificationEnabled?: boolean
  }
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
