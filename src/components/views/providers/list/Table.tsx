import { FC, useEffect, useState } from 'react'
import { DataGrid, GridRowId } from '@mui/x-data-grid'
import { ITable, ProviderDataType } from 'src/types/sms/ProviderTypes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getProviderTable } from 'src/store/sms/providers'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Table: FC<ITable> = props => {
  // Props
  const { store, action, text } = props

  // Dispatch
  const dispatch = useDispatch<AppDispatch>()

  // State
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [page, setPage] = useState<number>(1)
  const [ordering, setOrdering] = useState<{ field: string; sort: 'asc' | 'desc' }[]>([])

  useEffect(() => {
    if (action)
      dispatch(
        getProviderTable(action.split('/api/v1/')[1] + text + '/', {
          per_page: pageSize,
          page,
          ordering: `${ordering[0]?.sort === 'desc' ? '-' : ''}${ordering[0]?.field}`,
        })
      )
  }, [action, text, pageSize, page, ordering])

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'ID',
    },
    {
      flex: 0.1,
      field: 'phone_number',
      minWidth: 250,
      headerName: 'Phone number',
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'message_profile',
      headerName: 'Name',
      renderCell: ({ row }: { row: ProviderDataType }) => (
        <Typography sx={{ color: 'text.secondary' }}>{row?.message_profile?.name}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Campaign'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              // onClick={() => getIdFunc(row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit Campaign'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/sms/providers/numbers/${row.id}`}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <DataGrid
      autoHeight
      pagination
      rowHeight={62}
      rows={store.data}
      rowCount={store.count}
      columns={columns}
      sortingMode='server'
      sortModel={ordering}
      checkboxSelection
      disableSelectionOnClick
      loading={store.isLoading}
      paginationMode='server'
      pageSize={Number(pageSize)}
      rowsPerPageOptions={[10, 25, 50]}
      onSelectionModelChange={rows => setSelectedRows(rows)}
      onPageSizeChange={newPageSize => {
        setPage(1)
        setPageSize(newPageSize)
      }}
      onPageChange={newPage => setPage(newPage + 1)}
      // @ts-ignore
      onSortModelChange={value => setOrdering(value)}
    />
  )
}

export default Table
