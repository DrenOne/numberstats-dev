// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import { FormHelperText } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { confirmPassword } from 'src/store/apps/reset-password'

// ** Styled Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500,
  },
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750,
  },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}))

const schema = yup.object().shape({
  new_password: yup
    .string()
    .required('New password is a required field')
    .min(8, 'Must be 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, 'Must be at least 1 capital letter and number'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Must be the same as New password')
    .required('Confirm new password is a required field'),
})

interface FormData {
  new_password: string
  confirmPassword: string
}

const defaultValues = {
  new_password: '',
  confirmPassword: '',
}

const ResetPasswordV2 = () => {
  const {
    setError,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onTouched',
    resolver: yupResolver(schema),
  })

  // ** States
  const [password, setPassword] = useState(false)
  const [cPassword, setCPassword] = useState(false)

  // ** useRouter
  const router = useRouter()

  // ** Selector
  const { error, data } = useSelector((state: RootState) => state.resetPassword)

  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (error?.length) {
      // @ts-ignore
      Object.keys(error).map(key => setError(key, { type: 'value', message: error[key] }))
    }
  }, [error])

  useEffect(() => {
    if (data.length) reset()
  }, [data])

  const onSubmit = ({ new_password }: FormData) => {
    dispatch(
      confirmPassword(router.query?.uidb as string, router.query?.token as string, { new_password })
    )
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8),
          }}
        >
          <ResetPasswordIllustration
            alt='reset-password-illustration'
            src={`/images/pages/auth-v2-reset-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg
              width={34}
              height={23.375}
              viewBox='0 0 32 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography
                sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}
              >
                Reset Password 🔒
              </Typography>
              {/* <Typography sx={{ fontWeight: 500 }}>for john.doe@email.com</Typography> */}
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                error={Boolean(errors.new_password?.message)}
                sx={{ display: 'flex', mb: 4 }}
              >
                <InputLabel htmlFor='auth-reset-password-v2-new-password'>New Password</InputLabel>
                <OutlinedInput
                  autoFocus
                  label='New Password'
                  id='auth-reset-password-v2-new-password'
                  {...register('new_password')}
                  type={password ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setPassword(!password)}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon icon={password ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{errors.new_password?.message}</FormHelperText>
              </FormControl>
              <FormControl
                error={Boolean(errors.confirmPassword?.message)}
                sx={{ display: 'flex', mb: 4 }}
              >
                <InputLabel htmlFor='auth-reset-password-v2-confirm-password'>
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  id='auth-reset-password-v2-confirm-password'
                  {...register('confirmPassword')}
                  type={cPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                        onClick={() => setCPassword(!cPassword)}
                      >
                        <Icon icon={cPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                Set New Password
              </Button>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& svg': { mr: 1 },
                }}
              >
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ResetPasswordV2.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ResetPasswordV2.guestGuard = true

export default ResetPasswordV2
