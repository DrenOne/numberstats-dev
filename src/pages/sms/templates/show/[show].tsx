// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// ** Icon Imports
import MoreVertIcon from '@mui/icons-material/MoreVert'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { getSmsOrders } from 'src/store/sms/orders'
import { CreateShowTemplate, fetchData, fetchTemplate } from 'src/store/sms/templates'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { AddTemplate, TemplateShow, TemplateType } from 'src/types/apps/templateTypes'
import { DomainType } from 'src/types/apps/domainTypes'
import { OrderType } from 'src/types/apps/OrderTypes'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

const schema = yup.object().shape({
  order: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Order is required'),
  template: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Template is required'),
  schedule: yup
    .number()
    .min(1, 'Must be at least 1')
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Schedule is required'),
})

const ShowTemplate = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { order: '', template: '', schedule: '' },
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** useRouter
  const router = useRouter()

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    allData: templates,
    dataT,
    isLoading,
    addShowT,
    addSuccess,
    errorShow,
  } = useSelector((state: RootState) => state.templates)
  const { allData: domains } = useSelector((state: RootState) => state.domains)
  const { allData: orders } = useSelector((state: RootState) => state.orders)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchData())
    // @ts-ignore
    dispatch(getSmsOrders())
    // @ts-ignore
    dispatch(fetchTemplate(router.query.show))
  }, [])

  useEffect(() => {
    if (Object.keys(addShowT).length) {
      // @ts-ignore
      dispatch(fetchTemplate(router.query.show))
      reset()
    }
  }, [addShowT, reset])

  const addTemplate = (values: AddTemplate) => {
    // @ts-ignore
    dispatch(CreateShowTemplate({ ...values, id: router.query.show }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xl={9} md={8} xs={12}>
        {isLoading ? (
          <CircularProgress />
        ) : !isLoading && !dataT.length ? (
          <Typography>No data</Typography>
        ) : (
          dataT.map((data: TemplateShow) => (
            <Card key={data.id} sx={{ mb: 5 }}>
              <CardHeader
                sx={{ borderBottom: '1px solid rgba(228, 230, 244, 0.6)' }}
                avatar={<Avatar>{data.template.name.toLocaleUpperCase().charAt(0)}</Avatar>}
                action={
                  <Fragment>
                    <IconButton aria-label='settings' onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id='basic-menu'
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
                  </Fragment>
                }
                title={data.template.name}
                subheader={data.template.title}
              />
              <CardContent>
                <Box mt={5}>
                  <Typography
                    component='div'
                    dangerouslySetInnerHTML={{
                      __html: data.template.body,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Grid>
      <Grid item xl={3} md={4} xs={12}>
        <Card sx={{ mb: 6 }}>
          <CardContent>
            {errorShow ? (
              <Alert variant='outlined' severity='error' sx={{ mb: 6 }}>
                You are adding a previously added template
              </Alert>
            ) : null}
            <Box component='form' onSubmit={handleSubmit(addTemplate)}>
              {/* order */}
              <FormControl size='small' fullWidth sx={{ mb: 5 }} error={!!errors?.order?.message}>
                <InputLabel id='select_order'>Select Order</InputLabel>
                <Select
                  labelId='select_order'
                  label='Select Order'
                  id='select_order'
                  {...register('order')}
                >
                  {orders.map((order: OrderType) => (
                    <MenuItem value={order.id} key={order.id}>
                      {order.status.title}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.order?.message}</FormHelperText>
              </FormControl>
              {/* template */}
              <FormControl
                size='small'
                fullWidth
                sx={{ mb: 5 }}
                error={!!errors?.template?.message}
              >
                <InputLabel id='select_template'>Select Template</InputLabel>
                <Select
                  labelId='select_template'
                  label='Select Template'
                  id='select_template'
                  {...register('template')}
                >
                  {templates.map((template: TemplateType) => (
                    <MenuItem value={template.id} key={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.template?.message}</FormHelperText>
              </FormControl>
              {/* schedule */}
              <TextField
                {...register('schedule')}
                label='Schedule'
                placeholder='Enter Schedule'
                fullWidth
                size='small'
                sx={{ mb: 5 }}
                error={!!errors?.schedule?.message}
                helperText={errors?.schedule?.message}
              />
              <LoadingButton
                fullWidth
                variant='contained'
                sx={{ textTransform: 'capitalize' }}
                type='submit'
                loading={addSuccess}
              >
                Add Template
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box component='form'>
              <FormControl size='small' fullWidth sx={{ mb: 5 }}>
                <InputLabel id='select_domain'>Select Domain</InputLabel>
                <Select labelId='select_domain' label='Select Domain' id='select_domain'>
                  {domains.map((domain: DomainType) => (
                    <MenuItem value={domain.id} key={domain.id}>
                      {domain.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mb: 5 }}>
                <TextField
                  label='Daily send limit'
                  placeholder='Enter Daily send limit'
                  fullWidth
                  size='small'
                  sx={{ mb: 5 }}
                />
                <Typography mb={0.5}>Total Leads</Typography>
                <Typography mb={0.5} component='h5' color='rgba(40, 199, 111)' fontWeight={500}>
                  Total Leads
                </Typography>
                <Typography mb={0.5}>Average Campaign Score</Typography>
                <Typography component='h5' color='rgba(40, 199, 111)' fontWeight={500}>
                  49.49%
                </Typography>
              </Box>
              <Button
                fullWidth
                variant='contained'
                color='success'
                sx={{ textTransform: 'capitalize' }}
              >
                Save Campaign
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ShowTemplate
