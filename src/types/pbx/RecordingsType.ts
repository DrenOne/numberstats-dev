// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type RecordingsType = {
  id: number | string
  did: string
  uid: string
  status: string
  caller_number: string
  created_at: string
  date: string
  display_name: string
  filepath: string
  participants: string
  transcription: string
  updated_at: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
