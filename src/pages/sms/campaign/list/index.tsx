// ** React Imports
import { useState, useEffect, forwardRef, ChangeEvent } from 'react'

// ** Next Import
import Link from 'next/link'

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
import { DataGrid, GridRowId } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { getSmsCampaigns } from 'src/store/sms/campaigns'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/components/views/campaign/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CardStatistics from 'src/components/views/campaign/header/CardStatistics'
import { Button } from '@mui/material'
import { CampaignType } from 'src/types/apps/campaignTypes'
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
  row: CampaignType
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

// ** renders client column
const renderClient = (row: InvoiceType) => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, fontSize: '1rem', width: 38, height: 38, fontWeight: 500 }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    maxWidth: 80,
    headerName: 'ID',
    // renderCell: ({ row }: CellType) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  // {
  //   flex: 0.25,
  //   field: 'name',
  //   minWidth: 320,
  //   headerName: 'Name',
  //   renderCell: ({ row }: CellType) => {
  //     const { name, companyEmail } = row

  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         {renderClient(row)}
  //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  //           <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
  //             {name}
  //           </Typography>
  //           <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
  //             {companyEmail}
  //           </Typography>
  //         </Box>
  //       </Box>
  //     )
  //   }
  // },
  {
    flex: 0.1,
    field: 'title',
    minWidth: 250,
    headerName: 'Title',
  },
  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   field: 'invoiceStatus',
  //   headerName: 'Status',
  //   renderCell: ({ row }: CellType) => {
  //     const { dueDate, balance, invoiceStatus } = row

  //     const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

  //     return (
  //       <Tooltip
  //         title={
  //           <div>
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               {invoiceStatus}
  //             </Typography>
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Balance:
  //             </Typography>{' '}
  //             {balance}
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Due Date:
  //             </Typography>{' '}
  //             {dueDate}
  //           </div>
  //         }
  //       >
  //         <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
  //           <Icon icon={invoiceStatusObj[invoiceStatus]?.icon} />
  //         </CustomAvatar>
  //       </Tooltip>
  //     )
  //   }
  // },
  {
    flex: 0.15,
    minWidth: 50,
    field: 'timezone',
    headerName: '# of Leads',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.no_of_leads}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'active',
    headerName: 'Active',
    sortable: false,
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>
        {row.active ? <CheckIcon color='success' /> : <CloseIcon color='error' />}
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

const CampaignList = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [getId, setGetId] = useState<number | string>('')
  const [ordering, setOrdering] = useState<{ field: string; sort: 'asc' | 'desc' }[]>([])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { allData, isLoading, count } = useSelector((state: RootState) => state.campaigns)

  useEffect(() => {
    dispatch(
      getSmsCampaigns({
        per_page: pageSize,
        page,
        search: value,
        ordering: `${ordering[0]?.sort === 'desc' ? '-' : ''}${ordering[0]?.field}`,
      })
    )
  }, [pageSize, page, value, ordering])

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
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

  const delCampaign = () => {
    console.log(getId)
  }

  const delCampaignCancel = () => {
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
          <Tooltip title='Delete Campaign'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => getIdFunc(row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit Campaign'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/sms/campaign/${row.id}`}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Order Campaign'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/sms/campaign/order/${row.id}`}
            >
              <Icon icon='tabler:align-box-left-stretch' />
            </IconButton>
          </Tooltip>
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
      {/* <CardStatistics /> */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 4 }}>
              <Button variant='contained' size='small' sx={{ mr: 4 }} startIcon={<AddIcon />}>
                Pull Data
              </Button>
              <FormControl size='small' sx={{ mr: 4 }}>
                <InputLabel id='filter'>Filter</InputLabel>
                <Select labelId='filter' label='Filter' placeholder='Filter'>
                  <MenuItem value='test1'>test1</MenuItem>
                  <MenuItem value='test2'>test2</MenuItem>
                  <MenuItem value='test3'>test3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                placeholder='Search Campaign'
                size='small'
                sx={{ mr: 4 }}
                onChange={handleFilter}
              />
              <Button
                sx={{ mb: 2 }}
                component={Link}
                variant='contained'
                href='/sms/campaign/create'
              >
                Create Campaign
              </Button>
            </Box>
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={allData}
              rowCount={count}
              columns={columns}
              sortingMode='server'
              sortModel={ordering}
              checkboxSelection
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              loading={isLoading}
              paginationMode='server'
              rowsPerPageOptions={[10, 25, 50]}
              // page={page - 1}
              onSelectionModelChange={rows => setSelectedRows(rows)}
              onPageSizeChange={newPageSize => {
                setPage(1)
                setPageSize(newPageSize)
              }}
              onPageChange={newPage => setPage(newPage + 1)}
              // @ts-ignore
              onSortModelChange={value => setOrdering(value)}
            />
          </Card>
        </Grid>
      </Grid>
      <PopConfirm
        open={open}
        onCancel={() => setOpen(false)}
        onDelete={delCampaign}
        onClose={delCampaignCancel}
      />
    </DatePickerWrapper>
  )
}

export default CampaignList
