export type TReportsStore = {
  isLoading: boolean
  isLoadingGNDRate:  boolean
  reportsInterval?: TReportsInterval[] | null
  reports?: TReports[] | null
  failedReasons?: TFailedReasons[] | null
  numbersDeliveryRate?: TNumbersDeliveryRate[] | null
  failedReasonsCount?: number
  numbersDeliveryRateCount?: number
  error: string
}

export type TReports = {
  value: number
  label: string
}

export type TReportsInterval = {
  label: string
  value: { date: string; count: number }[]
}

export type TFailedReasons = {
  count?: number
  reason?: string
}

export type TNumbersDeliveryRate = {
  phone_number?: null
  failed_count?: number
  no_of_sent?: number
  failure_rate?: number
}
