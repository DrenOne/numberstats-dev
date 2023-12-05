import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import Table, { TColumn } from './Table'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { getNumbersDeliveryRate } from 'src/store/sms/reports'
import format from 'date-fns/format'
import { TNumbersDeliveryRate } from 'src/types/sms/reports'

const columns: TColumn[] = [
  { headerName: 'Phone number', field: 'phone_number' },
  { headerName: 'Processed', field: 'no_of_sent', align: 'right', sort: true },
  { headerName: 'Failed', field: 'failed_count', align: 'right', sort: true },
  { headerName: 'Failure rate', field: 'failure_rate', align: 'right', sort: true },
]

interface IProps {
  startDateRange: Date | null | undefined
  endDateRange: Date | null | undefined
  page: number
  setPage: (value: number) => void
  search: string
  setSearch: (value: string) => void
  sort: { sort: 'asc' | 'desc'; name: string }
  setSort: (value: { sort: 'asc' | 'desc'; name: string }) => void
}

const NumbersDeliveryRate = ({
  startDateRange,
  endDateRange,
  page,
  setPage,
  search,
  setSearch,
  sort,
  setSort,
}: IProps) => {
  // ** Hook
  const dispatch = useDispatch<AppDispatch>()
  // let [page, setPage] = useState<number>(1)
  const [data, setData] = useState<TNumbersDeliveryRate[]>([])
  // const [search, setSearch] = useState<string>('')
  // const [sort, setSort] = useState<{ sort: 'asc' | 'desc'; name: string }>({
  //   sort: 'asc',
  //   name: '',
  // })

  const { numbersDeliveryRate, numbersDeliveryRateCount, isLoadingGNDRate } = useSelector(
    (state: RootState) => state.reports
  )

  const getDate = (sort: { sort: 'asc' | 'desc'; name: string }, search: string) => {
    let dates = {
      start_date: format(startDateRange as Date, 'yyyy-MM-dd'),
      end_date: format((endDateRange || startDateRange) as Date, 'yyyy-MM-dd'),
    }

    dispatch(
      getNumbersDeliveryRate({
        ...dates,
        page,
        per_page: 20,
        search,
        ordering: sort.sort === 'asc' ? sort.name : `-${sort.name}`,
      })
    )
  }

  useEffect(() => {
    if (numbersDeliveryRate?.length) setData([...numbersDeliveryRate])
    else if (numbersDeliveryRate?.length === 0) setData([])
  }, [numbersDeliveryRate])

  useEffect(() => {
    getDate(sort, search)
  }, [page, sort, search])

  return (
    <Card>
      <CardHeader
        title='Numbers failure rate'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <TextField
            variant='standard'
            placeholder='Search'
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
        }
      />
      <CardContent>
        <Table
          columns={columns}
          data={data!}
          count
          isLoading={isLoadingGNDRate}
          onSort={value => setSort(value)}
        />
        <Button
          sx={{ mt: 4 }}
          variant='outlined'
          disabled={data.length >= numbersDeliveryRateCount!}
          onClick={() => setPage(++page)}
        >
          Load
        </Button>
      </CardContent>
    </Card>
  )
}

export default NumbersDeliveryRate
