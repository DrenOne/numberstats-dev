// ** React Imports
import { FC, ReactElement, Ref, forwardRef, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Slide, { SlideProps } from '@mui/material/Slide'
import { LoadingButton } from '@mui/lab'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { CreateTemplate, editTemplate, getVariables } from 'src/store/sms/templates'
import { TemplateClientType } from 'src/types/apps/templateTypes'
import { Box, DialogActions, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { TVariable } from 'src/types/sms/TemplateTypes'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

type AddActionsI = {
  addEdit: string | number
  handleSubmit: any
}

const AddActions: FC<AddActionsI> = ({ addEdit, handleSubmit }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  let [page, setPage] = useState<number>(1)
  const [data, setData] = useState<TVariable[]>([])

  const { isLoading, variables, variableCount } = useSelector((state: RootState) => state.templates)

  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (variables.length) {
      variables.forEach(item => data.push(item))
      setData([...data])
    }
  }, [variables])

  const loadMore = () => {
    ++page
    setPage(page)
    dispatch(getVariables({ page, per_page: 20 }))
  }

  const onSubmit = (values: TemplateClientType) => {
    // @ts-ignore
    if (addEdit === 'create') dispatch(CreateTemplate(values))
    // @ts-ignore
    else dispatch(editTemplate({ ...values, id: addEdit }))
  }

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Button
                fullWidth
                sx={{ mb: 2 }}
                variant='outlined'
                onClick={() => {
                  if (!data.length) dispatch(getVariables({ page, per_page: 20 }))
                  setOpen(true)
                }}
              >
                View Variables
              </Button>
              <LoadingButton
                loading={isLoading}
                loadingPosition='start'
                fullWidth
                variant='contained'
                sx={{ mb: 2 }}
                onClick={handleSubmit(onSubmit)}
                startIcon={<Icon fontSize='1.125rem' icon='tabler:send' />}
              >
                {addEdit === 'create' ? 'Create' : 'Edit'} Template
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
      {/* Modal */}
      <Box sx={{ width: { sm: '75%', lg: '50%' } }}>
        <Dialog
          sx={{ width: '100%' }}
          open={open}
          keepMounted
          maxWidth='md'
          onClose={handleClose}
          TransitionComponent={Transition}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle id='alert-dialog-slide-title'>View Variables</DialogTitle>
          <DialogContent>
            <List>
              {data.map((variable: TVariable) => (
                <ListItem sx={{ pr: 50 }}>
                  <ListItemButton>
                    <ListItemText primary={variable.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isLoading}
              disabled={data.length >= variableCount}
              onClick={loadMore}
            >
              Load more
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AddActions
