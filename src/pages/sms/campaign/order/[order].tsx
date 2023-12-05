// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { InferGetStaticPropsType } from 'next/types'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import Typography from '@mui/material/Typography'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { createSmsOrder } from 'src/store/sms/orders'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CampaignClientType } from 'src/types/apps/campaignTypes'
import { fetchData, fetchTemplate } from 'src/store/sms/templates'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { CircularProgress, useTheme } from '@mui/material'
import SmsTimeLine from 'src/components/views/campaign/order/SmsTimeLine'
import AddOrderAction from 'src/components/views/campaign/order/AddOrderAction'
import SettingOrderAction from 'src/components/views/campaign/order/SettingOrderAction'

const schema = yup.object().shape({
  template: yup.string().required('Template is required'),
  days: yup.number().transform(value => (isNaN(value) ? undefined : value)),
  hours: yup
    .number()
    .max(24, 'Maximum number should be 24')
    .transform(value => (isNaN(value) ? undefined : value)),
  minutes: yup
    .number()
    .max(60, 'Maximum number should be 60')
    .transform(value => (isNaN(value) ? undefined : value)),
})

const OrderCampaign = ({
  apiClientData,
  invoiceNumber,
}: // @ts-ignore
InferGetStaticPropsType<typeof getStaticProps>) => {
  const theme = useTheme()
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { template: '', days: '', hours: '', minutes: '' },
  })
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    allData: templates,
    dataT,
    isLoading,
    addShowT,
    addSuccess: templateAddS,
    errorShow,
  } = useSelector((state: RootState) => state.templates)
  const { addSuccess, allData } = useSelector((state: RootState) => state.campaigns)
  const { orderId } = useSelector((state: RootState) => state.orders)

  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<CampaignClientType | null>(null)
  const [clients, setClients] = useState<CampaignClientType[] | undefined>(apiClientData)

  // ** useRouter
  const router = useRouter()
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const arg = {
    search: '',
    per_page: 20,
  }

  useEffect(() => {
    dispatch(fetchData(arg))
    // @ts-ignore
    dispatch(createSmsOrder(router.query.order))
  }, [])

  useEffect(() => {
    if (orderId)
      // @ts-ignore
      dispatch(fetchTemplate(orderId))
  }, [orderId])

  useEffect(() => {
    if (addShowT === 201 || addShowT === 200) {
      // @ts-ignore
      dispatch(fetchTemplate(orderId))
      resetField('days')
      resetField('hours')
      resetField('minutes')
      resetField('template')
    }
  }, [addShowT, reset])

  useEffect(() => {
    if (addSuccess) router.push('/sms/campaign/list')
  }, [addSuccess])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          {isLoading ? (
            <CircularProgress />
          ) : !isLoading && !dataT.length ? (
            <Typography>No data</Typography>
          ) : (
            <SmsTimeLine data={dataT} />
          )}
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddOrderAction
            templates={templates}
            register={register}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
            // orderResponse={orderResponse}
            handleSubmit={handleSubmit}
          />
          <br />
          {/* @ts-ignore */}
          <SettingOrderAction id={router.query.order} />
        </Grid>
      </Grid>
      {/* <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} />
    <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
    </>
  )
}

export default OrderCampaign
