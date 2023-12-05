import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import Table, { TColumn } from './Table'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import format from 'date-fns/format'
import { useDispatch } from 'react-redux'
import { getFailedReasons } from 'src/store/sms/reports'
import { TFailedReasons } from 'src/types/sms/reports'

const columns: TColumn[] = [
  { headerName: 'Failure reason', field: 'reason' },
  { headerName: 'Count', field: 'count', align: 'right' },
]

interface IProps {
  startDateRange: Date | null | undefined
  endDateRange: Date | null | undefined
  page: number
  setPage: (value: number) => void
}

const FailedReasons = ({ startDateRange, endDateRange, page, setPage }: IProps) => {
  // ** Hook
  const dispatch = useDispatch<AppDispatch>()
  // let [page, setPage] = useState<number>(1)
  const [data, setData] = useState<TFailedReasons[]>([])

  const { failedReasons, failedReasonsCount, isLoading } = useSelector(
    (state: RootState) => state.reports
  )

  const getDate = () => {
    let dates = {
      start_date: format(startDateRange as Date, 'yyyy-MM-dd'),
      end_date: format((endDateRange || startDateRange) as Date, 'yyyy-MM-dd'),
    }

    dispatch(getFailedReasons({ ...dates, page, per_page: 20 }))
  }

  useEffect(() => {
    if (failedReasons?.length) setData([...failedReasons])
    else if (failedReasons?.length === 0) setData([])
  }, [failedReasons])

  useEffect(() => {
    getDate()
  }, [page])

  return (
    <Card>
      <CardHeader
        title='Failed messages by count'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
      />
      <CardContent>
        <Table columns={columns} data={data!} isLoading={isLoading} />
        <Button
          sx={{ mt: 4 }}
          variant='outlined'
          disabled={data.length >= failedReasonsCount!}
          onClick={() => setPage(++page)}
        >
          Load
        </Button>
      </CardContent>
    </Card>
  )
}

export default FailedReasons
