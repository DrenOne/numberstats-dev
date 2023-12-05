export type TemplateType = {
  id: number
  body: string
  category: string
  created_at: string
  name: string
  signal_word?: []
  subject: string
  title: string
  updated_at: string
  in_use: string | boolean
}

export type TemplateClientType = {
  name: string
  title: string
  subject: string
  body: string
}

export type TemplateShow = {
  created_at: string
  id: number
  order: number
  parent: unknown
  updated_at: string
  schedule: number
  template: {
    body: string
    category: string
    created_at: string
    id: number
    name: string
    title: string
    subject: string
    updated_at: string
  }
}

export type AddTemplate = {
  order: number | string
  template: number | string
  schedule: number | string
}

