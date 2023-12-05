// ** React Imports
import { useState, useEffect, ChangeEvent, ReactNode, Fragment, useRef } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
import { ContactType, ChatSidebarLeftType, ChatsArrType } from 'src/types/sms/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Chat App Components Imports
import UserProfileLeft from 'src/components/views/chat/UserProfileLeft'
import ChatSkeleton from 'src/components/views/chat/ChatSkeleton'
import { fetchChatsContacts } from 'src/store/sms/chat'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@mui/material'
import authConfig, { getDomain, getHost } from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

const ScrollWrapper = ({
  children,
  hidden,
  page,
  setPage,
  data,
}: {
  children: ReactNode
  hidden: boolean
  page: number
  setPage: Function
  data: ChatsArrType[]
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { countRooms } = useSelector((state: RootState) => state.chat)

  const onScroll = (event: any) => {
    const listboxNode = event.currentTarget
    const scrollHeight = event.target.scrollHeight
    const collected = listboxNode.scrollTop + listboxNode.clientHeight
    // @ts-ignore
    if (scrollHeight === collected && data?.length < countRooms) {
      setPage(page + 1)
      dispatch(fetchChatsContacts({ per_page: 20, page: page + 1 }))
    }
  }

  if (hidden) {
    return (
      <Box sx={{ height: '100%', overflow: 'auto' }} onScroll={onScroll}>
        {/* <Box sx={{ height: '100%', overflow: 'auto' }}> */}
        {children}
      </Box>
    )
  } else {
    return (
      <PerfectScrollbar options={{ wheelPropagation: false }} onScroll={onScroll}>
        {/* <PerfectScrollbar options={{ wheelPropagation: false }}> */}
        {children}
      </PerfectScrollbar>
    )
  }
}

const SidebarLeft = (props: ChatSidebarLeftType) => {
  // ** Props
  const {
    page,
    data,
    setPage,
    setData,
    store,
    hidden,
    mdAbove,
    dispatch,
    statusObj,
    userStatus,
    selectChat,
    setSelectChatId,
    getInitials,
    sidebarWidth,
    setUserStatus,
    leftSidebarOpen,
    removeSelectedChat,
    userProfileLeftOpen,
    formatDateToMonthShort,
    handleLeftSidebarToggle,
    handleUserProfileLeftSidebarToggle,
  } = props

  const { user } = useAuth()

  // ** States
  const [query, setQuery] = useState<string>('')
  const [filteredChat, setFilteredChat] = useState<ChatsArrType[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([])
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null)
  // const [data, setData] = useState<ChatsArrType[]>([])
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  // ** Hooks
  const router = useRouter()

  const handleChatClick = (type: 'chat' | 'contact', id: number | string) => {
    setSelectChatId(id)
    dispatch(selectChat(id))
    setActive({ type, id })
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const member = (chat: ChatsArrType) => {
    return chat.member.find(memberItem => memberItem.lead_id === null)
  }

  useEffect(() => {
    if (store && store.chats) {
      if (active !== null) {
        if (active.type === 'contact' && active.id === store.chats[0].id) {
          setActive({ type: 'chat', id: active.id })
        }
      }
    }
  }, [store, active])

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setActive(null)

      dispatch(removeSelectedChat())
    })

    return () => {
      setActive(null)

      dispatch(removeSelectedChat())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (store.chats?.length && !query.length) {
      store.chats.map((chat: ChatsArrType) => {
        if (!data.find((item: ChatsArrType) => item.id === chat.id)) data.push(chat)
      })
      setData([...data])
    }
  }, [store.chats])

  useEffect(() => {
    if (data.length && Object.keys(store?.lastMessage)?.length) {
      // @ts-ignore
      if (data.find(item => item.id === store.lastMessage.id))
        data.forEach((element, index) => {
          // @ts-ignore
          if (element.id === store.lastMessage.id) data.splice(index, 1)
        })
      // @ts-ignore
      data.unshift(store.lastMessage)
      setData([...data])
    }
  }, [store.lastMessage])

  useEffect(() => {
    dispatch(fetchChatsContacts({ search: query, page: 1, per_page: 20 }))
  }, [query])

  const renderChats = () => {
    // if (store && store.chats && store.chats.length) {
    if (store && data && data.length) {
      if (query.length && !data.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Chats Found</Typography>
          </ListItem>
        )
      } else {
        // const arrToMap = query.length && filteredChat.length ? filteredChat : store.chats
        // const arrToMap = query.length && filteredChat.length ? filteredChat : data
        const arrToMap = query.length ? store.chats : data

        return arrToMap?.length
          ? arrToMap?.map((chat: ChatsArrType, index: number) => {
              const { lastMessage } = chat?.chat || {}
              const activeCondition =
                active !== null && active.id === chat.id && active.type === 'chat'

              return (
                <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1 } }}>
                  <ListItemButton
                    disableRipple
                    onClick={() => handleChatClick('chat', chat.id)}
                    sx={{
                      py: 2,
                      px: 3,
                      width: '100%',
                      borderRadius: 1,
                      alignItems: 'flex-start',
                      ...(activeCondition && {
                        background: theme =>
                          `linear-gradient(72.47deg, ${
                            theme.palette.primary.main
                          } 22.16%, ${hexToRGBA(
                            theme.palette.primary.main,
                            0.7
                          )} 76.47%) !important`,
                      }),
                    }}
                  >
                    <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
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
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              color: 'purple',
                              backgroundColor: 'green',
                              boxShadow: theme =>
                                `0 0 0 2px ${
                                  !activeCondition
                                    ? theme.palette.background.paper
                                    : theme.palette.common.white
                                }`,
                            }}
                          />
                        }
                      >
                        {chat.avatar ? (
                          <MuiAvatar
                            src={chat.avatar}
                            alt={chat.fullName}
                            sx={{
                              width: 38,
                              height: 38,
                              outline: theme =>
                                `2px solid ${
                                  activeCondition ? theme.palette.common.white : 'transparent'
                                }`,
                            }}
                          />
                        ) : (
                          <CustomAvatar
                            color={chat.avatarColor}
                            skin={activeCondition ? 'light-static' : 'light'}
                            sx={{
                              width: 38,
                              height: 38,
                              fontSize: '1rem',
                              outline: theme =>
                                `2px solid ${
                                  activeCondition ? theme.palette.common.white : 'transparent'
                                }`,
                            }}
                          >
                            {getInitials(chat.fullName)}
                          </CustomAvatar>
                        )}
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        my: 0,
                        ml: 3,
                        mr: 1.5,
                        '& .MuiTypography-root': {
                          ...(activeCondition && { color: 'common.white' }),
                        },
                      }}
                      primary={
                        <Typography noWrap sx={{ fontWeight: 500 }}>
                          {chat.fullName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            noWrap
                            sx={{ ...(!activeCondition && { color: 'text.secondary' }) }}
                          >
                            {lastMessage ? lastMessage.message : null}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          whiteSpace: 'nowrap',
                          color: activeCondition ? 'common.white' : 'text.disabled',
                        }}
                      >
                        <>
                          {lastMessage
                            ? formatDateToMonthShort(lastMessage.time as string, true)
                            : new Date()}
                        </>
                      </Typography>
                      {chat?.chat?.unseenMsgs && chat?.chat?.unseenMsgs > 0 ? (
                        <Chip
                          color='error'
                          label={chat?.chat?.unseenMsgs}
                          sx={{
                            mt: 0.5,
                            height: 18,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '& .MuiChip-label': { pt: 0.25, px: 1.655 },
                          }}
                        />
                      ) : null}
                      {/* {chat.member.find(memberItem => memberItem.id === user?.chat_user_id) */}
                      {Object.keys(member(chat) as {}).length ? (
                        <Typography
                          variant='caption'
                          color={member(chat)?.id === user?.chat_user_id ? 'green' : 'red'}
                        >
                          {member(chat)?.username}
                        </Typography>
                      ) : null}
                    </Box>
                  </ListItemButton>
                </ListItem>
              )
            })
          : null
      }
    }
  }

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: sidebarWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius,
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1,
          },
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          {store && user ? (
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{ mr: 3 }}
              onClick={handleUserProfileLeftSidebarToggle}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: `${statusObj[userStatus]}.main`,
                    backgroundColor: `${statusObj[userStatus]}.main`,
                    boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                  }}
                />
              }
            >
              <MuiAvatar
                src={user?.avatar as string}
                alt={user?.fullName}
                sx={{ width: '2.375rem', height: '2.375rem', cursor: 'pointer' }}
              />
            </Badge>
          ) : null}
          <TextField
            autoComplete='false'
            fullWidth
            size='small'
            value={query}
            onChange={handleFilter}
            placeholder='Search for contact...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon icon='tabler:search' fontSize={20} />
                </InputAdornment>
              ),
              endAdornment:
                store.isLoadingChat && query.length ? (
                  <InputAdornment position='end' sx={{ color: 'text.secondary' }}>
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
            }}
          />
          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='tabler:x' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.0625rem)` }}>
          <ScrollWrapper hidden={hidden} page={page} setPage={setPage} data={data}>
            <Box sx={{ p: theme => theme.spacing(5, 3, 3) }}>
              {/* <Typography variant='h6' sx={{ ml: 3, mb: 3.5, color: 'primary.main' }}>
                New Prospect
              </Typography> */}
              {store.isLoadingChat && !data.length ? (
                <ChatSkeleton />
              ) : data.length ? (
                <Fragment>
                  <List sx={{ mb: 3, p: 0 }}>{renderChats()}</List>
                  {store.isLoadingChat ? <ChatSkeleton /> : null}
                </Fragment>
              ) : null}
              {/* <ChatSkeleton /> */}
              {/* <Typography variant='h6' sx={{ ml: 3, mb: 3.5, color: 'primary.main' }}>
                Marketing
              </Typography> */}
              {/* <List sx={{ p: 0 }}>{renderContacts()}</List> */}
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

      <UserProfileLeft
        store={store}
        hidden={hidden}
        statusObj={statusObj}
        userStatus={userStatus}
        sidebarWidth={sidebarWidth}
        setUserStatus={setUserStatus}
        userProfileLeftOpen={userProfileLeftOpen}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
    </div>
  )
}

export default SidebarLeft
