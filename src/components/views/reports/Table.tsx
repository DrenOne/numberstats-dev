import { useState } from 'react'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  CircularProgress,
  IconButton,
} from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

export type TColumn = {
  headerName: string
  field: string
  align?: 'center' | 'left' | 'right' | 'justify' | 'inherit'
  sort?: boolean
}

interface IProps {
  columns: TColumn[]
  data: any[]
  isLoading?: boolean
  count?: boolean
  onSort?: (value: any) => any
}

const TableComponent = ({ columns, data, isLoading, count, onSort }: IProps) => {
  const [hover, setHover] = useState<string>('')
  const [sort, setSort] = useState<{ sort: 'asc' | 'desc'; name: string }>({
    sort: 'asc',
    name: '',
  })

  const onSorting = (value: string) => {
    if (value === sort.name) {
      if (sort.sort === 'asc') {
        setSort({ ...sort, sort: 'desc' })
        onSort!({ ...sort, sort: 'desc' })
      } else if (sort.sort === 'desc') {
        setSort({ name: '', sort: 'asc' })
        onSort!({ name: '', sort: 'asc' })
      }
    } else {
      setSort({ name: value, sort: 'asc' })
      onSort!({ name: value, sort: 'asc' })
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            {count ? <TableCell width={30} /> : null}
            {columns.map(column => (
              <TableCell
                key={column.field}
                align={column.align}
                onMouseEnter={() => setHover(column.field)}
                onMouseLeave={() => setHover('')}
              >
                {column.headerName}
                {column.sort && column.field === sort?.name && sort.sort === 'asc' ? (
                  <IconButton size='small' onClick={() => onSorting(column.field)}>
                    <ArrowDownwardIcon />
                  </IconButton>
                ) : column.sort && column.field === sort?.name && sort.sort === 'desc' ? (
                  <IconButton size='small' onClick={() => onSorting(column.field)}>
                    <ArrowUpwardIcon />
                  </IconButton>
                ) : null}
                {column.sort && hover === column.field && sort?.name !== column.field ? (
                  <IconButton size='small' onClick={() => onSorting(column.field)}>
                    <ArrowDownwardIcon />
                  </IconButton>
                ) : null}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {isLoading ? (
          <CircularProgress sx={{ mt: 2, ml: 2 }} />
        ) : (
          <TableBody>
            {data?.length ? (
              data?.map((item: any, index: number) => (
                <TableRow key={item.id || index}>
                  {count ? <TableCell width={30}>{index + 1}</TableCell> : null}
                  {columns.map(column => (
                    <TableCell key={column.field} align={column.align}>
                      {item[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (count ? 1 : 0)} align='center'>
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}

export default TableComponent
