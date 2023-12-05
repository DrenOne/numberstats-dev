// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

//import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

//import InputLabel from '@mui/material/InputLabel'
//import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

//import MusicPlayerSlider from 'src/components/player'
//import Select, { SelectChangeEvent } from '@mui/material/Select'
import useSound from 'use-sound'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

//import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { clearFileLink, fetchData, getRecording } from 'src/store/pbx/recordings'

// ** Third Party Components
// import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// import { CardStatsType } from 'src/@fake-db/types'

//import { ThemeColor } from 'src/@core/layouts/types'
import { RecordingsType } from 'src/types/pbx/RecordingsType'

//import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/components/pbx/recordings/TableHeader'

//import AddUserDrawer from './AddUserDrawer'

interface CellType {
  row: RecordingsType
}

// ** renders client column
const renderClient = (row: RecordingsType) => {
  // if (row.avatar.length) {
  //   return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  // } else {
  return (
    <CustomAvatar
      skin='light'
      color={row.avatarColor}
      sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
    >
      {getInitials(row.display_name ? row.display_name : 'Calling Info')}
    </CustomAvatar>
  )

  // }
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { fileLink } = useSelector((state: RootState) => state.recordings)

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [button, setButton] = useState<string>('')

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  // const [fileLink, setFilelink] = useState('')
  const [play] = useSound(fileLink)

  // const StartPlay = () = {
  //   audio = new Audio(this.props.url)
  // }
  useEffect(() => {
    if (fileLink && button === 'play') {
      play()
      dispatch(clearFileLink())
    } else if (fileLink && button === 'download') {
      router.push(fileLink)
      dispatch(clearFileLink())
    }
  }, [fileLink])

  const HandlePlay = () => {
    dispatch(getRecording(id))
    setButton('play')
    // .then(data => {
    //   // new Audio('https://file-examples.com/storage/fedc2a8fe563f8f32a2399f/2017/11/file_example_WAV_5MG.wav').play
    //   setFilelink(data.payload.url)
    //   play()
    //   console.log(data.payload.url)
    // })
    handleRowOptionsClose()
  }
  const HandleDownload = () => {
    dispatch(getRecording(id))
    setButton('download')
    // .then(data => {
    //   console.log(data.payload.url)
    //   router.push(data.payload.url)
    // })
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={HandlePlay}>
          <Icon icon='tabler:eye' fontSize={20} />
          Play
        </MenuItem>
        <MenuItem onClick={HandleDownload} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Download
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 180,
    field: 'fullName',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      const { display_name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {display_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              0KB
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 120,
    headerName: 'DID',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.did}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Date',
    field: 'phoneDate',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.date}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 220,
    field: 'from',
    headerName: 'From',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.participants.split(',').map(String)[0].replace('[', '').replace("'", '').replace("'", '')}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 220,
    field: 'to',
    headerName: 'To',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.participants.split(',').map(String)[1].replace(']', '').replace("'", '').replace("'", '')}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Cloud',
    renderCell: ({ }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label='Synced'
          color='success'
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const Recordings = () => {
  // ** State
  //const [role, setRole] = useState<string>('')
  //const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')

  //const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  // const [isLoading, setisLoading] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.recordings)

  useEffect(() => {
    dispatch(
      // @ts-ignore
      fetchData({
        search: value,
        page: page + 1,
        per_page: pageSize
      })
    )
    // .then(() => {
    //   setisLoading(false)
    // })
  }, [value, page, pageSize])

  const handleFilter = useCallback((val: string) => {
    // setisLoading(true)
    setValue(val)
  }, [])

  const handlePage = useCallback((val: number) => {
    setPage(val)
    // setisLoading(true)
  }, [])

  // const handleRoleChange = useCallback((e: SelectChangeEvent) => {
  //   setRole(e.target.value)
  // }, [])

  // const handlePlanChange = useCallback((e: SelectChangeEvent) => {
  //   setPlan(e.target.value)
  // }, [])

  // const handleStatusChange = useCallback((e: SelectChangeEvent) => {
  //   setStatus(e.target.value)
  // }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item: CardStatsHorizontalWithDetailsProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <>
            <CardHeader title='PBX Recordings' />
            <CardContent>
              {/* <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='role-select'>Order By</InputLabel>
                    <Select
                      fullWidth
                      value={role}
                      id='select-role'
                      label='Select Role'
                      labelId='role-select'
                      onChange={handleRoleChange}
                      inputProps={{ placeholder: 'Select Role' }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      <MenuItem value='admin'>Admin</MenuItem>
                      <MenuItem value='author'>Author</MenuItem>
                      <MenuItem value='editor'>Editor</MenuItem>
                      <MenuItem value='maintainer'>Maintainer</MenuItem>
                      <MenuItem value='subscriber'>Subscriber</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='plan-select'>Select DID</InputLabel>
                    <Select
                      fullWidth
                      value={plan}
                      id='select-plan'
                      label='Select Plan'
                      labelId='plan-select'
                      onChange={handlePlanChange}
                      inputProps={{ placeholder: 'Select Plan' }}
                    >
                      <MenuItem value=''>Select Plan</MenuItem>
                      <MenuItem value='basic'>Basic</MenuItem>
                      <MenuItem value='company'>Company</MenuItem>
                      <MenuItem value='enterprise'>Enterprise</MenuItem>
                      <MenuItem value='team'>Team</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Select Status</InputLabel>
                    <Select
                      fullWidth
                      value={status}
                      id='select-status'
                      label='Select Status'
                      labelId='status-select'
                      onChange={handleStatusChange}
                      inputProps={{ placeholder: 'Select Role' }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='active'>Active</MenuItem>
                      <MenuItem value='inactive'>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid> */}
            </CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={store.data}
              loading={store.isLoading}
              rowCount={store.total}
              columns={columns}
              page={page}
              pageSize={pageSize}
              paginationMode='server'
              onPageChange={newPage => handlePage(newPage)}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            />
          </>
        </Card>
        {/* <MusicPlayerSlider /> */}
      </Grid>
    </Grid>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const res = await axios.get('/cards/statistics')
//   const apiData: CardStatsType = res.data

//   return {
//     props: {
//       apiData
//     }
//   }
// }

export default Recordings
