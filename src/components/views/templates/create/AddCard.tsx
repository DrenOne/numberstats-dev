// ** React Imports
import { FC } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { Controller } from 'react-hook-form'

type AddCardI = {
  addEdit: string | number
  register?: any
  errors: any
  control: any
}

const AddCard: FC<AddCardI> = ({ addEdit, errors, control }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Card>
      <CardContent
        sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              lineHeight: '24px',
              fontSize: '1.375rem !important',
            }}
          >
            {addEdit === 'create' ? 'Create' : 'Edit'} SMS Template
          </Typography>
        </Box>
        {/* <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  Variable 1 - Explanation
                </Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  Variable 2 - Explanation
                </Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  Variable 3 - Explanation
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                Variable 4 - Explanation
              </Typography>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                Variable 5 - Explanation
              </Typography>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                Variable 6 - Explanation
              </Typography>
            </Box>
          </Grid>
        </Grid> */}
      </CardContent>
      <Divider />
      <CardContent sx={{ px: [6, 10] }} style={{}}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.name?.message}
                  helperText={errors.name?.message}
                  size='small'
                  label='Name'
                  placeholder='Template Name'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.title?.message}
                  helperText={errors.title?.message}
                  size='small'
                  label='Title'
                  placeholder='Template Title'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='subject'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.subject?.message}
                  helperText={errors.subject?.message}
                  size='small'
                  label='Subject'
                  placeholder='Template Subject'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardContent sx={{ px: [6, 10] }}>
        {/* <InputLabel htmlFor='invoice-note' sx={{ mb: 2, fontWeight: 500, fontSize: '0.875rem' }}>
          Message:
        </InputLabel> */}
        <Controller
          name='body'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.body?.message}
              helperText={errors.body?.message}
              rows={5}
              fullWidth
              label='Message'
              multiline
              id='invoice-note'
              placeholder='Please write your message body here!'
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default AddCard
