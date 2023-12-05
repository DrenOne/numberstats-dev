// ** React Imports
import { FC, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import themeConfig from 'src/configs/themeConfig'
import { Card } from '@mui/material'

// ** Types Imports
import { TemplateShow } from 'src/types/apps/templateTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CardContent from '@mui/material/CardContent'

// ** Draggable
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// ** Custom Components Imports
import PopConfirm from 'src/components/popconfirm'
import { useDispatch } from 'react-redux'
import { deleteTemplate } from 'src/store/sms/templates'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

export type SmsTimeLineT = {
  data: TemplateShow[]
}

const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
})

const SmsTimeLine: FC<SmsTimeLineT> = ({ data }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { orderId } = useSelector((state: RootState) => state.orders)
  const [stores, setStores] = useState(data)
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string | number | null>()

  const handleDragAndDrop = (results: any) => {
    const { source, destination, type } = results

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (type === 'group') {
      const reorderedStores = [...stores]

      const storeSourceIndex = source.index
      const storeDestinatonIndex = destination.index

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1)
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore)

      return setStores(reorderedStores)
    }
  }

  const delTemplate = () => {
    dispatch(deleteTemplate(orderId, id!))
    setOpen(false)
  }

  const delTemplateCancel = () => setOpen(false)

  return (
    <Card>
      <CardContent
        sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}
      >
        <Typography
          variant='h6'
          sx={{
            ml: 2.5,
            fontWeight: 800,
            lineHeight: '24px',
            fontSize: '2.375rem !important',
          }}
        >
          {themeConfig.templateName}
        </Typography>
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <Timeline>
            <Droppable droppableId='ROOT' type='group'>
              {provided => (
                <Timeline {...provided.droppableProps} ref={provided.innerRef}>
                  {stores.map((template: TemplateShow, index: number) => {
                    let days = Math.floor(template.schedule / 24 / 60)
                    let hours = Math.floor((template.schedule - days * 24 * 60) / 60)
                    let minutes = Math.floor(template.schedule - (days * 24 * 60 + hours * 60))
                    return (
                      <Draggable
                        draggableId={template.id.toString()}
                        key={template.id}
                        index={index}
                      >
                        {provided => (
                          <TimelineItem
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <TimelineSeparator>
                              <TimelineDot color='primary' />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Box
                                sx={{
                                  mb: 2,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant='body2'
                                  sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}
                                >
                                  {template.template.name}
                                </Typography>
                                <div>
                                  <IconButton
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                      setId(template.id)
                                      setOpen(true)
                                    }}
                                  >
                                    <Icon icon='tabler:trash' fontSize={20} />
                                  </IconButton>
                                  <Typography variant='caption'>
                                    {days ? `${days} day${days > 1 ? 's' : ''}` : null}{' '}
                                    {hours ? `${hours} hour${hours > 1 ? 's' : ''}` : null}{' '}
                                    {minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : null}
                                  </Typography>
                                </div>
                              </Box>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {template.template.body}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </Timeline>
              )}
            </Droppable>
          </Timeline>
        </DragDropContext>
      </CardContent>
      <PopConfirm
        open={open}
        onCancel={() => setOpen(false)}
        onDelete={delTemplate}
        onClose={delTemplateCancel}
      />
    </Card>
  )
}

export default SmsTimeLine
