// ** Next Import
import Link from 'next/link'
import { useState } from 'react'
// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from './PickersCustomInput'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { time } from 'console'

interface Props {
  id: string | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
}

const SettingOrderAction = (
  { id, toggleSendInvoiceDrawer, toggleAddPaymentDrawer }: Props,
  { popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }
) => {
  const [time_from, setTimeFrom] = useState<DateType>(new Date())
  const [time_to, setTimeTo] = useState<DateType>(new Date())
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }} size='small'>
          <InputLabel id='select-provider'>Select Provider Campaign</InputLabel>
          <Select
            label='Select Provider Campaign'
            defaultValue=''
            sx={{ mb: 2 }}
            id='select-provider-outlined'
            labelId='select-provider'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormControl size='small'>
            <InputLabel id='except-weekend-label'>Except Weekend</InputLabel>
            <Select
              label='Except Weekend'
              defaultValue=''
              sx={{ mb: 2 }}
              id='except-weekend'
              labelId='except-weekend-label'
            >
              <MenuItem value={10}>No</MenuItem>
              <MenuItem value={20}>Yes</MenuItem>
            </Select>
          </FormControl>

          <TextField size='small' id='outlined-basic' label='Limit' sx={{ mb: 2 }} />

          <DatePicker
            showTimeSelect
            selected={time_from}
            timeIntervals={60}
            showTimeSelectOnly
            dateFormat='h:mm aa'
            id='time-only-picker'
            popperPlacement={popperPlacement}
            onChange={(date: Date) => setTimeFrom(date)}
            customInput={<CustomInput label='Start From' />}
            className='full-width'
            wrapperClassName='date-picker-wrapper'
          />
          <DatePicker
            showTimeSelect
            selected={time_to}
            timeIntervals={60}
            showTimeSelectOnly
            dateFormat='h:mm aa'
            id='time-only-picker'
            popperPlacement={popperPlacement}
            onChange={(date: Date) => setTimeTo(date)}
            customInput={<CustomInput label='Start To' />}
            className='full-width'
            wrapperClassName='date-picker-wrapper'
          />
          <Button fullWidth variant='contained' color='success' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:power' />
            Activate Campaign
          </Button>
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default SettingOrderAction
