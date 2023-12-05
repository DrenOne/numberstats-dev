// ** React Imports
import { FC, Fragment, useState } from 'react'

// ** MUI Imports
import { Box } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

type IErrorPopup = {
  title?: string
  subtitle?: string
}

const Test: FC<IErrorPopup> = ({ title, subtitle }) => {
  // ** State
  const [hover, setHover] = useState<boolean>(false)

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex' }}
    >
      <Box>
        <ErrorIcon color='error' sx={{ mr: 2 }} />
      </Box>
      <Box>
        {title}
        {hover && subtitle ? (
          <Fragment>
            <hr />
            <Box>{subtitle}</Box>
          </Fragment>
        ) : null}
      </Box>
    </Box>
  )
}

function ErrorPopup({ title, subtitle }: IErrorPopup): JSX.Element {
  return (
    <div>
      <Test title={title} subtitle={subtitle} />
    </div>
  )
}

export default ErrorPopup
