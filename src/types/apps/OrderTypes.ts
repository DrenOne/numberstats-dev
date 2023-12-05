export type OrderType = {
  active: boolean
  created_at: string
  domains: []
  end_until: string
  except_weekends: boolean
  id: number
  limit: number
  start_from: string
  updated_at: string
  status: {
    id: number
    active: boolean
    no_of_leads: number
    title: string
  }
}

export type OrderClientType = {
  name: string
  title: string
  subject: string
  body: string
}

export type OrderAddEditType = {
  id?: number
  status: number | string
  domains: number[]
  limit: number | string
  start_from: string
  end_until: string
  except_weekends: boolean
  active: boolean
}