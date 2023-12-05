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
import { TemplateClientType } from 'src/types/apps/templateTypes'

// ** Demo Components Imports
import AddCard from 'src/components/views/templates/create/AddCard'
import AddActions from 'src/components/views/templates/create/AddActions'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { getTemplate } from 'src/store/sms/templates'

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
    defaultValues: { name: '', title: '', subject: '', body: '' },
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { addSuccess, template } = useSelector((state: RootState) => state.templates)

  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<TemplateClientType | null>(null)
  const [clients, setClients] = useState<TemplateClientType[] | undefined>(apiClientData)

  // ** useRouter
  const router = useRouter()

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  useEffect(() => {
    if (router.query.addEdit !== 'create') {
      // @ts-ignore
      dispatch(getTemplate(router?.query?.addEdit))
    }
  }, [router.query.addEdit])

  useEffect(() => {
    if (template && router.query.addEdit !== 'create') {
      Object.keys(template!).map(item =>
        setValue(item as 'name' | 'title' | 'subject' | 'body', template[item], {
          shouldValidate: true,
          shouldDirty: true,
        })
      )
    }
  }, [template])

  useEffect(() => {
    if (addSuccess) router.push('/sms/templates/list')
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
      {/* <AddNewCustomers
        clients={clients}
        open={addCustomerOpen}
        setClients={setClients}
        toggle={toggleAddCustomerDrawer}
        setSelectedClient={setSelectedClient}
      /> */}
    </DatePickerWrapper>
  )
}

export default addEditTemplate
