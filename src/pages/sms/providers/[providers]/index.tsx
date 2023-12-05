import { Card, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Table from 'src/components/views/providers/list/Table'
import TableHeader from 'src/components/views/providers/list/TableHeader'
import { AppDispatch, RootState } from 'src/store'
import { getActions } from 'src/store/sms/providers'

const Providers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // ** State
  const [action, setAction] = useState<string>('')

  const store = useSelector((state: RootState) => state.providers)

  useEffect(() => {
    dispatch(getActions())
  }, [])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              store={store}
              setAction={setAction}
              action={action}
              text={router.query.providers as string}
            />
            <Table store={store} action={action} text={router.query.providers as string} />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default Providers
