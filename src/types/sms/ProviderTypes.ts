// ** Types
import { Dispatch } from 'redux'
import { GridRowId } from '@mui/x-data-grid'

interface IAction {
  type: string
  api: string
}

export type ProviderStoreType = {
  isLoading: boolean
  actions: IAction[]
  data: ProviderDataType[]
  count: number
  error: string
}

export interface TableHeaderProps {
  value?: string
  selectedRows?: GridRowId[]
  text?: string
  handleFilter?: (val: string) => void
  store: ProviderStoreType
  action: string
  setAction: (value: string) => void
}

export interface ITable {
  store: ProviderStoreType
  action: string
  text: string
}

export type MessageProfile = {
  id: string
  name: string
  webhook_url: null | string
  webhook_failover_url: null | string
  webhook_api_version: string
  enabled: boolean
  toll_free_weight: number
  long_code_weight: number
  skip_unhealthy: boolean
  sticky_sender: boolean
  geomatch: boolean
  tf_weight: number
  lc_weight: number
  created_at: string
  updated_at: string
}

export type ProviderDataType = {
  id: string | number
  phone_number: string
  message_profile: MessageProfile
  country_code: string
  type: string
  record_type: string
  phone_number_type: null | number | string
  inbound_outbound_ratio: number
  message_count: number
  spam_ratio: number
  success_ratio: number
  created_date: string
  updated_date: string
  created_at: string
  updated_at: string
}
