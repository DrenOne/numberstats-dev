// ** React Imports
import { memo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Third Party Styles Import
import 'chart.js/auto'

// ** Custom Components Imports
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Typography } from '@mui/material'

const Reports = memo(() => {
  // ** Hook
  const theme = useTheme()

  const { reports } = useSelector((state: RootState) => state.reports)

  const renderStats = () => {
    return reports?.map((item: { value: number; label: string }, index: number) => (
      <Grid item xs={6} md={3} key={index}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
          <Icon icon={sale.icon} />
        </CustomAvatar> */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>{item.value}</Typography>
            <Typography variant='body2'>{item.label}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title='Reports'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        // action={
        //   <Typography variant='body2' sx={{ color: 'text.disabled' }}>
        //     Updated 1 month ago
        //   </Typography>
        // }
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats()}
          {/* <Grid item md={5}>
            {Object.keys(reports!).length ? (
              <Box
                component={ReactApexcharts}
                options={reportsData.chartOptions}
                series={reportsData.series}
                type='pie'
                sx={{ '& .apexcharts-legend-text': { color: `${theme.palette.text.secondary} !important` } }}
              />
            ) : null}
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )
})

export default Reports
