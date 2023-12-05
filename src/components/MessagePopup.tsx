// ** React Imports
import { FC } from 'react'

// ** MUI Imports
import { Box } from '@mui/material'

type IMessagePopup = {
  title?: string
  subtitle?: string
}

const Test: FC<IMessagePopup> = ({ title, subtitle }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box>
        {title}
        <Box>{subtitle}</Box>
      </Box>
    </Box>
  )
}

function MessagePopup({ title, subtitle }: IMessagePopup): JSX.Element {
  return (
    <div>
      <Test title={title} subtitle={subtitle} />
    </div>
  )
}

export default MessagePopup
