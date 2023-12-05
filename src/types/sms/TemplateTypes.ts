import { Dispatch } from 'redux'
import { ThemeColor } from 'src/@core/layouts/types'

export type TemplateType = {
  id: number
  name: string
  title: string
  subject: string
  body: string
  category: string
  created_at: Date
  updated_at: Date
}

export type TemplateList = {
  count: number
  next: string
  previous: string
  result: TemplateType
}

export type TVariable = {
  id: number | string
  required: boolean
  title: string
}
