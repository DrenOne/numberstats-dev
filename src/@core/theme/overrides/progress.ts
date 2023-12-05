// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Progress = (theme: Theme) => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 12,
          borderRadius: '10px',
          backgroundColor: theme.palette.customColors.trackBg
        },
        bar: {
          borderRadius: '10px'
        }
      }
    }
  }
}

export default Progress
