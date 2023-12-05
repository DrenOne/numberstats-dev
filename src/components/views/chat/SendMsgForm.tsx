// ** React Imports
import { useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ChatsArrType, SendMsgComponentType } from 'src/types/sms/chatTypes'
import { LoadingButton } from '@mui/lab'
import Modal from 'src/components/views/chat/Modal'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}))

const Form = styled('form')(({ theme }) => ({ padding: theme.spacing(0, 5, 5) }))

const SendMsgForm = (props: SendMsgComponentType) => {
  // ** Props
  const { store, dispatch, data, selectChat, selectChatId, sendMsg } = props
  const { user } = useAuth()

  // ** State
  const [msg, setMsg] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [selectedRoom, setSelectedRoom] = useState<ChatsArrType>()

  useEffect(() => {
    data?.forEach(item => {
      if (item.id === store.selectedChat?.contact.id) setSelectedRoom(item)
    })
  }, [store.selectedChat, data])

  const sendMessage = () => {
    // @ts-ignore
    dispatch(sendMsg({ ...store.selectedChat, message: msg }))
    setMsg('')
    setOpen(false)
  }

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    if (store && store.selectedChat && msg.trim().length) {
      if (selectedRoom?.member.find(item => user?.chat_user_id === item.id)) sendMessage()
      else setOpen(true)
    }
  }

  useEffect(() => {
    if (Object.keys(store.SendMsgSuccess).length) {
      setMsg('')
      dispatch(selectChat(selectChatId as number))
    }
  }, [store.SendMsgSuccess])

  return (
    <Form onSubmit={handleSendMsg}>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            value={msg}
            size='small'
            placeholder='Type your message here…'
            onChange={e => setMsg(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': { boxShadow: 'none' },
              },
              '& .MuiOutlinedInput-input': {
                p: theme => theme.spacing(1.875, 2.5),
              },
              '& fieldset': { border: '0 !important' },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <IconButton size='medium' sx={{ color: 'text.primary' }}>
            <Icon icon='tabler:checkbox' />
          </IconButton> */}
          {/* <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 3, color: 'text.primary' }}>
            <Icon icon='tabler:photo' />
            <input hidden type='file' id='upload-img' />
          </IconButton> */}
          <LoadingButton loading={store.isLoadingSendMsg} type='submit' variant='contained'>
            Send
          </LoadingButton>
        </Box>
      </ChatFormWrapper>
      <Modal
        open={open}
        setOpen={setOpen}
        yesButton={sendMessage}
        user={selectedRoom?.member.find(item => item.lead_id === null)?.username as string}
      />
    </Form>
  )
}

export default SendMsgForm
