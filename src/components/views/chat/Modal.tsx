// ** React Imports
import { FC, forwardRef, Fragment, ReactElement, Ref } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slide, { SlideProps } from '@mui/material/Slide'

interface IProps {
  open: boolean
  setOpen: (value: boolean) => void
  yesButton: (value: any) => any
  user: string
}

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const Modal: FC<IProps> = ({ open, setOpen, yesButton, user }) => {
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          Lead is already assigned to {user}
          <br/>
          Clicks YES to take-over or NO to cancel
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={yesButton}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default Modal
