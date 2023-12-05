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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

type AddCardI = {
  addEdit: string | number
  register: any
  errors: any
  text: string
}

const AddCard: FC<AddCardI> = ({ addEdit, register, errors, text }) => {
  // ** Props
  // ** Hook
  const theme = useTheme()

  // ** Handle Invoice To Change

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              lineHeight: '24px',
              fontSize: '1.375rem !important',
              textTransform: 'capitalize'
            }}
          >
            {addEdit === 'create' ? 'Create' : 'Edit'} {text.split('s')[0]}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardContent sx={{ px: [6, 10] }} style={{}}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <TextField
              {...register('title')}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size='small'
              label='Title'
              placeholder='Campaign Title'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              {...register('timezone')}
              error={!!errors.title?.message}
              helperText={errors.title?.message}
              size='small'
              label='Timezone'
              placeholder='Timezone'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AddCard
