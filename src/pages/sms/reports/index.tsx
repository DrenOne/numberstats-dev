// ** React Imports
import { useState, forwardRef, useEffect, SyntheticEvent } from 'react'
import { useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import { Button, Card, CardContent, FormControl, Grid, InputLabel, Select } from '@mui/material'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CardStatistics from 'src/components/views/reports/header/CardStatistics'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import {
  getFailedReasons,
  getNumbersDeliveryRate,
  getReports,
  getReportsInterval,
} from 'src/store/sms/reports'
import { AppDispatch } from 'src/store'
import FailedReasons from 'src/components/views/reports/FailedReasons'
import NumbersDeliveryRate from 'src/components/views/reports/NumbersDeliveryRate'

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

// const PickersRange = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
const Reports = () => {
  // ** Hook
  const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** States
  const [startDateRange, setStartDateRange] = useState<DateType>(new Date())
  //   const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45))
  const [endDateRange, setEndDateRange] = useState<DateType>(new Date())
  const [option, setOption] = useState<string>('daily')
  let [pageFR, setPageFR] = useState<number>(1)
  let [pageNDR, setPageNDR] = useState<number>(1)
  const [searchNDR, setSearchNDR] = useState<string>('')
  const [sortNDR, setSortNDR] = useState<{ sort: 'asc' | 'desc'; name: string }>({
    sort: 'asc',
    name: '',
  })

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const getDate = () => {
    let dates = {
      start_date: format(startDateRange as Date, 'yyyy-MM-dd'),
      end_date: format((endDateRange || startDateRange) as Date, 'yyyy-MM-dd'),
    }

    dispatch(getReportsInterval({ ...dates, option }))
    dispatch(getReports(dates))
    dispatch(getFailedReasons({ ...dates, page: pageFR, per_page: 20 }))
    dispatch(
      getNumbersDeliveryRate({
        ...dates,
        page: pageNDR,
        per_page: 20,
        search: searchNDR,
        ordering: sortNDR.sort === 'asc' ? sortNDR.name : `-${sortNDR.name}`,
      })
    )
  }

  useEffect(() => {
    // getDate()
    let dates = {
      start_date: format(startDateRange as Date, 'yyyy-MM-dd'),
      end_date: format((endDateRange || startDateRange) as Date, 'yyyy-MM-dd'),
    }

    dispatch(getReportsInterval({ ...dates, option }))
    dispatch(getReports(dates))
  }, [])

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const start_date = format(props.start, 'yyyy-MM-dd')
    const end_date = props.end !== null ? format(props.end, 'yyyy-MM-dd') : null

    const value = `${start_date}${end_date !== null ? ` / ${end_date}` : ''}`

    return (
      <TextField size='small' inputRef={ref} label={props.label || ''} {...props} value={value} />
    )
  })

  const searchReports = (e: SyntheticEvent) => {
    e.preventDefault()
    getDate()
  }

  return (
    <DatePickerWrapper>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item>
              <DatePicker
                selectsRange
                monthsShown={2}
                endDate={endDateRange}
                selected={startDateRange}
                startDate={startDateRange}
                shouldCloseOnSelect={false}
                id='date-range-picker-months'
                onChange={handleOnChangeRange}
                popperPlacement={popperPlacement}
                customInput={
                  <CustomInput
                    label='Start and end day'
                    end={endDateRange as Date | number}
                    start={startDateRange as Date | number}
                  />
                }
              />
            </Grid>
            <Grid item>
              <FormControl size='small'>
                <InputLabel htmlFor='outlined-age-native-simple'>Options</InputLabel>
                <Select
                  native
                  label='Options'
                  value={option}
                  onChange={e => setOption(e.target.value)}
                >
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                  <option value='monthly'>Monthly</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant='outlined' onClick={searchReports}>
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box mt={7}>
        <CardStatistics />
        <Grid container spacing={6} mt={1}>
          <Grid item md={4} xs={12}>
            <FailedReasons
              startDateRange={startDateRange}
              endDateRange={endDateRange}
              page={pageFR}
              setPage={setPageFR}
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <NumbersDeliveryRate
              startDateRange={startDateRange}
              endDateRange={endDateRange}
              page={pageNDR}
              setPage={setPageNDR}
              search={searchNDR}
              setSearch={setSearchNDR}
              sort={sortNDR}
              setSort={setSortNDR}
            />
          </Grid>
        </Grid>
      </Box>
    </DatePickerWrapper>
  )
}

export default Reports
