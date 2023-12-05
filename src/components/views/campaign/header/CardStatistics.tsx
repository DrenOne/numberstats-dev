import Grid from "@mui/material/Grid"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import EcommerceGeneratedLeads from "./EcommerceGeneratedLeads"
import EcommerceTransactionsHorizontal from "./EcommerceTransactionsHorizontal"



const CardStatistics = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} mb={8}>
        <Grid item xs={12} md={4}>
          <EcommerceGeneratedLeads />
        </Grid>
        <Grid item xs={12} md={8}>
          <EcommerceTransactionsHorizontal />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CardStatistics
