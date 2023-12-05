// ** React Imports
import { Fragment, ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type
import { RetrieveLead, RetrieveLeadField, UserProfileRightType } from 'src/types/sms/chatTypes'

// ** Custom Component Imports
import Sidebar from 'src/@core/components/sidebar'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { Button } from '@mui/material'
import Link from 'next/link'

const UserProfileRight = (props: UserProfileRightType) => {
  const {
    store,
    hidden,
    statusObj,
    getInitials,
    sidebarWidth,
    userProfileRightOpen,
    handleUserProfileRightSidebarToggle,
  } = props
  const [pInfo, setPInfo] = useState<RetrieveLeadField[]>([])
  const [fields, setFields] = useState([])
  let [num, setNum] = useState(5)
  // @ts-ignore
  const { retrieveLead }: { retrieveLead: RetrieveLead } = useSelector(
    (state: RootState) => state.chat
  )

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }
  useEffect(() => {
    if (retrieveLead?.fields?.length) {
      const texts = ['First Name', 'Last Name', 'Email', 'SMS Phone']
      texts.map(text => {
        pInfo?.push(retrieveLead.fields.find(item => item.field === text)!)
        setPInfo(pInfo)
      })
      // @ts-ignore
      retrieveLead?.fields?.map(field => {
        if (
          field?.field !== 'First Name' &&
          field?.field !== 'Last Name' &&
          field?.field !== 'Email' &&
          field?.field !== 'SMS Phone'
        )
          // @ts-ignore
          fields.push(field)
      })
      setFields(fields)
    }
  }, [retrieveLead.fields])

  const more = () => {
    // @ts-ignore
    setNum(num + 5)
    // setFields([...fields, ...retrieveLead.fields.slice(fields.length, fields.length + 5)])
  }

  return (
    <Sidebar
      direction='right'
      show={userProfileRightOpen}
      backDropClick={handleUserProfileRightSidebarToggle}
      sx={{
        zIndex: 9,
        height: '100%',
        width: sidebarWidth,
        borderTopRightRadius: theme => theme.shape.borderRadius,
        borderBottomRightRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1,
        },
      }}
    >
      {store && store.selectedChat && retrieveLead ? (
        <Fragment>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              size='small'
              onClick={handleUserProfileRightSidebarToggle}
              sx={{ top: '0.5rem', right: '0.5rem', position: 'absolute', color: 'text.disabled' }}
            >
              <Icon icon='tabler:x' />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: theme => theme.spacing(11.25, 6, 4.5),
              }}
            >
              <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'center' }}>
                <Badge
                  overlap='circular'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        color: `${
                          statusObj[retrieveLead?.status?.active ? 'online' : 'offline']
                        }.main`,
                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                        backgroundColor: `${
                          statusObj[retrieveLead?.status?.active ? 'online' : 'offline']
                        }.main`,
                      }}
                    />
                  }
                >
                  {pInfo?.find(item => item?.field === 'First Name')?.value ? (
                    <MuiAvatar
                      sx={{ width: '5rem', height: '5rem' }}
                      src={pInfo?.find(item => item?.field === 'First Name')?.value}
                      alt={pInfo?.find(item => item?.field === 'First Name')?.value}
                    />
                  ) : (
                    <CustomAvatar
                      skin='light'
                      color={store.selectedChat.contact.avatarColor}
                      sx={{ width: '5rem', height: '5rem', fontWeight: 500, fontSize: '2rem' }}
                    >
                      {/* {retrieveLead?.agent?.name && getInitials(retrieveLead?.agent?.name)} */}
                      {pInfo?.find(item => item?.field === 'First Name')?.value &&
                        // @ts-ignore
                        getInitials(pInfo?.find(item => item?.field === 'First Name')?.value)}
                    </CustomAvatar>
                  )}
                </Badge>
              </Box>
              <Typography variant='h6' sx={{ textAlign: 'center' }}>
                {pInfo?.find(item => item?.field === 'First Name')?.value}{' '}
                {pInfo?.find(item => item?.field === 'Last Name')?.value}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                {store.selectedChat.contact.role}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 'calc(100% - 13.3125rem)' }}>
            <ScrollWrapper>
              <Box sx={{ p: 6 }}>
                {/* <FormGroup sx={{ mb: 6.5 }}>
                  <Typography
                    variant='body2'
                    sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase' }}
                  >
                    About
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {retrieveLead?.agent?.about}
                  </Typography>
                </FormGroup> */}

                {/* <Box sx={{ mb: 6 }}>
                  <Typography
                    variant='body2'
                    sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase' }}
                  >
                    Personal Information
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='tabler:mail' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ textTransform: 'lowercase' }}
                        primaryTypographyProps={{ variant: 'body1' }}
                        // primary={`${store.selectedChat.contact.fullName.replace(
                        //   /\s/g,
                        //   '_'
                        // )}@email.com`}
                        primary={
                          <Box
                            component={Link}
                            sx={{ textDecoration: 'none', color: 'white' }}
                            href={`mailto:${pInfo?.find(item => item?.field === 'Email')?.value}`}
                          >
                            {pInfo?.find(item => item?.field === 'Email')?.value}
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='tabler:phone-call' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ variant: 'body1' }}
                        primary={
                          <Box
                            component={Link}
                            sx={{ textDecoration: 'none', color: 'white' }}
                            href={`tel:${pInfo?.find(item => item?.field === 'SMS Phone')?.value}`}
                          >
                            {pInfo?.find(item => item?.field === 'SMS Phone')?.value}
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='tabler:clock' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ variant: 'body1' }}
                        primary='Mon - Fri 10AM - 8PM'
                      />
                    </ListItem>
                  </List>
                </Box> */}

                {/* <Box sx={{ mb: 6 }}>
                  <Typography
                    variant='body2'
                    sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase' }}
                  >
                    Options
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2 }}>
                          <Icon icon='tabler:trash' fontSize='1.5rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Delete Contact'
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ px: 2 }}>
                        <ListItemIcon sx={{ mr: 2 }}>
                          <Icon icon='tabler:ban' fontSize='1.5rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Block Contact'
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box> */}

                {/* Information */}
                <Box sx={{ mb: 6 }}>
                  <Typography
                    variant='body2'
                    sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase' }}
                  >
                    Information
                  </Typography>
                  <List dense sx={{ p: 0, mb: 3 }}>
                    {fields.slice(0, num).map((field: RetrieveLeadField) => (
                      <ListItem sx={{ px: 2 }} key={field?.field}>
                        <ListItemText
                          primaryTypographyProps={{ variant: 'body1' }}
                          primary={field?.field}
                          secondary={field?.value}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {fields?.length > num ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button onClick={more}>Show More</Button>
                    </Box>
                  ) : null}
                </Box>
              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default UserProfileRight
