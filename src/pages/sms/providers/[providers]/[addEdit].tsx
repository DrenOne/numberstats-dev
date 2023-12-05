// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { InferGetStaticPropsType } from 'next/types'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CampaignType } from 'src/types/apps/campaignTypes'

// ** Demo Components Imports
import AddCard from 'src/components/views/providers/create/AddCard'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { getSmsCampaigns } from 'src/store/sms/campaigns'
import AddActions from 'src/components/views/providers/create/AddActions'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  title: yup.string().required('Title is required'),
  subject: yup.string().required('Subject is required'),
  body: yup.string().required('Message is required'),
})

const addEdit = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { phone_number: '', name: '' },
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { addSuccess, allData } = useSelector((state: RootState) => state.campaigns)

  // ** useRouter
  const router = useRouter()

  useEffect(() => {
    if (router.query.addEdit !== 'create') {
      // @ts-ignore
      // dispatch(getTemplate(router?.query?.addEdit))
      dispatch(getSmsCampaigns())
    }
  }, [router.query.addEdit])

  useEffect(() => {
    if (allData.length && router.query.addEdit !== 'create') {
      let template: {} | undefined = {}

      template = allData.find((item: CampaignType) => item.id === Number(router.query.addEdit))
      // @ts-ignore
      // Object.keys(template!).map(item => setValue(item, template[item]))
    }
  }, [allData])

  useEffect(() => {
    if (addSuccess) router.push('/sms/campaign/list')
  }, [addSuccess])

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            addEdit={router.query.addEdit as string}
            text={router.query.providers as string}
            register={register}
            errors={errors}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions
            addEdit={router.query.addEdit as string}
            text={router.query.providers as string}
            handleSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default addEdit
