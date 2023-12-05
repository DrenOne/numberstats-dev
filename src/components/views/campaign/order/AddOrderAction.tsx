// ** React Imports
import { FC } from 'react'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { CreateShowTemplate } from 'src/store/sms/templates'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TemplateType } from 'src/types/sms/TemplateTypes'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { Alert, FormHelperText } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type AddOrderActionT = {
  id?: string | number
  templates: TemplateType[]
  handleSubmit: Function
  register: any
  errors: any
  setError: any
  clearErrors: any
}

type Values = {
  template: string | number
  days: number
  hours: number
  minutes: number
}

const AddOrderAction: FC<AddOrderActionT> = ({
  id,
  errors,
  templates,
  handleSubmit,
  register,
  setError,
  clearErrors,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { orderId } = useSelector((state: RootState) => state.orders)
  const { errorShow } = useSelector((state: RootState) => state.templates)

  const onSubmit = (values: Values) => {
    if (!values.days && !values.hours && !values.minutes) {
      setError('days', {
        type: 'custom',
        message: 'It is necessary to enter one of the days, hours, minutes',
      })
      setError('hours', {
        type: 'custom',
        message: 'It is necessary to enter one of the days, hours, minutes',
      })
      setError('minutes', {
        type: 'custom',
        message: 'It is necessary to enter one of the days, hours, minutes',
      })
    } else {
      clearErrors(['days', 'hours', 'minutes'])
      let schedule = 0
      schedule = (values.days ?? 0) * 24 * 60 + (values.hours ?? 0) * 60 + (values.minutes ?? 0)
      dispatch(
        CreateShowTemplate({ id: orderId, schedule, template: values.template, order: orderId })
      )
    }
  }

  return (
    <Card>
      <CardContent component='form' onSubmit={handleSubmit(onSubmit)}>
        {errorShow ? (
          <Alert variant='outlined' severity='error' sx={{ mb: 6 }}>
            {/* @ts-ignore */}
            {errorShow[Object.keys(errorShow)[0]][0]}
          </Alert>
        ) : null}
        <FormControl fullWidth size='small' sx={{ mb: 1 }} error={!!errors?.template?.message}>
          <InputLabel id='demo-simple-select-outlined-label'>Select template</InputLabel>
          <Select
            label='Select template'
            defaultValue=''
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            {...register('template')}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {templates.map((template: TemplateType) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.template?.message}</FormHelperText>
        </FormControl>
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='Days'
          sx={{ mb: 2 }}
          {...register('days')}
          error={!!errors?.days?.message}
          helperText={errors?.days?.message}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='Hours'
          sx={{ mb: 2 }}
          {...register('hours')}
          error={!!errors?.hours?.message}
          helperText={errors?.hours?.message}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='Minutes'
          sx={{ mb: 2 }}
          {...register('minutes')}
          error={!!errors?.minutes?.message}
          helperText={errors?.minutes?.message}
        />

        <Button
          fullWidth
          variant='contained'
          sx={{ '& svg': { mr: 2 } }}
          startIcon={
            <Icon fontSize='1.125rem' icon='tabler:template' onClick={() => handleSubmit(onSubmit)} />
          }
          type='submit'
        >
          Add Template
        </Button>
      </CardContent>
    </Card>
  )
}

export default AddOrderAction
