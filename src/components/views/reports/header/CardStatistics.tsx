import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Reports from './Reports'
import ReportsInterval from './ReportsInterval'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

const CardStatistics = () => {
  const [series, setSeries] = useState<{ data: number[]; name?: string }[]>([])
  const [categories, setCategories] = useState<string[]>([])

  const { reportsInterval } = useSelector((state: RootState) => state.reports)

  // reportsInterval
  useEffect(() => {
    if (reportsInterval) {
      reportsInterval.forEach((item, indexR: number) => {
        series[indexR] = {
          data: [],
          name: item.label,
        }
        item.value.forEach((reportInterval: { date: string; count: number }, index: number) => {
          series[indexR].data[index] = reportInterval.count
        })
      })

      setSeries(series)
    }
  }, [reportsInterval])

  useEffect(() => {
    if (reportsInterval) {
      let reportsArray: string[] = []
      // reportsInterval[0].value.forEach((item: { date: string }) => reportsArray.push(item.date))
      reportsInterval.forEach(reportInterval => {
        if (reportInterval.value.length) {
          reportInterval.value.forEach((item: { date: string }) => reportsArray.push(item.date))
          return
        }
      })
      setCategories(reportsArray)
    }
  }, [reportsInterval])

  return (
    <ApexChartWrapper>
      <Reports />
      <ReportsInterval series={series} categories={categories} />
    </ApexChartWrapper>
  )
}

export default CardStatistics
