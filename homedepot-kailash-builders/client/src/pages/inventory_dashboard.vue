<template>
  <div class="q-pa-sm">
    <div v-if="chartData" class="row">
      <div class="col-12">
        <div class="text-h6 text-bold q-pt-sm q-pb-sm text-primary">
          Average Inventory Turnaround
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
      </div>
      <div class="col-12">
        <div :key="chartKey" v-if="state.options" class="no-scroll">
          <apexchart height="350px" type="line" :options="state.options" :series="state.series"></apexchart>
        </div>
      </div>
      <div class="col-12">
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
                <div v-if="chartData.total.length>0 && chartData.total[0].total_amount" class="text-h6 text-bold q-pb-sm">Rs. {{chartData.total[0].total_amount}}</div>
                Total Amount In Inventory
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
                <div v-if="chartData.total.length>0 && chartData.total[0].total_stock" class="text-h6 text-bold q-pb-sm">{{chartData.total[0].total_stock}}</div>
                Total Items In Stock
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pt-md q-pb-md text-h5 text-bold text-primary">
            Top Products Sales
          </div>
          <div :key="ind" v-for="(data,ind) in chartData.topProd" class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
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
        options:{chart: {height: 350}}
      },
      chartKey:1,
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
      this.api.getData('dashboard/inventory').then((response)=>{
        console.log(response)
        this.chartData = response
        this.state.series = response.months.series
        this.state.options = {...this.state.options, ...{
            xaxis:{
              categories: response.months.categories
            }
          }}
        this.GoToMonthyChart()
      })
    }
  },
  mounted() {
    this.state.series = [{
      name: 'Product Amount',
      data: []
    }, {
      name: 'Product Stock',
      data: []
    }]
    this.state.options = {
      chart: {
        height: 350,
          type: 'line',
          dropShadow: {
          enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#77B6EA', '#545454'],
        dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: '',
          align: 'center'
      },
      grid: {
        borderColor: '#e7e7e7',
          row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
          title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Total'
        },
      },
      legend: {
        position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
      }
    }
    this.getDashboard()
  }
}
</script>
