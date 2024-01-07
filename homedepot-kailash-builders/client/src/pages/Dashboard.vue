<template>
  <div>
    <div class="q-pa-sm" v-if="dashboardDat">
      <div class="text-h5 text-primary text-bold">
        Welcome User!
      </div>
      <div class="row q-pt-md">
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
          <q-card style="min-height: 100%" >
            <q-card-section class="text-center">
              <q-avatar square text-color="indigo-10" size="100px" font-size="100px" icon="task_alt">
              </q-avatar>
            </q-card-section>
            <q-card-section class="text-center text-body1">
              <div class="text-h5 text-bold q-pb-sm">{{dashboardDat.approvals}}</div>
              Approvals Awaiting
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
          <q-card style="min-height: 100%" >
            <q-card-section class="text-center">
              <q-avatar square text-color="orange-10" size="100px" font-size="100px" icon="maps_home_work">
              </q-avatar>
            </q-card-section>
            <q-card-section class="text-center text-body1">
              <div class="text-h5 text-bold q-pb-sm">{{dashboardDat.warehouses}}</div>
              Total Warehouse
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
          <q-card style="min-height: 100%" >
            <q-card-section class="text-center">
              <q-avatar square text-color="purple-10" size="100px" font-size="100px" icon="group">
              </q-avatar>
            </q-card-section>
            <q-card-section class="text-center text-body1">
              <div class="text-h5 text-bold q-pb-sm">{{dashboardDat.staffs}}</div>
              Total Staffs
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-pa-xs">
          <q-card style="min-height: 100%" >
            <q-card-section class="text-center">
              <q-avatar square text-color="grey-8" size="100px" font-size="100px" icon="inventory_2">
              </q-avatar>
            </q-card-section>
            <q-card-section class="text-center text-body1">
              <div class="text-h5 text-bold q-pb-sm">{{dashboardDat.products}}</div>
              Total Products
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-pt-lg q-pb-md text-h5 text-bold text-primary">
          Low On Inventory
        </div>
        <div :key="data.id" v-for="(data,ind) in lowData" class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-card class="q-ma-xs">
            <q-card-section>
              <div class="text-bold text-h6">{{data.name}}</div>
              <div class="text-body1 q-pt-sm">
                <b>Warehouse: </b>{{data.warehouse}}
              </div>
              <div class="text-body1 q-pt-xs">
                <b>Remaining Stock: </b>{{data.stock_count+" "+data.category}}
              </div>
              <div class="text-body1 q-pt-xs">
                <b>Reorder Point: </b>{{data.reorder_point+" "+data.category}}
              </div>
              <div class="text-body1 q-pt-xs">
                <b>Retail Price Per {{data.category}}: </b>Rs. {{data.retail_price}}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="lowData.length<=0">
          No Any Items Low On Inventory.
        </div>
        <div class="col-12 q-pt-lg q-pb-sm">
          <div class="centerize">
            <q-pagination
              v-model="currentPage"
              :max="totalPage"
              :max-pages="5"
              :ellipses="false"
              :boundary-numbers="false"
              @click="getLowInventory"
            />
          </div>
        </div>
        <div class="col-12 q-pt-md q-pb-md text-h5 text-bold text-primary">
          Top Products Sales
        </div>
        <div :key="data.id" v-for="(data,ind) in dashboardDat.topProd" class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-card class="q-ma-xs">
            <q-card-section>
              <div class="text-bold text-h6">{{data.name}}</div>
              <div class="text-body1 q-pb-xs q-pt-xs">
                <b>Total Stock Sold: </b>{{data.purchaseCount+" "+data.category.name}}
              </div>
              <div class="text-body1">
                <b>Total Amount Sold: </b>Rs. {{data.purchaseAmount}}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="dashboardDat.topProd.length<=0">
          No Any Top Sales Found
        </div>
        <div class="col-12 q-pt-md q-pb-md text-h5 text-bold text-primary">
          Staffs Unpaid Salary
        </div>
        <div :key="i" v-for="(data,i) in dashboardDat.unpaidSalary" class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-card class="q-ma-xs">
            <q-card-section>
              <div class="text-bold text-h6">{{data.full_name}}</div>
              <div class="text-body1">
                <b>Salary Date: </b>{{data.next_salary_date.substring(0,10)}}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="dashboardDat.unpaidSalary.length<=0">
          No Unpaid Salary
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import client from "../api/Client";
export default {
  data(){
    return{
      api: client,
      dashboardDat:null,
      currentPage:1,
      totalPage:1,
      lowData:null
    }
  },
  methods:{
    getDashboard() {
      this.api.getData('dashboard').then((response)=>{
        console.log(response)
        this.dashboardDat = response

      })
    },
    getLowInventory(){
      this.api.getData('dashboard/inventory/low/'+(this.currentPage-1)).then((resp)=>{
        this.currentPage = resp.currentPage
        this.totalPage = resp.totalPage
        let lowData = []
        for(let i=0;i<resp.data.length;i++){
          for(let j=0;j<resp.data[i].warehouses.length;j++){
            if(resp.data[i].warehouses[j].reorder_point>=resp.data[i].warehouses[j].stock_count){
              lowData.push({
                mainId:resp.data[i]._id,
                id:resp.data[i].warehouses[j]._id,
                name:resp.data[i].name,
                category:resp.data[i].category.name,
                retail_price:resp.data[i].warehouses[j].retail_price,
                warehouse:resp.data[i].warehouses[j].warehouse.name,
                stock_count:resp.data[i].warehouses[j].stock_count,
                reorder_point:resp.data[i].warehouses[j].reorder_point
              })
            }
          }
        }
        this.lowData = lowData
      })
    },
  },
  created(){
    this.getDashboard()
    this.getLowInventory()
  }
}
</script>
