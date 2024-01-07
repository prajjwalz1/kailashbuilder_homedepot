<template>
  <div class="q-pa-sm">
    <div v-if="chartData" class="row">
      <div class="col-12">
        <div class="text-h6 text-bold q-pt-sm q-pb-sm text-primary">
          Total Sales This Quater
        </div>
        <div>
          <q-btn-group push>
            <q-btn color="primary" label="Monthly" @click="GoToMonthyChart">
            </q-btn>
            <q-separator vertical></q-separator>
            <q-btn color="primary"  label="Weekly" @click="GoToWeeklyChart">
            </q-btn>
          </q-btn-group>
        </div>
        <div class="no-scroll">
          <apexchart height="350px" type="line" :options="state.options" :series="state.series"></apexchart>
        </div>
        <div class="row">
          <div class="col-12 q-pt-md q-pb-md text-h5 text-bold text-primary">
            Some Insights
          </div>
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
            <q-card style="min-height: 100%" >
              <q-card-section class="text-center">
                <q-avatar square text-color="green-10" size="100px" font-size="100px" icon="paid">
                </q-avatar>
              </q-card-section>
              <q-card-section class="text-center text-body1">
                <div v-if="chartData.totalSales[0]" class="text-h6 text-bold q-pb-sm">Rs.{{chartData.totalSales[0].total_amount}}</div>
                Total Sales
              </q-card-section>
            </q-card>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
            <q-card style="min-height: 100%" >
              <q-card-section class="text-center">
                <q-avatar square text-color="orange-10" size="100px" font-size="100px" icon="local_shipping">
                </q-avatar>
              </q-card-section>
              <q-card-section class="text-center text-body1">
                <div v-if="chartData.totalSales[0]" class="text-h6 text-bold q-pb-sm">{{chartData.totalStock[0].total_stock}}</div>
                Total Stocks Sold
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pt-md q-pb-md text-h5 text-bold text-primary">
            Top Products Sales
          </div>
          <div :key="ind" v-for="(data,ind) in chartData.products" class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-card class="q-ma-xs">
              <q-card-section>
                <div class="text-bold text-h6">{{data.name}}</div>
                <div class="text-body1">
                  <b>Stock Sold: </b>{{data.purchaseCount+" "+data.category.name}}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import client from "../api/Client";
import FormData from "../api/formData";
export default {
  data(){
    return{
      state:{
        series:[],
        options:{}
      },
      series: {},
      chartOptions: {},
      chartData:null,
      api: client,
      form: new FormData(),
    }
  },
  methods:{
    GoToMonthyChart(){
      this.state.series = this.chartData.months.series
      this.state.options = {...this.state.options, ...{
          xaxis:{
            categories: this.chartData.months.categories
          }
        }}
    },
    GoToWeeklyChart(){
      this.state.series = this.chartData.weeks.series
      this.state.options = {...this.state.options, ...{
          xaxis:{
            categories: this.chartData.weeks.categories
          }
        }}
    },
    getDashboard() {
      this.api.getData('dashboard/sales').then((response)=>{
        this.chartData = response
        this.state.series = response.months.series
        this.state.options = {...this.state.options, ...{
            xaxis:{
              categories: response.months.categories
            }
          }}
      })
    }
  },
  created() {
    this.state.series = {
      name: 'Sales',
      data: []
    }
    this.state.options = {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: '',
        align: 'left',
        style: {
          fontSize: "16px",
          color: '#666'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [ '#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 2,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        title: {
          text: 'Amount in Rs',
        },
      }
    }
    this.getDashboard()
  }
}
</script>
