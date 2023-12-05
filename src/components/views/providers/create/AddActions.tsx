// ** React Imports
import { FC } from 'react'

// ** Next Import
import Link from 'next/link'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { LoadingButton } from '@mui/lab'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { TemplateClientType } from 'src/types/apps/templateTypes'

type AddActionsI = {
  addEdit: string | number
  handleSubmit: any
  text: string
}

const AddActions: FC<AddActionsI> = ({ addEdit, handleSubmit, text }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.templates)

  const onSubmit = (values: TemplateClientType) => {
    // @ts-ignore
    // if (addEdit === 'create') dispatch(CreateTemplate(values))
    // @ts-ignore
    // else dispatch(editTemplate({ ...values, id: addEdit }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <LoadingButton
              loading={isLoading}
              loadingPosition='start'
              fullWidth
              variant='contained'
              sx={{ mb: 2 }}
              onClick={handleSubmit(onSubmit)}
              startIcon={<Icon fontSize='1.125rem' icon='tabler:send' />}
            >
              {addEdit === 'create' ? 'Create' : 'Edit'} {text.split('s')[0]}
            </LoadingButton>
            <Button
              fullWidth
              sx={{ mb: 2 }}
              component={Link}
              color='secondary'
              variant='outlined'
              href='/sms/templates/list'
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  )
}

export default AddActions
