// ** React Imports
import { useState, useEffect, forwardRef, Ref, ReactElement } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Button, Dialog, DialogActions, DialogTitle, Slide, SlideProps } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { deleteTemplate, fetchData } from 'src/store/sms/templates'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { TemplateType } from 'src/types/apps/templateTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/components/views/templates/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PopConfirm from 'src/components/popconfirm'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: TemplateType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler:circle-check' },
  Paid: { color: 'success', icon: 'tabler:circle-half-2' },
  Draft: { color: 'primary', icon: 'tabler:device-floppy' },
  'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' },
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 50,
    headerName: 'ID',
    sortable: false,
    // renderCell: ({ row }: CellType) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 250,
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      const { name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    field: 'title',
    headerName: 'Title',
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'invoiceStatus',
    headerName: 'Last Modified At',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.updated_at.slice(0, 10)}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'total',
    headerName: 'Last Modified by',
    // renderCell: ({ row }: CellType) => (
    //   <Typography sx={{ color: 'text.secondary' }}>{row.updated_at.slice(0, 10)}</Typography>
    // )
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'spam_risk',
    headerName: 'Spam Risk',
    // renderCell: ({ row }: CellType) => (
    //   <Typography sx={{ color: 'text.secondary' }}>{row.updated_at.slice(0, 10)}</Typography>
    // )
  },
  {
    flex: 0.15,
    minWidth: 50,
    field: 'issuedDate',
    headerName: 'In Use',
    sortable: false,
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>
        {row.in_use ? <CheckIcon color='success' /> : <CloseIcon color='error' />}
      </Typography>
    ),
  },
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return (
    <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  )
})
/* eslint-enable */

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const TemplateList = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [getId, setGetId] = useState<number | string>('')
  const [ordering, setOrdering] = useState<{ field: string; sort: 'asc' | 'desc' }[]>([])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.templates)

  // ** Use Router
  const router = useRouter()

  useEffect(() => {
    dispatch(
      fetchData({
        // @ts-ignore
        dates,
        // q: value,
        status: statusValue,
      })
    )
  }, [statusValue, dates])

  useEffect(() => {
    dispatch(
      fetchData({
        search: value,
        page: 1,
        per_page: 20,
        ordering: `${ordering[0]?.sort === 'desc' ? '-' : ''}${ordering[0]?.field}`,
      })
    )
  }, [value, ordering])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const getIdFunc = (id: number) => {
    setGetId(id)
    setOpen(true)
  }

  const delTemplate = () => {
    console.log(getId)
    // dispatch(deleteTemplate(getId))
  }

  const delTemplateCancel = () => {
    setGetId('')
    setOpen(false)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Template'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => getIdFunc(row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit Template'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => router.push(`/sms/templates/${row.id}`)}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/apps/invoice/preview/${row.id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip> */}
          {/* <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='tabler:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/apps/invoice/edit/${row.id}`,
                icon: <Icon icon='tabler:edit' fontSize={20} />
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='tabler:copy' fontSize={20} />
              }
            ]}
          /> */}
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={store.allData}
              // @ts-ignore
              columns={columns}
              sortingMode='server'
              sortModel={ordering}
              loading={store.isLoading}
              checkboxSelection
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              onSelectionModelChange={rows => setSelectedRows(rows)}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              // @ts-ignore
              onSortModelChange={value => setOrdering(value)}
            />
          </Card>
        </Grid>
      </Grid>
      {/* <Dialog
        open={open}
        keepMounted
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title' sx={{ display: 'flex', flexDirection: 'column', mx: 'auto' }}>
          <ErrorOutlineIcon color='warning' fontSize='large' sx={{ mx: 'auto' }} />
          Are you sure?
        </DialogTitle>
        <DialogActions className='dialog-actions-dense'>
          <Button variant='contained' color='error' onClick={delTemplateCancel} sx={{ textTransform: 'none' }}>
            No, cancel
          </Button>
          <Button variant='contained' color='success' onClick={delTemplate} sx={{ textTransform: 'none' }}>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog> */}
      <PopConfirm
        open={open}
        onClose={() => setOpen(false)}
        onDelete={delTemplate}
        onCancel={delTemplateCancel}
      />
    </DatePickerWrapper>
  )
}

export default TemplateList
