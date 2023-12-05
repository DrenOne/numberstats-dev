// ** MUI Imports
import { FC, ReactElement, Ref, forwardRef } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, Slide, SlideProps } from '@mui/material'

// ** Icon Imports
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export type PopConfirmI = {
  open: boolean
  onClose: Function
  onDelete: Function
  onCancel: Function
}

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const PopConfirm: FC<PopConfirmI> = ({ open, onClose, onDelete, onCancel }) => {
  return (
    <Dialog
      open={open}
      keepMounted
      // @ts-ignore
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle id='alert-dialog-slide-title' sx={{ display: 'flex', flexDirection: 'column', mx: 'auto' }}>
        {/* <Box> */}
        <ErrorOutlineIcon color='warning' fontSize='large' sx={{ mx: 'auto' }} />
        Are you sure?
        {/* </Box> */}
      </DialogTitle>
      <DialogActions className='dialog-actions-dense'>
        {/* @ts-ignore */}
        <Button variant='contained' color='error' onClick={onCancel} sx={{ textTransform: 'none' }}>
          No, cancel
        </Button>
        {/* @ts-ignore */}
        <Button variant='contained' color='success' onClick={onDelete} sx={{ textTransform: 'none' }}>
          Yes, delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopConfirm
