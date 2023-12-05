// ** React Imports
import { Fragment, MouseEvent, ReactElement, Ref, forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Slide,
  SlideProps,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/components/views/chat/SendMsgForm'
import authConfig from 'src/configs/auth'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import UserProfileRight from 'src/components/views/chat/UserProfileRight'
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { ChangeStatus, ChatContentType } from 'src/types/sms/chatTypes'
import { RootState } from 'src/store'

// ** Store & Actions Imports
import { getSmsCampaigns } from 'src/store/sms/campaigns'
import { useSelector } from 'react-redux'
import { CampaignType } from 'src/types/apps/campaignTypes'
import { changeStatus, retrieveLead } from 'src/store/sms/chat'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// ** Styled Components
const ChatWrapperStartChat = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
}))

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const schema = yup.object().shape({
  campaign: yup.string(),
  status: yup.string().required('Status is required'),
  agent: yup.string(),
  note: yup.string().required('Text note is required'),
})

const ChatContent = (props: ChatContentType) => {
  // ** Props
  const {
    store,
    data: dataRooms,
    setData: setDataRooms,
    hidden,
    sendMsg,
    mdAbove,
    dispatch,
    statusObj,
    getInitials,
    selectChat,
    selectChatId,
    sidebarWidth,
    userProfileRightOpen,
    handleLeftSidebarToggle,
    handleUserProfileRightSidebarToggle,
  } = props
  const {
    register,
    reset,
    handleSubmit,
    control,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { campaign: '', status: '', agent: '', note: '' },
  })
  // ** Hooks
  const { allData, isLoading, count } = useSelector((state: RootState) => state.campaigns)
  const { isLoadingChangeStatus, changeStatusError, changeStatusSuccess } = useSelector(
    (state: RootState) => state.chat
  )
  const { user } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openM, setOpen] = useState<boolean>(false)
  const [id, setId] = useState<string | number>('')
  let [data, setData] = useState<CampaignType[]>(allData)
  let [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState('')

  const handleCloseM = () => {
    reset()
    setOpen(false)
  }

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickOpenM = () => {
    handleClose()
    setOpen(true)
  }

  const handleStartConversation = () => {
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const onSubmit = (data: ChangeStatus) => {
    dispatch(changeStatus({ ...data, id }))
  }

  useEffect(() => {
    if (changeStatusError) {
      Object.keys(changeStatusError).forEach((errKey: any) =>
        setError(errKey, { type: 'manual', message: changeStatusError[errKey][0] })
      )
    }
  }, [changeStatusError])

  useEffect(() => {
    if (changeStatusSuccess) {
      reset()
      handleCloseM()
    }
  }, [changeStatusSuccess])

  useEffect(() => {
    // @ts-ignore
    if (store.retrieveLead?.status) setValue('status', store.retrieveLead?.status?.id)
    // @ts-ignore
  }, [store.retrieveLead?.status])

  useEffect(() => {
    // @ts-ignore
    dispatch(getSmsCampaigns())
  }, [])

  useEffect(() => {
    if (store.selectedChat && dataRooms) {
      let lead_id = dataRooms
        .find(chat => store?.selectedChat?.contact?.fullName === chat?.fullName)
        ?.member?.find(memb => memb.lead_id !== null)
      if (lead_id?.lead_id) {
        setId(lead_id?.lead_id)
        dispatch(retrieveLead(lead_id?.lead_id))
      }
    }
  }, [store.selectedChat, dataRooms])

  const onScroll = (event: any) => {
    const per_page = 100
    const listboxNode = event.currentTarget
    const scrollHeight = event.target.scrollHeight
    const collected = listboxNode.scrollTop + listboxNode.clientHeight
    if (scrollHeight === collected && data.length < count) {
      page = page + 1
      setPage(page)
      dispatch(getSmsCampaigns({ page, per_page, search }))
    }
  }

  useEffect(() => {
    setSearch(search)
    dispatch(getSmsCampaigns({ page, per_page: 100, search }))
  }, [search])

  useEffect(() => {
    if (!search.length) {
      allData.map(item => {
        // @ts-ignore
        if (!data.find(dataItem => dataItem.id === item.id)) data.push(item)
      })
      setData([...data])
      // setData([...data, ...allData])
    } else {
      data = []
      allData.map(item => {
        // @ts-ignore
        if (!data.find(dataItem => dataItem.id === item.id)) data.push(item)
      })
      setData([...data])
    }
  }, [allData])

  const renderContent = () => {
    if (store) {
      const selectedChat = store.selectedChat
      if (!selectedChat) {
        return (
          <ChatWrapperStartChat
            sx={{
              ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
            }}
          >
            <MuiAvatar
              sx={{
                mb: 6,
                pt: 8,
                pb: 7,
                px: 7.5,
                width: 110,
                height: 110,
                boxShadow: 3,
                backgroundColor: 'background.paper',
              }}
            >
              <Icon icon='tabler:message' fontSize='3.125rem' />
            </MuiAvatar>
            <Box
              onClick={handleStartConversation}
              sx={{
                py: 2,
                px: 6,
                boxShadow: 3,
                borderRadius: 5,
                backgroundColor: 'background.paper',
                cursor: mdAbove ? 'default' : 'pointer',
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 'normal' }}>
                Start Conversation
              </Typography>
            </Box>
          </ChatWrapperStartChat>
        )
      } else {
        return (
          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
              backgroundColor: 'action.hover',
            }}
          >
            <Box
              sx={{
                py: 2,
                px: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'background.paper',
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mdAbove ? null : (
                  <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                    <Icon icon='tabler:menu-2' />
                  </IconButton>
                )}
                <Box
                  onClick={handleUserProfileRightSidebarToggle}
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <Badge
                    overlap='circular'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    sx={{ mr: 3 }}
                    badgeContent={
                      <Box
                        component='span'
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          color: 'online',
                          boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                          backgroundColor: 'online',
                        }}
                      />
                    }
                  >
                    {/* {selectedChat.contact.avatar ? (
                      <MuiAvatar
                        sx={{ width: 38, height: 38 }}
                        src={selectedChat.contact.avatar}
                        alt={selectedChat.contact.fullName}
                      />
                    ) : ( */}
                    <CustomAvatar
                      skin='light'
                      color={selectedChat.contact.avatarColor}
                      sx={{ width: 38, height: 38, fontSize: '1rem' }}
                    >
                      {getInitials(selectedChat.contact.fullName)}
                    </CustomAvatar>
                    {/* )} */}
                  </Badge>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {selectedChat.contact.fullName}
                    </Typography>
                    <Typography sx={{ color: 'text.disabled' }}>
                      {selectedChat.campaign_name || 'Campaign Type'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* {mdAbove ? (
                  <Fragment>
                    <IconButton size='small' sx={{ color: 'text.secondary' }}>
                      <Icon icon='tabler:phone-call' />
                    </IconButton>
                    <IconButton size='small' sx={{ color: 'text.secondary' }}>
                      <Icon icon='tabler:video' />
                    </IconButton>
                    <IconButton size='small' sx={{ color: 'text.secondary' }}>
                      <Icon icon='tabler:search' />
                    </IconButton>
                  </Fragment>
                ) : null} */}

                {/* <OptionsMenu
                  menuProps={{ sx: { mt: 2 } }}
                  icon={<Icon icon='tabler:dots-vertical' />}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                  options={['View Lead', 'Change Status']}
                /> */}
                <IconButton
                  aria-label='more'
                  id='long-button'
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup='true'
                  onClick={handleClick}
                  disabled={store.isLoading}
                >
                  <Icon icon='tabler:dots-vertical' />
                </IconButton>
                <Menu
                  id='long-menu'
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{ style: { maxHeight: 48 * 4.5, width: '20ch' } }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      handleUserProfileRightSidebarToggle()
                    }}
                  >
                    View Lead
                  </MenuItem>
                  <MenuItem onClick={handleClickOpenM}>Change Status</MenuItem>
                </Menu>
              </Box>
              <Dialog
                open={openM}
                // keepMounted
                fullWidth
                onClose={handleCloseM}
                TransitionComponent={Transition}
                aria-labelledby='alert-dialog-slide-title'
                aria-describedby='alert-dialog-slide-description'
              >
                <DialogTitle id='alert-dialog-slide-title'>Change Status</DialogTitle>
                <DialogContent>
                  {/* <FormControl
                    size='small'
                    error={!!errors.status?.message}
                    fullWidth
                    sx={{ mb: 6 }}
                  >
                    <InputLabel id='campaigns'>Please select</InputLabel>
                    <Select
                      labelId='campaigns'
                      id='campaigns'
                      label='Please select'
                      {...register('status')}
                    >
                      {allData.map((campaign: CampaignType) => (
                        <MenuItem key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.status?.message}</FormHelperText>
                  </FormControl> */}
                  <Controller
                    name='status'
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        fullWidth
                        ListboxProps={{ onScroll }}
                        sx={{ mb: 6 }}
                        size='small'
                        loading={isLoading}
                        // @ts-ignore
                        onChange={(_, value: CampaignType) => {
                          setSearch('')
                          onChange(value?.id)
                        }}
                        // @ts-ignore
                        defaultValue={store.retrieveLead?.status}
                        autoHighlight
                        id='campaigns'
                        options={data}
                        getOptionLabel={(option: CampaignType) => option.title}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!errors.status?.message}
                            helperText={errors.status?.message}
                            label='Please select'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {isLoading ? (
                                    <CircularProgress color='inherit' size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />

                  <TextField
                    type='text'
                    label='Text note'
                    placeholder='Text note'
                    size='small'
                    {...register('note')}
                    error={!!errors.note?.message}
                    helperText={errors.note?.message}
                    minRows={4}
                    fullWidth
                    multiline
                  />
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                  <LoadingButton
                    loading={isLoadingChangeStatus}
                    type='submit'
                    color='success'
                    variant='outlined'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </LoadingButton>
                  <Button color='error' variant='outlined' onClick={handleCloseM}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            {selectedChat && user ? (
              // @ts-ignore
              <ChatLog hidden={hidden} data={{ ...selectedChat, userContact: user }} />
            ) : null}

            <SendMsgForm
              store={store}
              dispatch={dispatch}
              selectChat={selectChat}
              selectChatId={selectChatId}
              sendMsg={sendMsg}
              data={dataRooms}
              setData={setDataRooms}
            />

            <UserProfileRight
              store={store}
              hidden={hidden}
              statusObj={statusObj}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              userProfileRightOpen={userProfileRightOpen}
              handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
            />
          </Box>
        )
      }
    } else {
      return null
    }
  }

  return renderContent()
}

export default ChatContent
