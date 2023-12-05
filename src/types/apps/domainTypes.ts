export type DomainType = {
  id: number
  title: string
  uid: number | string
  timezone: string
  active: string | boolean
}

export type DomainClientType = {
  name: string
  title: string
  subject: string
  body: string
}

export type DomainAddEditType = {
  id?: number
  status: number | string
  domains: number[]
  limit: number | string
  start_from: string
  end_until: string
  except_weekends: boolean
  active: boolean
}
