// ** MUI Imports
import Box from '@mui/material/Box'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { TableHeaderProps } from 'src/types/sms/ProviderTypes'


const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { store, text, action, setAction } = props

  useEffect(() => {
    if (store.actions.length) setAction(store.actions[0].api)
  }, [store.actions.length])

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Select
        size='small'
        displayEmpty
        sx={{ mr: 4, mb: 2 }}
        value={action}
        onChange={(e: SelectChangeEvent<string>) => setAction(e.target.value)}
      >
        {store.actions?.map(action => (
          <MenuItem key={action.api} value={action.api}>
            {action.type}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          // value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={`Search ${text}`}
          // onChange={(e: ChangeEvent<HTMLInputElement>) =>
          //   handleFilter(e.target.value.toLowerCase())
          // }
        />
        {/* <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/sms/templates/create'>
          Create Template
        </Button> */}
      </Box>
    </Box>
  )
}

export default TableHeader
