// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { Box } from '@mui/material'

const ReportsInterval = ({ series, categories }: { series: any; categories: string[] }) => {
  // ** Hook
  const theme = useTheme()

  const { reportsInterval } = useSelector((state: RootState) => state.reports)

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    dataLabels: { enabled: false, style: { fontSize: '12px', colors: ['#fff'] } },
    stroke: { show: true, colors: ['transparent'] },
    plotOptions: {
      bar: {
        borderRadius: 8,
        // barHeight: '30%',
        // horizontal: true,
        startingShape: 'rounded',
      },
    },
    tooltip: { shared: true, intersect: false },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: true } },
      padding: { top: -10 },
    },
    yaxis: { labels: { style: { colors: theme.palette.text.disabled } } },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories,
      labels: { style: { colors: theme.palette.text.disabled } },
    },
  }

  return (
    <Card sx={{ mt: 8 }}>
      <CardHeader
        title='Interval Reports'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] },
        }}
      />
      <CardContent>
        {reportsInterval ? (
          <ReactApexcharts type='bar' height={400} options={options} series={series} />
        ) : null}
      </CardContent>
    </Card>
  )
}

export default ReportsInterval
