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

// ** Third Party Imports
import { Controller } from 'react-hook-form'

type AddCardI = {
  addEdit: string | number
  register?: any
  errors: any
  control: any
}

const AddCard: FC<AddCardI> = ({ addEdit, control, errors }) => {
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
            {addEdit === 'create' ? 'Create' : 'Edit'} Campaign
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardContent sx={{ px: [6, 10] }} style={{}}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.name?.message}
                  helperText={errors.name?.message}
                  size='small'
                  label='Title'
                  placeholder='Campaign Title'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='timezone'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.title?.message}
                  helperText={errors.title?.message}
                  size='small'
                  label='Timezone'
                  placeholder='Timezone'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AddCard
