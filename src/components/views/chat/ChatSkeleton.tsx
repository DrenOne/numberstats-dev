// ** React Imports
import React from 'react'

// ** Mui Imports
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Skeleton, Stack } from '@mui/material'

const ChatSkeleton = () => {
  return (
    <Stack sx={{ display: 'flex', flexDirection: 'row', width: '100%', px: 3 }}>
      <Box sx={{ m: 'auto' }}>
        <Skeleton variant='circular' animation='wave'>
          <Avatar />
        </Skeleton>
      </Box>
      <Box sx={{ display: 'flex', width: '100%', ml: 2 }}>
        <Box sx={{ width: '80%', pr: 6 }}>
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} animation='wave' />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} animation='wave' />
        </Box>
        <Box sx={{ width: '20%' }}>
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} animation='wave' />
        </Box>
      </Box>
    </Stack>
  )
}

export default ChatSkeleton
