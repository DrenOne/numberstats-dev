// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { InferGetStaticPropsType } from 'next/types'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CampaignClientType } from 'src/types/apps/campaignTypes'

// ** Demo Components Imports
import AddCard from 'src/components/views/campaign/create/AddCard'
import AddActions from 'src/components/views/campaign/create/AddActions'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { getSmsCampaign } from 'src/store/sms/campaigns'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  title: yup.string().required('Title is required'),
  subject: yup.string().required('Subject is required'),
  body: yup.string().required('Message is required'),
})

const addEditTemplate = ({
  apiClientData,
  invoiceNumber,
}: // @ts-ignore
InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', timezone: '' },
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { addSuccess, campaign } = useSelector((state: RootState) => state.campaigns)

  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<CampaignClientType | null>(null)
  const [clients, setClients] = useState<CampaignClientType[] | undefined>(apiClientData)

  // ** useRouter
  const router = useRouter()

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  useEffect(() => {
    if (router.query.addEdit !== 'create') {
      // @ts-ignore
      dispatch(getSmsCampaign(router?.query?.addEdit))
      // dispatch(getSmsCampaigns())
    }
  }, [router.query.addEdit])

  useEffect(() => {
    if (campaign && router.query.addEdit !== 'create') {
      // @ts-ignore
      Object.keys(campaign!).map(item => setValue(item, campaign[item]))
    }
  }, [campaign])

  useEffect(() => {
    if (addSuccess) router.push('/sms/campaign/list')
  }, [addSuccess])

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            // @ts-ignore
            clients={clients}
            addEdit={router.query.addEdit as string}
            register={register}
            errors={errors}
            control={control}
            invoiceNumber={invoiceNumber}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            toggleAddCustomerDrawer={toggleAddCustomerDrawer}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions addEdit={router.query.addEdit as string} handleSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default addEditTemplate
